import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Hotel } from './entities/hotel.entity';
import { Room } from './entities/room.entity';
import { Booking } from './entities/booking.entity';

const ds = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 1433),
  username: process.env.DB_USER || 'sa',
  password: process.env.DB_PASS || 'YourStrong!Passw0rd',
  database: process.env.DB_NAME || 'hotel_demo',
  entities: [Hotel, Room, Booking],
  synchronize: true,
  options: { encrypt: false, trustServerCertificate: true, enableArithAbort: true },
});

function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }

(async () => {
  await ds.initialize();
  const hotelRepo = ds.getRepository(Hotel);
  const roomRepo = ds.getRepository(Room);
  const bookingRepo = ds.getRepository(Booking);

  await ds.getRepository(Booking).clear(); // TRUNCATE an toàn
  await ds.createQueryBuilder().delete().from(Room).execute();   // DELETE FROM Rooms
  await ds.createQueryBuilder().delete().from(Hotel).execute();  

  const hotels = await hotelRepo.save([
    hotelRepo.create({ name: 'KS Biển Xanh', address: '123 Võ Nguyên Giáp' }),
    hotelRepo.create({ name: 'KS Phố Cổ', address: '45 Hàng Bạc' }),
  ]);

  const rooms: Room[] = [];
  for (const h of hotels) for (let i = 1; i <= 10; i++) {
    rooms.push(roomRepo.create({
      hotelId: h.id, name: `Phòng ${100 + i}`, capacity: 2 + (i % 3),
      pricePerNight: 500_000 + (i % 5) * 50_000,
    }));
  }
  const savedRooms = await roomRepo.save(rooms);

  const today = new Date();
  const sample: Booking[] = [];
  for (const r of savedRooms.slice(0, 6)) {
    const offset = Math.floor(Math.random() * 10);
    const stay = 1 + Math.floor(Math.random() * 4);
    sample.push(bookingRepo.create({
      roomId: r.id,
      checkIn: addDays(today, offset),
      checkOut: addDays(today, offset + stay),
      guestName: 'Nguyễn Văn A',
      phone: '0900000000',
    }));
  }
  await bookingRepo.save(sample);

  console.log('✅ Seed xong'); await ds.destroy();
})();
