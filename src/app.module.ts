import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsModule } from './rooms/rooms.module';
import { BookingsModule } from './bookings/bookings.module';
import { RoomType } from './entities/RoomType';
import { RoomAttribute } from './entities/RoomAttribute';
import { Room } from './entities/Room';
import { Folio } from './entities/Folio';
import { AvailableRoomNight } from './entities/AvailableRoomNight';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 1433),
      username: process.env.DB_USER || 'sa',
      password: process.env.DB_PASS || 'P@ssw0rd',
      database: process.env.DB_NAME || 'hotel_demo',
      // entities: [AvailableRoomNight, Folio, Room, RoomAttribute, RoomType],
      schema: 'dbo',
      synchronize: false, // DEMO; sau này đổi sang migrations
      options: { encrypt: false, trustServerCertificate: true, enableArithAbort: true },
    }),
    RoomsModule,
    BookingsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
