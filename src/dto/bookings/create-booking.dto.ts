import { IsDateString, IsOptional, IsString, ValidateIf, IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @IsDateString()
  fromDate!: string; // ISO: YYYY-MM-DD

  @IsDateString()
  toDate!: string;   // exclusive; nếu day-use thì có thể = fromDate (sẽ được chuẩn hoá)

  @IsOptional()
  @IsString()
  roomCode?: string;

  @ValidateIf(o => !o.roomCode)
  @IsString()
  @IsNotEmpty()
  roomTypeCode?: string; // bắt buộc nếu không truyền roomCode

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  firstname?: string; // nếu cần lưu, bổ sung vào INSERT

  @IsOptional()
  @IsString()
  lastname?: string;
}
