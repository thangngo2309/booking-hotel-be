import { Column, Entity } from "typeorm";

@Entity("RoomType", { schema: "dbo" })
export class RoomType {
  @Column("varchar", { name: "RoomTypeCode", nullable: true, length: 10 })
  roomTypeCode: string | null;

  @Column("varchar", { name: "ClassCode", nullable: true, length: 2 })
  classCode: string | null;

  @Column("int", { name: "DisplayOrder", nullable: true })
  displayOrder: number | null;

  @Column("int", { name: "NumRoom", nullable: true })
  numRoom: number | null;

  @Column("varchar", { name: "Description", nullable: true, length: 50 })
  description: string | null;

  @Column("int", { name: "NumGuestAvailability", nullable: true })
  numGuestAvailability: number | null;

  @Column("varchar", { name: "RateCode", nullable: true, length: 20 })
  rateCode: string | null;

  @Column("numeric", {
    name: "HSKPStayUnit",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  hskpStayUnit: number | null;

  @Column("int", { name: "HSKPStayTime", nullable: true })
  hskpStayTime: number | null;

  @Column("numeric", {
    name: "HSKPCOUnit",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  hskpcoUnit: number | null;

  @Column("int", { name: "HSKPCOTime", nullable: true })
  hskpcoTime: number | null;

  @Column("varchar", { name: "CruiseCode", nullable: true, length: 20 })
  cruiseCode: string | null;

  @Column("int", { name: "TrnCode", nullable: true })
  trnCode: number | null;

  @Column("int", { name: "TrnSubCode", nullable: true })
  trnSubCode: number | null;

  @Column("varchar", { name: "WebRoomType", nullable: true, length: 30 })
  webRoomType: string | null;

  @Column("varchar", { name: "HotelID", nullable: true, length: 30 })
  hotelId: string | null;
}
