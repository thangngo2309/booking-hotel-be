import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { Room } from './entities/room.entity';
import { Booking } from './entities/booking.entity';
import { RoomsModule } from './rooms/rooms.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 1433),
      username: process.env.DB_USER || 'sa',
      password: process.env.DB_PASS || 'YourStrong!Passw0rd',
      database: process.env.DB_NAME || 'hotel_demo',
      entities: [Hotel, Room, Booking],
      schema: 'dbo',
      synchronize: true, // DEMO; sau này đổi sang migrations
      options: { encrypt: false, trustServerCertificate: true, enableArithAbort: true },
    }),
    RoomsModule,
    BookingsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
