import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from '../entities/booking.entity';
import { Repository, DataSource } from 'typeorm';
import { Room } from '../entities/room.entity';
import { CreateBookingDto } from 'src/dto/bookings/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    private readonly ds: DataSource,
    @InjectRepository(Booking) private bookings: Repository<Booking>,
    @InjectRepository(Room) private rooms: Repository<Room>,
  ) {}

  async create(dto: CreateBookingDto) {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);
    if (!(checkIn < checkOut)) throw new BadRequestException('Khoảng ngày không hợp lệ');

    return this.ds.transaction('SERIALIZABLE', async manager => {
      const room = await manager.getRepository(Room)
        .createQueryBuilder('r')
        .where('r.id = :id', { id: dto.roomId })
        .setLock('pessimistic_write')
        .getOne();
      if (!room) throw new BadRequestException('Phòng không tồn tại');

      const overlap = await manager.getRepository(Booking).createQueryBuilder('b')
        .where('b.roomId = :roomId', { roomId: dto.roomId })
        .andWhere(':checkIn < b.checkOut AND b.checkIn < :checkOut', { checkIn, checkOut })
        .getExists();
      if (overlap) throw new BadRequestException('Phòng đã có booking trùng lịch');

      const saved = await manager.getRepository(Booking).save(
        manager.getRepository(Booking).create({
          roomId: dto.roomId, checkIn, checkOut,
          guestName: dto.guestName, phone: dto.phone,
        }),
      );
      return { id: saved.id, message: 'Đặt phòng thành công' };
    });
  }
}
