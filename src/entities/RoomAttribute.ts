import { Column, Entity } from "typeorm";

@Entity("RoomAttribute", { schema: "dbo" })
export class RoomAttribute {
  @Column("varchar", { name: "RoomAttributeCode", nullable: true, length: 30 })
  roomAttributeCode: string | null;

  @Column("varchar", { name: "Description", nullable: true, length: 100 })
  description: string | null;

  @Column("varchar", { name: "HotelID", nullable: true, length: 30 })
  hotelId: string | null;
}
