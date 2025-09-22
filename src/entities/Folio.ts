import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("Folio_IdxOnRoom", ["arrivalDate", "roomCode"], {})
@Index("Folio_IdxRoomFolioSts", ["roomCode", "folioStatus"], {})
@Index("PK_Folio", ["folioNum", "folioSubNum"], { unique: true })
@Entity("Folio", { schema: "dbo" })
export class Folio {
  @Column("numeric", {
    primary: true,
    name: "FolioNum",
    precision: 18,
    scale: 0,
  })
  folioNum: number;

  @Column("varchar", {
    name: "ExternalFolioNumber",
    nullable: true,
    length: 12,
  })
  externalFolioNumber: string | null;

  @Column("numeric", {
    name: "ShareNum",
    nullable: true,
    precision: 18,
    scale: 0,
  })
  shareNum: number | null;

  @Column("datetime", { name: "ArrivalDate", nullable: true })
  arrivalDate: Date | null;

  @Column("datetime", { name: "DepartureDate", nullable: true })
  departureDate: Date | null;

  @Column("int", { name: "NumRoom", nullable: true })
  numRoom: number | null;

  @Column("varchar", { name: "RoomTypeCode", nullable: true, length: 10 })
  roomTypeCode: string | null;

  @Column("varchar", { name: "RoomCode", nullable: true, length: 6 })
  roomCode: string | null;

  @Column("numeric", {
    primary: true,
    name: "FolioSubNum",
    precision: 5,
    scale: 0,
  })
  folioSubNum: number;

  @Column("varchar", { name: "GroupCode", nullable: true, length: 20 })
  groupCode: string | null;

  @Column("nvarchar", { name: "CompanyName", nullable: true, length: 120 })
  companyName: string | null;

  @Column("int", { name: "NumAdult", nullable: true })
  numAdult: number | null;

  @Column("int", { name: "NumChild", nullable: true })
  numChild: number | null;

  @Column("varchar", { name: "RateReasonCode", nullable: true, length: 2 })
  rateReasonCode: string | null;

  @Column("nvarchar", { name: "ReservGuaranty", nullable: true, length: 30 })
  reservGuaranty: string | null;

  @Column("bigint", { name: "TravelAgent1Code", nullable: true })
  travelAgent1Code: string | null;

  @Column("bigint", { name: "TravelAgent2Code", nullable: true })
  travelAgent2Code: string | null;

  @Column("datetime", { name: "ArrivalTime", nullable: true })
  arrivalTime: Date | null;

  @Column("varchar", { name: "ArrivalAirCode", nullable: true, length: 20 })
  arrivalAirCode: string | null;

  @Column("varchar", { name: "ArrivalFlight", nullable: true, length: 50 })
  arrivalFlight: string | null;

  @Column("datetime", { name: "DepartureTime", nullable: true })
  departureTime: Date | null;

  @Column("varchar", { name: "DepartureAirCode", nullable: true, length: 20 })
  departureAirCode: string | null;

  @Column("varchar", { name: "DepartureFlight", nullable: true, length: 50 })
  departureFlight: string | null;

  @Column("varchar", { name: "Geographic1Code", nullable: true, length: 10 })
  geographic1Code: string | null;

  @Column("varchar", { name: "Geographic2Code", nullable: true, length: 10 })
  geographic2Code: string | null;

  @Column("varchar", { name: "OriginCode", nullable: true, length: 10 })
  originCode: string | null;

  @Column("varchar", { name: "MarketSegmentCode", nullable: true, length: 20 })
  marketSegmentCode: string | null;

  @Column("varchar", { name: "MarketBusinessCode", nullable: true, length: 10 })
  marketBusinessCode: string | null;

  @Column("varchar", {
    name: "SourceGeographic1Code",
    nullable: true,
    length: 10,
  })
  sourceGeographic1Code: string | null;

  @Column("varchar", {
    name: "SourceGeographic2Code",
    nullable: true,
    length: 10,
  })
  sourceGeographic2Code: string | null;

  @Column("varchar", { name: "SourcePostalCode", nullable: true, length: 20 })
  sourcePostalCode: string | null;

  @Column("varchar", { name: "MarketChannelCode", nullable: true, length: 10 })
  marketChannelCode: string | null;

  @Column("nvarchar", { name: "ContactName", nullable: true, length: 30 })
  contactName: string | null;

  @Column("varchar", { name: "BuildingCode", nullable: true, length: 10 })
  buildingCode: string | null;

  @Column("varchar", { name: "WingCode", nullable: true, length: 10 })
  wingCode: string | null;

  @Column("int", { name: "LowFloor", nullable: true })
  lowFloor: number | null;

  @Column("int", { name: "HighFloor", nullable: true })
  highFloor: number | null;

  @Column("varchar", { name: "RoomExposureCode", nullable: true, length: 20 })
  roomExposureCode: string | null;

  @Column("varchar", { name: "RoomAttributeCode", nullable: true, length: 20 })
  roomAttributeCode: string | null;

  @Column("bit", { name: "SmokerFlag", nullable: true })
  smokerFlag: boolean | null;

  @Column("varchar", { name: "Notice", nullable: true, length: 1500 })
  notice: string | null;

  @Column("numeric", {
    name: "ConfirmNum",
    nullable: true,
    precision: 18,
    scale: 0,
  })
  confirmNum: number | null;

  @Column("bit", { name: "ConfirmPrintFlag", nullable: true })
  confirmPrintFlag: boolean | null;

  @Column("int", { name: "FolioStatus", nullable: true })
  folioStatus: number | null;

  @Column("int", { name: "PermFolioType", nullable: true })
  permFolioType: number | null;

  @Column("bit", { name: "RoomTaxPostedFlag", nullable: true })
  roomTaxPostedFlag: boolean | null;

  @Column("bit", { name: "TAPostedFlag", nullable: true })
  taPostedFlag: boolean | null;

  @Column("bit", { name: "NewTransactionFlag", nullable: true })
  newTransactionFlag: boolean | null;

  @Column("bit", { name: "RegistrationPrintedFlag", nullable: true })
  registrationPrintedFlag: boolean | null;

  @Column("bit", { name: "DepositPrintFlag", nullable: true })
  depositPrintFlag: boolean | null;

  @Column("bit", { name: "UnexpectedDepartureFlag", nullable: true })
  unexpectedDepartureFlag: boolean | null;

  @Column("bit", { name: "UnexpectedStayOverFlag", nullable: true })
  unexpectedStayOverFlag: boolean | null;

  @Column("bit", { name: "NoShowFlag", nullable: true })
  noShowFlag: boolean | null;

  @Column("bit", { name: "EarlyArrivalFlag", nullable: true })
  earlyArrivalFlag: boolean | null;

  @Column("bit", { name: "ReinstatedFlag", nullable: true })
  reinstatedFlag: boolean | null;

  @Column("bit", { name: "WalkInFlag", nullable: true })
  walkInFlag: boolean | null;

  @Column("bit", { name: "SysExtendedStayOverFlag", nullable: true })
  sysExtendedStayOverFlag: boolean | null;

  @Column("bit", { name: "DelayCheckOutFlag", nullable: true })
  delayCheckOutFlag: boolean | null;

  @Column("datetime", { name: "ReservationTime", nullable: true })
  reservationTime: Date | null;

  @Column("varchar", { name: "ReservationClerkID", nullable: true, length: 3 })
  reservationClerkId: string | null;

  @Column("nvarchar", { name: "CancelerName", nullable: true, length: 30 })
  cancelerName: string | null;

  @Column("numeric", {
    name: "CancelNum",
    nullable: true,
    precision: 18,
    scale: 0,
  })
  cancelNum: number | null;

  @Column("datetime", { name: "CancelTime", nullable: true })
  cancelTime: Date | null;

  @Column("varchar", { name: "CancelClerkID", nullable: true, length: 3 })
  cancelClerkId: string | null;

  @Column("datetime", { name: "CheckInTime", nullable: true })
  checkInTime: Date | null;

  @Column("varchar", { name: "CheckInClerkID", nullable: true, length: 3 })
  checkInClerkId: string | null;

  @Column("datetime", { name: "CheckOutTime", nullable: true })
  checkOutTime: Date | null;

  @Column("varchar", { name: "CheckOutClerkID", nullable: true, length: 3 })
  checkOutClerkId: string | null;

  @Column("varchar", { name: "LastChangeClerkID", nullable: true, length: 3 })
  lastChangeClerkId: string | null;

  @Column("datetime", { name: "LastChangeTime", nullable: true })
  lastChangeTime: Date | null;

  @Column("varchar", {
    name: "ExternalConfirmNumber",
    nullable: true,
    length: 12,
  })
  externalConfirmNumber: string | null;

  @Column("varchar", { name: "UserDefineCode1", nullable: true, length: 10 })
  userDefineCode1: string | null;

  @Column("varchar", { name: "UserDefineCode2", nullable: true, length: 10 })
  userDefineCode2: string | null;

  @Column("varchar", { name: "UserDefineCode3", nullable: true, length: 10 })
  userDefineCode3: string | null;

  @Column("varchar", { name: "UserDefineCode4", nullable: true, length: 10 })
  userDefineCode4: string | null;

  @Column("varchar", { name: "UserDefineCode5", nullable: true, length: 10 })
  userDefineCode5: string | null;

  @Column("varchar", { name: "UserDefineCode6", nullable: true, length: 10 })
  userDefineCode6: string | null;

  @Column("varchar", { name: "UserDefineCode7", nullable: true, length: 10 })
  userDefineCode7: string | null;

  @Column("varchar", { name: "UserDefineCode8", nullable: true, length: 10 })
  userDefineCode8: string | null;

  @Column("varchar", { name: "RoomRateCode", nullable: true, length: 10 })
  roomRateCode: string | null;

  @Column("varchar", { name: "PaymentCode", nullable: true, length: 10 })
  paymentCode: string | null;

  @Column("varchar", { name: "PartyCode", nullable: true, length: 50 })
  partyCode: string | null;

  @PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
  id: number;

  @Column("varchar", { name: "CreditCode", nullable: true, length: 10 })
  creditCode: string | null;

  @Column("varchar", { name: "CreditCardNum", nullable: true, length: 30 })
  creditCardNum: string | null;

  @Column("varchar", {
    name: "CreditCardExpireTime",
    nullable: true,
    length: 20,
  })
  creditCardExpireTime: string | null;

  @Column("varchar", { name: "PackageCode", nullable: true, length: 10 })
  packageCode: string | null;

  @Column("bit", { name: "TransferHoldFlag", nullable: true })
  transferHoldFlag: boolean | null;

  @Column("numeric", {
    name: "RateAmount",
    nullable: true,
    precision: 19,
    scale: 2,
  })
  rateAmount: number | null;

  @Column("bit", { name: "RateOverideFlag", nullable: true })
  rateOverideFlag: boolean | null;

  @Column("bit", { name: "ConfidentialFlag", nullable: true })
  confidentialFlag: boolean | null;

  @Column("bit", { name: "NoPostFlag", nullable: true })
  noPostFlag: boolean | null;

  @Column("varchar", { name: "CreditCardTypeCode", nullable: true, length: 20 })
  creditCardTypeCode: string | null;

  @Column("bit", { name: "HouseUseFlag", nullable: true })
  houseUseFlag: boolean | null;

  @Column("bit", { name: "CompFlag", nullable: true })
  compFlag: boolean | null;

  @Column("datetime", { name: "PackageBeginDate", nullable: true })
  packageBeginDate: Date | null;

  @Column("nvarchar", { name: "Booker", nullable: true, length: 50 })
  booker: string | null;

  @Column("varchar", { name: "BookByCode", nullable: true, length: 10 })
  bookByCode: string | null;

  @Column("numeric", {
    name: "ARAccountNumber",
    nullable: true,
    precision: 18,
    scale: 0,
  })
  arAccountNumber: number | null;

  @Column("tinyint", { name: "BookStatus", nullable: true })
  bookStatus: number | null;

  @Column("bit", { name: "Allotment", nullable: true })
  allotment: boolean | null;

  @Column("bigint", { name: "AllotmentTA", nullable: true })
  allotmentTa: string | null;

  @Column("varchar", { name: "AllotmentContract", nullable: true, length: 20 })
  allotmentContract: string | null;

  @Column("bit", { name: "NetRate", nullable: true })
  netRate: boolean | null;

  @Column("varchar", { name: "SubGroupCode", nullable: true, length: 20 })
  subGroupCode: string | null;

  @Column("bit", { name: "IncludeBF", nullable: true })
  includeBf: boolean | null;

  @Column("varchar", { name: "CancelReason", nullable: true, length: 100 })
  cancelReason: string | null;

  @Column("varchar", { name: "BreakfastCode", nullable: true, length: 3 })
  breakfastCode: string | null;

  @Column("varchar", { name: "FolioCurrencyCode", nullable: true, length: 3 })
  folioCurrencyCode: string | null;

  @Column("int", { name: "ExtraBed", nullable: true })
  extraBed: number | null;

  @Column("bit", { name: "RoomChargeToMasterFlag", nullable: true })
  roomChargeToMasterFlag: boolean | null;

  @Column("numeric", {
    name: "FolioExRate",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  folioExRate: number | null;

  @Column("int", { name: "NumGuestBF", nullable: true })
  numGuestBf: number | null;

  @Column("varchar", { name: "LastName", nullable: true, length: 100 })
  lastName: string | null;

  @Column("varchar", { name: "FirstName", nullable: true, length: 130 })
  firstName: string | null;

  @Column("varchar", { name: "TitleCodeM", nullable: true, length: 10 })
  titleCodeM: string | null;

  @Column("varchar", { name: "TelNumM", nullable: true, length: 100 })
  telNumM: string | null;

  @Column("varchar", { name: "FaxNumM", nullable: true, length: 100 })
  faxNumM: string | null;

  @Column("varchar", { name: "MailM", nullable: true, length: 100 })
  mailM: string | null;

  @Column("numeric", {
    name: "ProfileNumber",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  profileNumber: number | null;

  @Column("numeric", {
    name: "CreditLimit",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  creditLimit: number | null;

  @Column("bit", { name: "BlockFlag", nullable: true })
  blockFlag: boolean | null;

  @Column("varchar", { name: "BlockClerkID", nullable: true, length: 10 })
  blockClerkId: string | null;

  @Column("varchar", { name: "RoomTypeBooked", nullable: true, length: 20 })
  roomTypeBooked: string | null;

  @Column("datetime", { name: "TraceDate", nullable: true })
  traceDate: Date | null;

  @Column("varchar", { name: "CreditCardHolder", nullable: true, length: 50 })
  creditCardHolder: string | null;

  @Column("varchar", {
    name: "CreditCardSecureCode",
    nullable: true,
    length: 20,
  })
  creditCardSecureCode: string | null;

  @Column("numeric", {
    name: "CancelCharge",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  cancelCharge: number | null;

  @Column("varchar", { name: "MemberID", nullable: true, length: 30 })
  memberId: string | null;

  @Column("varchar", { name: "MemberSubID", nullable: true, length: 30 })
  memberSubId: string | null;

  @Column("numeric", {
    name: "CreditCardBlockAmount",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  creditCardBlockAmount: number | null;

  @Column("datetime", { name: "OrgArrDate", nullable: true })
  orgArrDate: Date | null;

  @Column("datetime", { name: "OrgDeptDate", nullable: true })
  orgDeptDate: Date | null;

  @Column("bigint", { name: "LastShareNum", nullable: true })
  lastShareNum: string | null;

  @Column("varchar", { name: "UserInfo1", nullable: true, length: 200 })
  userInfo1: string | null;

  @Column("varchar", { name: "UserInfo2", nullable: true, length: 200 })
  userInfo2: string | null;

  @Column("varchar", { name: "UserInfo3", nullable: true, length: 200 })
  userInfo3: string | null;

  @Column("varchar", { name: "UserInfo4", nullable: true, length: 200 })
  userInfo4: string | null;

  @Column("numeric", {
    name: "DscPcnt",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  dscPcnt: number | null;

  @Column("numeric", {
    name: "DscAmount",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  dscAmount: number | null;

  @Column("bit", { name: "UpdateExRateAtCI", nullable: true })
  updateExRateAtCi: boolean | null;

  @Column("int", { name: "NumChildBF", nullable: true })
  numChildBf: number | null;

  @Column("varchar", { name: "PrvOwnerID", nullable: true, length: 30 })
  prvOwnerId: string | null;

  @Column("int", { name: "MonthlyRate", nullable: true })
  monthlyRate: number | null;

  @Column("int", { name: "PostAtDay", nullable: true })
  postAtDay: number | null;

  @Column("varchar", { name: "TraceNote", nullable: true, length: 500 })
  traceNote: string | null;

  @Column("varchar", { name: "HotelID", nullable: true, length: 50 })
  hotelId: string | null;

  @Column("varchar", { name: "WebRoomType", nullable: true, length: 30 })
  webRoomType: string | null;

  @Column("int", { name: "CntRoom", nullable: true })
  cntRoom: number | null;

  @Column("bigint", { name: "CntFolio", nullable: true })
  cntFolio: string | null;

  @Column("numeric", {
    name: "FolioBalance",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  folioBalance: number | null;

  @Column("int", { name: "RmChgTrn", nullable: true })
  rmChgTrn: number | null;

  @Column("varchar", { name: "EncCreditCardNum", nullable: true, length: 50 })
  encCreditCardNum: string | null;

  @Column("int", { name: "ChargeNights", nullable: true })
  chargeNights: number | null;

  @Column("bigint", { name: "CnSlaveFolio", nullable: true })
  cnSlaveFolio: string | null;

  @Column("bigint", { name: "CnMasterFolio", nullable: true })
  cnMasterFolio: string | null;

  @Column("numeric", {
    name: "CommRate",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  commRate: number | null;

  @Column("numeric", {
    name: "CommAmount",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  commAmount: number | null;
}
