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

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

// Phân bổ số giường dựa trên capacity:
// - doubleBeds (giường đôi) chiếm 2 khách/giường
// - singleBeds (giường đơn) chiếm 1 khách/giường
// Trả về: { beds: tổng số giường, signleBeds: số giường đơn }
function distributeBeds(capacity: number) {
  const maxDoubleBeds = Math.floor(capacity / 2);
  const doubleBeds = Math.floor(Math.random() * (maxDoubleBeds + 1));
  const signleBeds = capacity - doubleBeds * 2;
  const beds = doubleBeds + signleBeds; // tổng số giường
  return { beds, signleBeds, doubleBeds };
}

(async () => {
  try {
    await ds.initialize();

    const hotelRepo = ds.getRepository(Hotel);
    const roomRepo = ds.getRepository(Room);
    const bookingRepo = ds.getRepository(Booking);

    // Xóa dữ liệu cũ (tôn trọng ràng buộc FK: xóa Booking trước)
    await bookingRepo.clear(); // TRUNCATE an toàn với TypeORM
    await ds.createQueryBuilder().delete().from(Room).execute();
    await ds.createQueryBuilder().delete().from(Hotel).execute();

    // Seed hotels
    const hotels = await hotelRepo.save([
      hotelRepo.create({ name: 'KS Biển Xanh', address: '123 Võ Nguyên Giáp' }),
      hotelRepo.create({ name: 'KS Phố Cổ', address: '45 Hàng Bạc' }),
    ]);

    // Seed rooms (10 phòng mỗi khách sạn), có thêm description, beds, signleBeds
    const rooms: Room[] = [];
    for (const h of hotels) {
      for (let i = 1; i <= 10; i++) {
        const capacity = 2 + (i % 3); // 2..4
        const { beds, signleBeds, doubleBeds } = distributeBeds(capacity);

        const descriptionParts: string[] = [
          `Phòng tiêu chuẩn tại ${h.name}`,
          `${capacity} khách`,
          `${beds} giường`,
        ];
        const detailBeds: string[] = [];
        if (doubleBeds > 0) detailBeds.push(`${doubleBeds} giường đôi`);
        if (signleBeds > 0) detailBeds.push(`${signleBeds} giường đơn`);
        if (detailBeds.length) descriptionParts.push(`(${detailBeds.join(', ')})`);

        const description = descriptionParts.join(' • ');

        rooms.push(
          roomRepo.create({
            hotelId: h.id,
            name: `Phòng ${100 + i}`,
            capacity,
            pricePerNight: 500_000 + (i % 5) * 50_000,
            // các field mới:
            description,
            beds,
            signleBeds, // chú ý: giữ đúng tên property như entity
          }),
        );
      }
    }
    const savedRooms = await roomRepo.save(rooms);

    // Seed sample bookings ngẫu nhiên
    const today = new Date();
    const sample: Booking[] = [];
    for (const r of savedRooms.slice(0, 6)) {
      const offset = Math.floor(Math.random() * 10);
      const stay = 1 + Math.floor(Math.random() * 4);
      sample.push(
        bookingRepo.create({
          roomId: r.id,
          checkIn: addDays(today, offset),
          checkOut: addDays(today, offset + stay),
          guestName: 'Nguyễn Văn A',
          phone: '0900000000',
        }),
      );
    }
    await bookingRepo.save(sample);

    console.log('✅ Seed xong');
  } catch (err) {
    console.error('❌ Seed lỗi:', err);
  } finally {
    await ds.destroy();
  }
})();
