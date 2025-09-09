import { IsUUID, IsDateString, IsInt, Min } from 'class-validator';
export class CheckAvailabilityDto {
  @IsUUID() hotelId: string;
  @IsDateString() checkIn: string;   // YYYY-MM-DD
  @IsDateString() checkOut: string;  // YYYY-MM-DD
  @IsInt() @Min(1) guests: number;
}
