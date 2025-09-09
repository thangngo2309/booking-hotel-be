import { Controller, Get, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CheckAvailabilityDto } from 'src/dto/rooms/check-availability.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly service: RoomsService) {}
  @Get('availability') getAvailability(@Query() q: CheckAvailabilityDto) {
    return this.service.findAvailable(q);
  }
}
