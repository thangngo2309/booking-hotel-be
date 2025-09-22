// src/bookings/bookings.service.ts
import { Injectable, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateBookingDto } from 'src/dto/bookings/create-booking.dto';
import { DataSource, QueryRunner } from 'typeorm';

function normalizeRange(from: Date | string, to: Date | string) {
  const A = new Date(from);
  let B = new Date(to);
  if (isNaN(A.valueOf()) || isNaN(B.valueOf())) {
    throw new BadRequestException('Invalid date format. Use YYYY-MM-DD.');
  }
  // day-use: [A, A] -> [A, A+1)
  if (A.getTime() === B.getTime()) {
    B = new Date(A);
    B.setDate(B.getDate() + 1);
  }
  if (A >= B) throw new BadRequestException('fromDate must be earlier than toDate');
  return { A, B };
}

// helpers cho placeholder kiểu @0,@1,... (MS SQL)
function ph(params: any[], value: any) { const i = params.push(value) - 1; return `@${i}`; }
function inList(params: any[], arr: any[]) { return arr.map(v => ph(params, v)).join(', '); }

@Injectable()
export class BookingsService {
  constructor(@InjectDataSource() private readonly ds: DataSource) {}

  // ======= Fully-qualified table names (đổi nếu schema khác) =======
  private static readonly FOLIO_TABLE_FO = '[SMILE_FO].[dbo].[Folio]';
  private static readonly FOLIO_TABLE_BO = '[SMILE_BO].[dbo].[Folio]';
  // Room có thể ở FO hoặc BO -> sẽ dò ở runtime và cache lại:
  private roomTableCache?: string;

  // ---------- Dò bảng Room ở FO -> BO (và cache) ----------
  private async resolveRoomTable(runner: QueryRunner): Promise<string> {
    if (this.roomTableCache) return this.roomTableCache;

    // Thử FO trước
    const qFO = `
      SELECT TOP (1) 1 AS ok
      FROM [SMILE_FO].sys.tables t
      JOIN [SMILE_FO].sys.schemas s ON s.schema_id = t.schema_id
      WHERE t.name = N'Room' AND s.name = N'dbo';
    `;
    const foRows = await runner.query(qFO);
    if (foRows.length) {
      this.roomTableCache = '[SMILE_FO].[dbo].[Room]';
      return this.roomTableCache;
    }

    // Fallback: BO
    const qBO = `
      SELECT TOP (1) 1 AS ok
      FROM [SMILE_BO].sys.tables t
      JOIN [SMILE_BO].sys.schemas s ON s.schema_id = t.schema_id
      WHERE t.name = N'Room' AND s.name = N'dbo';
    `;
    const boRows = await runner.query(qBO);
    if (boRows.length) {
      this.roomTableCache = '[SMILE_BO].[dbo].[Room]';
      return this.roomTableCache;
    }

    throw new InternalServerErrorException(`Không tìm thấy bảng [dbo].[Room] ở SMILE_FO hoặc SMILE_BO`);
  }

  // ---------- App-lock tiện dụng ----------
  private async getAppLock(runner: QueryRunner, resource: string, timeoutMs = 10_000) {
    const p: any[] = [];
    const rsrc = ph(p, resource);
    await runner.query(`
      DECLARE @res int;
      EXEC @res = sp_getapplock
        @Resource    = ${rsrc},
        @LockMode    = 'Exclusive',
        @LockOwner   = 'Transaction',
        @LockTimeout = ${timeoutMs};
      IF (@res < 0) THROW 51000, 'APPLOCK_TIMEOUT', 1;
    `, p);
  }

  // ---------- Cấp số FolioNum/FolioSubNum TOÀN CỤC (nhìn cả FO & BO) ----------
  private async allocateNewFolioNumberPairGlobal(
    runner: QueryRunner,
  ): Promise<{ folioNum: number; folioSubNum: number }> {
    await this.getAppLock(runner, 'FOLIO_NUM_ALLOC_GLOBAL');

    const fo = await runner.query(`
      SELECT ISNULL(MAX(FolioNum), 0) AS MaxFolioNum
      FROM ${BookingsService.FOLIO_TABLE_FO} WITH (TABLOCKX, HOLDLOCK);
    `);
    const bo = await runner.query(`
      SELECT ISNULL(MAX(FolioNum), 0) AS MaxFolioNum
      FROM ${BookingsService.FOLIO_TABLE_BO} WITH (TABLOCKX, HOLDLOCK);
    `);
    const maxAll = Math.max(fo?.[0]?.MaxFolioNum ?? 0, bo?.[0]?.MaxFolioNum ?? 0);
    return { folioNum: maxAll + 1, folioSubNum: 1 };
  }

  private async allocateNextSubFolioNumberGlobal(
    runner: QueryRunner,
    folioNum: number,
  ): Promise<{ folioNum: number; folioSubNum: number }> {
    await this.getAppLock(runner, `FOLIO_SUB_ALLOC_GLOBAL_${folioNum}`);

    const p1: any[] = [], f1 = ph(p1, folioNum);
    const fo = await runner.query(`
      SELECT ISNULL(MAX(FolioSubNum), 0) AS MaxSub
      FROM ${BookingsService.FOLIO_TABLE_FO} WITH (UPDLOCK, HOLDLOCK)
      WHERE FolioNum = ${f1};
    `, p1);

    const p2: any[] = [], f2 = ph(p2, folioNum);
    const bo = await runner.query(`
      SELECT ISNULL(MAX(FolioSubNum), 0) AS MaxSub
      FROM ${BookingsService.FOLIO_TABLE_BO} WITH (UPDLOCK, HOLDLOCK)
      WHERE FolioNum = ${f2};
    `, p2);

    const nextSub = Math.max(fo?.[0]?.MaxSub ?? 0, bo?.[0]?.MaxSub ?? 0) + 1;
    return { folioNum, folioSubNum: nextSub };
  }

  private async generateFolioNumbersGlobal(
    runner: QueryRunner,
    folioNum?: number,
  ): Promise<{ folioNum: number; folioSubNum: number }> {
    return folioNum != null
      ? this.allocateNextSubFolioNumberGlobal(runner, folioNum)
      : this.allocateNewFolioNumberPairGlobal(runner);
  }

  // ---------- Insert cùng params vào CẢ 2 DB ----------
  private async insertFolioIntoBothDbs(
    runner: QueryRunner,
    cols: string[],
    valsPlaceholders: string[],
    params: any[],
  ) {
    const columnsSql = cols.map(c => `[${c}]`).join(', ');
    const valuesSql  = valsPlaceholders.join(', ');

    const insertFO = `
      INSERT INTO ${BookingsService.FOLIO_TABLE_FO} (${columnsSql})
      VALUES (${valuesSql});
    `;
    const insertBO = `
      INSERT INTO ${BookingsService.FOLIO_TABLE_BO} (${columnsSql})
      VALUES (${valuesSql});
    `;

    await runner.query(insertFO, params);
    await runner.query(insertBO, params);
  }

  // ---------- Kiểm tra phòng trống + khóa ----------
  private async assertRoomAvailableWithLock(runner: QueryRunner, roomCode: string, A: Date, B: Date) {
    const ROOM_TABLE = await this.resolveRoomTable(runner);

    // Khoá dòng Room để serialize
    const pLock: any[] = [];
    const rcLock = ph(pLock, roomCode);
    const lockSql = `SELECT r.RoomCode FROM ${ROOM_TABLE} r WITH (UPDLOCK, HOLDLOCK) WHERE r.RoomCode = ${rcLock};`;
    const locked = await runner.query(lockSql, pLock);
    if (!locked.length) throw new BadRequestException('Invalid roomCode');

    // Tìm overlap trong Folio (FO)
    const p: any[] = [];
    const rc  = ph(p, roomCode);
    const to1 = ph(p, B);
    const from1 = ph(p, A);
    const to2 = ph(p, B);
    const from2 = ph(p, A);

    const overlap = `
      SELECT TOP (1) 1
      FROM ${BookingsService.FOLIO_TABLE_FO} f WITH (HOLDLOCK, UPDLOCK)
      WHERE f.RoomCode = ${rc}
        AND (f.CancelNum = 0 OR f.CancelNum IS NULL)
        AND (
          (f.FolioStatus IN (1,2) AND f.ArrivalDate < ${to1} AND f.DepartureDate > ${from1})
          OR
          (f.FolioStatus IN (4,5) AND f.ArrivalDate < ${to2} AND DATEADD(day, -1, f.DepartureDate) >= ${from2})
        );
    `;
    const rows = await runner.query(overlap, p);
    if (rows.length) throw new ConflictException('Room is not available in the given range.');
  }

  // ---------- Chọn TOP(1) phòng trống theo loại ----------
  private async pickFreeRoomByTypeWithLock(runner: QueryRunner, roomTypeCode: string, A: Date, B: Date) {
    const ROOM_TABLE = await this.resolveRoomTable(runner);

    const params: any[] = [];
    const rtc = ph(params, roomTypeCode);
    const to1 = ph(params, B);
    const from1 = ph(params, A);
    const to2 = ph(params, B);
    const from2 = ph(params, A);
    const excluded = ['**'];
    const excl = inList(params, excluded);

    const sql = `
      SELECT TOP (1) r.RoomCode
      FROM ${ROOM_TABLE} r WITH (UPDLOCK, HOLDLOCK)
      WHERE r.RoomTypeCode = ${rtc}
        AND r.RoomTypeCode NOT IN (${excl})
        AND NOT EXISTS (
          SELECT 1
          FROM ${BookingsService.FOLIO_TABLE_FO} f WITH (HOLDLOCK, UPDLOCK)
          WHERE f.RoomCode = r.RoomCode
            AND (f.CancelNum = 0 OR f.CancelNum IS NULL)
            AND (
              (f.FolioStatus IN (1,2) AND f.ArrivalDate < ${to1} AND f.DepartureDate > ${from1})
              OR
              (f.FolioStatus IN (4,5) AND f.ArrivalDate < ${to2} AND DATEADD(day, -1, f.DepartureDate) >= ${from2})
            )
        )
      ORDER BY r.RoomCode ASC;
    `;
    const rows = await runner.query(sql, params);
    if (!rows.length) return null;
    return { roomCode: rows[0].RoomCode as string };
  }

  // ---------- API tạo booking ----------
  async create(dto: CreateBookingDto) {
    const { A, B } = normalizeRange(dto.fromDate, dto.toDate);
    if (!dto.roomCode && !dto.roomTypeCode) {
      throw new BadRequestException('Either roomCode or roomTypeCode is required.');
    }

    const runner = this.ds.createQueryRunner();
    await runner.connect();

    try {
      await runner.startTransaction('SERIALIZABLE');

      // cấp số toàn cục (FO & BO)
      const { folioNum, folioSubNum } = await this.generateFolioNumbersGlobal(runner);

      // 1) Đặt theo roomCode cố định
      if (dto.roomCode) {
        await this.assertRoomAvailableWithLock(runner, dto.roomCode, A, B);

        const p: any[] = [];
        const cols: string[] = ['FolioNum', 'FolioSubNum', 'RoomCode', 'ArrivalDate', 'DepartureDate', 'FolioStatus', 'CancelNum'];
        const vals: string[] = [
          ph(p, folioNum),
          ph(p, folioSubNum),
          ph(p, dto.roomCode),
          ph(p, A),
          ph(p, B),
          ph(p, 1), // booking
          ph(p, 0), // not cancelled
        ];

        if (dto.firstname !== undefined) { cols.push('FirstName'); vals.push(ph(p, dto.firstname)); }
        if (dto.lastname  !== undefined) { cols.push('LastName');  vals.push(ph(p, dto.lastname)); }
        
        await this.insertFolioIntoBothDbs(runner, cols, vals, p);

        await runner.commitTransaction();
        return { ok: true, folioNum, folioSubNum, roomCode: dto.roomCode, fromDate: A, toDate: B };
      }

      // 2) Đặt theo roomTypeCode → pick phòng trống
      const picked = await this.pickFreeRoomByTypeWithLock(runner, dto.roomTypeCode!, A, B);
      if (!picked) throw new ConflictException('No available room for the given type and date range.');

      const p2: any[] = [];
      const cols2: string[] = ['FolioNum', 'FolioSubNum', 'RoomCode', 'ArrivalDate', 'DepartureDate', 'FolioStatus', 'CancelNum'];
      const vals2: string[] = [
        ph(p2, folioNum),
        ph(p2, folioSubNum),
        ph(p2, picked.roomCode),
        ph(p2, A),
        ph(p2, B),
        ph(p2, 1),
        ph(p2, 0),
      ];

      if (dto.firstname !== undefined) { cols2.push('FirstName'); vals2.push(ph(p2, dto.firstname)); }
      if (dto.lastname  !== undefined) { cols2.push('LastName');  vals2.push(ph(p2, dto.lastname)); }
      
      await this.insertFolioIntoBothDbs(runner, cols2, vals2, p2);

      await runner.commitTransaction();
      return { ok: true, folioNum, folioSubNum, roomCode: picked.roomCode, fromDate: A, toDate: B };
    } catch (e) {
      try { await runner.rollbackTransaction(); } catch {}
      if (e instanceof ConflictException || e instanceof BadRequestException) throw e;
      throw new InternalServerErrorException(e.message ?? 'Booking failed');
    } finally {
      try { await runner.release(); } catch {}
    }
  }
}
