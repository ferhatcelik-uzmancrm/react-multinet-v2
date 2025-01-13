import { LookupValueModel } from "./shared/LookupValueModel";


export interface Phone {
  PhoneId: string;
  Subject: string;
  From: LookupValueModel[];
  To: LookupValueModel[];
  RegardingObjectId: LookupValueModel;
  PhoneNumber: string;
  DirectionCode: boolean;
  ActivityTypeId: LookupValueModel;
  ActivityReasonId: LookupValueModel;
  ActivityStateId: LookupValueModel;
  AramaKod: string;
  Gakampnayaad: string;
  IsPlannedActivity: boolean;
}

export type PhoneRequest = {
  UserId: string;
  CrmUserId: string;
  UserCityId: string;
  Name: string;
};
