import { Column, Entity } from "typeorm";

@Entity("AvailableRoomNight", { schema: "dbo" })
export class AvailableRoomNight {
  @Column("datetime", { name: "hDate", nullable: true })
  hDate: Date | null;

  @Column("varchar", { name: "RoomCode", nullable: true, length: 10 })
  roomCode: string | null;

  @Column("varchar", { name: "HotelID", nullable: true, length: 30 })
  hotelId: string | null;
}
