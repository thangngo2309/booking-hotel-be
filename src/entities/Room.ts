import { Column, Entity } from "typeorm";

@Entity("Room", { schema: "dbo" })
export class Room {
  @Column("varchar", { name: "RoomCode", nullable: true, length: 10 })
  roomCode: string | null;

  @Column("int", { name: "NumConnectedRoom", nullable: true })
  numConnectedRoom: number | null;

  @Column("int", { name: "DisplayOrder", nullable: true })
  displayOrder: number | null;

  @Column("varchar", { name: "RoomTypeCode", nullable: true, length: 10 })
  roomTypeCode: string | null;

  @Column("smallint", { name: "Floor", nullable: true })
  floor: number | null;

  @Column("nvarchar", { name: "RoomComment", nullable: true, length: 200 })
  roomComment: string | null;

  @Column("varchar", { name: "ExposureCode", nullable: true, length: 250 })
  exposureCode: string | null;

  @Column("varchar", { name: "RoomAttributeCode", nullable: true, length: 250 })
  roomAttributeCode: string | null;

  @Column("varchar", { name: "BuildingCode", nullable: true, length: 5 })
  buildingCode: string | null;

  @Column("varchar", { name: "WingCode", nullable: true, length: 2 })
  wingCode: string | null;

  @Column("varchar", { name: "RoomRateCode", nullable: true, length: 6 })
  roomRateCode: string | null;

  @Column("smallint", { name: "NumBed", nullable: true })
  numBed: number | null;

  @Column("int", { name: "AutoAssignPriority", nullable: true })
  autoAssignPriority: number | null;

  @Column("int", { name: "HskpStation", nullable: true })
  hskpStation: number | null;

  @Column("int", { name: "HskpAssigned", nullable: true })
  hskpAssigned: number | null;

  @Column("int", { name: "HskpInHouse", nullable: true })
  hskpInHouse: number | null;

  @Column("int", { name: "HskpPickup", nullable: true })
  hskpPickup: number | null;

  @Column("int", { name: "HskpCO", nullable: true })
  hskpCo: number | null;

  @Column("bit", { name: "HSKPOccupied", nullable: true })
  hskpOccupied: boolean | null;

  @Column("bit", { name: "HSKPClean", nullable: true })
  hskpClean: boolean | null;

  @Column("bit", { name: "SYSOccupied", nullable: true })
  sysOccupied: boolean | null;

  @Column("bit", { name: "Inspected", nullable: true })
  inspected: boolean | null;

  @Column("bit", { name: "DelayCheckOutFlag", nullable: true })
  delayCheckOutFlag: boolean | null;

  @Column("bit", { name: "UnexpectStayOverFlag", nullable: true })
  unexpectStayOverFlag: boolean | null;

  @Column("bit", { name: "HasMessage", nullable: true })
  hasMessage: boolean | null;

  @Column("bit", { name: "VoiceMessage", nullable: true })
  voiceMessage: boolean | null;

  @Column("varchar", { name: "LastChangeClerkID", nullable: true, length: 7 })
  lastChangeClerkId: string | null;

  @Column("datetime", { name: "LastChangeTime", nullable: true })
  lastChangeTime: Date | null;

  @Column("int", { name: "AreaMap", nullable: true })
  areaMap: number | null;

  @Column("int", { name: "RStatus", nullable: true })
  rStatus: number | null;

  @Column("varchar", { name: "RoomName", nullable: true, length: 50 })
  roomName: string | null;

  @Column("varchar", { name: "RoomAddress", nullable: true, length: 50 })
  roomAddress: string | null;

  @Column("varchar", { name: "RoomOwner", nullable: true, length: 30 })
  roomOwner: string | null;

  @Column("varchar", { name: "HotelID", nullable: true, length: 30 })
  hotelId: string | null;

  @Column("int", { name: "TouchedUp", nullable: true })
  touchedUp: number | null;

  @Column("varchar", { name: "SlaveRoom", nullable: true, length: 20 })
  slaveRoom: string | null;
}
