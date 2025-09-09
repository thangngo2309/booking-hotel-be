import { IsUUID, IsDateString, IsNotEmpty } from 'class-validator';
// Có thể thêm @IsPhoneNumber('VN') nếu muốn
export class CreateBookingDto {
  @IsUUID() roomId: string;
  @IsDateString() checkIn: string;
  @IsDateString() checkOut: string;
  @IsNotEmpty() guestName: string;
  phone?: string;
}
