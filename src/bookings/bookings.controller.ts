import { Body, Controller, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from 'src/dto/bookings/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly service: BookingsService) {}
  @Post() create(@Body() dto: CreateBookingDto) { return this.service.create(dto); }
}
