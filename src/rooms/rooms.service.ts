import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from '../entities/room.entity';
import { Repository } from 'typeorm';
import { CheckAvailabilityDto } from 'src/dto/rooms/check-availability.dto';

@Injectable()
export class RoomsService {
  constructor(@InjectRepository(Room) private rooms: Repository<Room>) {}

  async findAvailable(dto: CheckAvailabilityDto) {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);
    if (!(checkIn < checkOut)) throw new BadRequestException('Khoảng ngày không hợp lệ');

    return this.rooms.createQueryBuilder('r')
      .where('r.hotelId = :hotelId', { hotelId: dto.hotelId })
      .andWhere('r.capacity >= :guests', { guests: dto.guests })
      .andWhere(qb => {
        const sub = qb.subQuery()
          .select('1').from('bookings', 'b')
          .where('b.roomId = r.id')
          .andWhere(':checkIn < b.checkOut AND b.checkIn < :checkOut')
          .getQuery();
        return `NOT EXISTS ${sub}`;
      })
      .setParameters({ checkIn, checkOut })
      .orderBy('r.pricePerNight', 'ASC')
      .getMany();
  }
}
