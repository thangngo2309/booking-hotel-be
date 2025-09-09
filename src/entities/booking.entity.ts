import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { Room } from './room.entity';

@Entity({ name: 'bookings' })
export class Booking {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => Room, r => r.bookings, { eager: false }) room: Room;
  @Index() @Column({ type: 'uniqueidentifier' }) roomId: string;

  @Index() @Column({ type: 'datetime2' }) checkIn: Date;
  @Index() @Column({ type: 'datetime2' }) checkOut: Date;

  @Column({ type: 'nvarchar', length: 120 }) guestName: string;
  @Column({ type: 'nvarchar', length: 30, nullable: true }) phone?: string;
}
