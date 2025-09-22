import { Controller, Get, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CheckAvailabilityDto } from 'src/dto/rooms/check-availability.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly service: RoomsService) {}
  @Get('availability') getAvailability() {
    const from = '2025-09-23';
    const to   = '2025-09-24'; // exclusive
    const filters = {
      roomTypeCodes: ['DLK-SV', 'DLX DBL', 'DLT', 'STUDK', 'STUDT'],
      excludedRoomTypeCodes: ['**'],
    };

    return this.service.findAvailableRoomsByFolioRaw(from, to, filters);
  }

  @Get('availability2') getAvailability2() {

    const from = '2025-09-23';
    const to   = '2025-09-24'; // exclusive
    const filters = {
      roomTypeCodes: ['DLK-SV', 'DLX DBL', 'DLT', 'STUDK', 'STUDT'],
      excludedRoomTypeCodes: ['**'],
    };

    return this.service.findAvailableRoomsByInventoryRaw(from, to, filters);
  }
}
