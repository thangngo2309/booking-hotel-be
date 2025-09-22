import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
// import { AvailableRoomNight } from 'src/entities/AvailableRoomNight';
// import { Folio } from 'src/entities/Folio';
// import { RoomType } from 'src/entities/RoomType';
// import { Room } from 'src/entities/Room';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
