import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Room } from './room.entity';

@Entity({ name: 'hotels' })
export class Hotel {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'nvarchar', length: 200 }) name: string;
  @Column({ type: 'nvarchar', length: 300, nullable: true }) address?: string;
  @OneToMany(() => Room, r => r.hotel) rooms: Room[];
}
