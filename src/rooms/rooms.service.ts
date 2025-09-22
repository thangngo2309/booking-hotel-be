// rooms.service.ts — thêm RoomAttributes/RoomAttributeDescriptions

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

type AvailabilityOpts = {
  roomTypeCodes?: string[];
  excludedRoomTypeCodes?: string[]; // mặc định ['**']
  arnDateCandidates?: string[];     // nếu cần override danh sách đoán tên cột ngày
};

const ARN_TABLE = 'AvailableRoomNight';

function normalizeRange(from: Date | string, to: Date | string) {
  const A = new Date(from);
  let B = new Date(to);
  if (A.getTime() === B.getTime()) { B = new Date(A); B.setDate(B.getDate() + 1); }
  if (A >= B) throw new Error('fromDate must be earlier than toDate');
  return { A, B };
}
function nightsBetween(A: Date, B: Date) {
  return Math.ceil((B.getTime() - A.getTime()) / (24 * 3600 * 1000));
}

@Injectable()
export class RoomsService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private ph(params: any[], value: any) { const i = params.push(value) - 1; return `@${i}`; }
  private inList(params: any[], values: any[]) { return values.map(v => this.ph(params, v)).join(', '); }

  // tự dò cột ngày trong AvailableRoomNight
  private async resolveArnDateCol(table = ARN_TABLE, candidates?: string[]) {
    const cand = candidates ?? ['OnDate','HotelDate','hDate','HDate','NightDate','StayDate','Date'];
    const rows: Array<{ name: string }> = await this.dataSource.query(
      `SELECT name FROM sys.columns WHERE object_id = OBJECT_ID(@0)`,
      [table],
    );
    const cols = new Set(rows.map(r => r.name));
    const found = cand.find(c => cols.has(c));
    if (!found) throw new Error(`Không thấy cột ngày trong ${table}. Columns: ${[...cols].join(', ')}`);
    return found;
  }

  /** CÁCH 1: AvailableRoomNight (đủ số đêm trong [A,B)) + kèm thuộc tính */
  async findAvailableRoomsByInventoryRaw(
    fromDate: Date | string,
    toDate: Date | string,
    opts: AvailabilityOpts = {},
  ) {
    const { A, B } = normalizeRange(fromDate, toDate);
    const neededNights = nightsBetween(A, B);
    const excluded = opts.excludedRoomTypeCodes ?? ['**'];
    const arnDateCol = await this.resolveArnDateCol(ARN_TABLE, opts.arnDateCandidates);

    const params: any[] = [];
    const fromPh = this.ph(params, A);
    const toPh   = this.ph(params, B);
    const nPh    = this.ph(params, neededNights);

    // Subquery đếm đủ số đêm
    const arnSub = `
      SELECT arn.RoomCode
      FROM ${ARN_TABLE} arn
      WHERE arn.[${arnDateCol}] >= ${fromPh} AND arn.[${arnDateCol}] < ${toPh}
      GROUP BY arn.RoomCode
      HAVING COUNT(DISTINCT CAST(arn.[${arnDateCol}] AS date)) = ${nPh}
    `;

    // Subquery gom thuộc tính phòng (code + description)
    const attrAgg = `
      SELECT ra.RoomCode,
             STRING_AGG(ra.AttrCode, ',') AS RoomAttributes,
             STRING_AGG(COALESCE(ra2.[Description], ''), ',') AS RoomAttributeDescriptions
      FROM [Room_Attribute] ra
      LEFT JOIN [RoomAttribute] ra2
        ON ra2.RoomAttributeCode = ra.AttrCode
      GROUP BY ra.RoomCode
    `;

    let sql = `
      SELECT r.*,
             a.RoomAttributes,
             a.RoomAttributeDescriptions
      FROM Room r
      LEFT JOIN (${attrAgg}) a ON a.RoomCode = r.RoomCode
      WHERE r.RoomCode IN (${arnSub})
    `;

    if (excluded.length) {
      sql += ` AND r.RoomTypeCode NOT IN (${this.inList(params, excluded)})`;
    }
    if (opts.roomTypeCodes?.length) {
      sql += ` AND r.RoomTypeCode IN (${this.inList(params, opts.roomTypeCodes)})`;
    }

    sql += ` ORDER BY r.RoomCode ASC`;
    return this.dataSource.query(sql, params);
  }

  /** CÁCH 2: Folio (anti-overlap) + kèm thuộc tính */
  async findAvailableRoomsByFolioRaw(
    fromDate: Date | string,
    toDate: Date | string,
    opts: AvailabilityOpts = {},
  ) {
    const { A, B } = normalizeRange(fromDate, toDate);
    const excluded = opts.excludedRoomTypeCodes ?? ['**'];

    const params: any[] = [];

    const attrAgg = `
      SELECT ra.RoomCode,
             STRING_AGG(ra.AttrCode, ',') AS RoomAttributes,
             STRING_AGG(COALESCE(ra2.[Description], ''), ',') AS RoomAttributeDescriptions
      FROM [Room_Attribute] ra
      LEFT JOIN [RoomAttribute] ra2
        ON ra2.RoomAttributeCode = ra.AttrCode
      GROUP BY ra.RoomCode
    `;

    let sql = `
      SELECT r.*,
             a.RoomAttributes,
             a.RoomAttributeDescriptions
      FROM Room r
      LEFT JOIN (${attrAgg}) a ON a.RoomCode = r.RoomCode
      WHERE 1=1
    `;

    if (excluded.length) {
      sql += ` AND r.RoomTypeCode NOT IN (${this.inList(params, excluded)})`;
    }
    if (opts.roomTypeCodes?.length) {
      sql += ` AND r.RoomTypeCode IN (${this.inList(params, opts.roomTypeCodes)})`;
    }

    const to1 = this.ph(params, B);
    const from1 = this.ph(params, A);
    const to2 = this.ph(params, B);
    const from2 = this.ph(params, A);

    sql += `
      AND NOT EXISTS (
        SELECT 1
        FROM Folio f
        WHERE f.RoomCode = r.RoomCode
          AND (f.CancelNum = 0 OR f.CancelNum IS NULL)
          AND (
            (f.FolioStatus IN (1,2) AND f.ArrivalDate < ${to1} AND f.DepartureDate > ${from1})
            OR
            (f.FolioStatus IN (4,5) AND f.ArrivalDate < ${to2} AND DATEADD(day, -1, f.DepartureDate) >= ${from2})
          )
      )
      ORDER BY r.RoomCode ASC
    `;

    return this.dataSource.query(sql, params);
  }
}
