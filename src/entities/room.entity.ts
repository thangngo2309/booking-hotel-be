import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Index } from 'typeorm';
import { Hotel } from './hotel.entity';
import { Booking } from './booking.entity';

@Entity({ name: 'rooms' })
export class Room {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => Hotel, h => h.rooms, { eager: false }) hotel: Hotel;
  @Index() @Column({ type: 'uniqueidentifier' }) hotelId: string;

  @Column({ type: 'nvarchar', length: 100 }) name: string;
  @Column({ type: 'int', default: 2 }) capacity: number;
  @Column({ type: 'nvarchar' }) description: string;
  @Column({ type: 'int' }) beds: number;
  @Column({ type: 'int' }) signleBeds: number;
  @Column({ type: 'decimal', precision: 18, scale: 2 }) pricePerNight: number;

  @OneToMany(() => Booking, b => b.room) bookings: Booking[];
}
