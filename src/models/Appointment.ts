import { OptionSetValueModel } from "./shared/OptionSetValueModel";
import { LookupValueModel } from "./shared/LookupValueModel";




export interface Appointment {
  AppointmentId: string;
  Subject: string;
  ActivityTypeId: LookupValueModel;
  RegardingObjectId: LookupValueModel;
  ActivityReasonId: LookupValueModel;
  IsOnlineMeeting: boolean;
  ActivityStateId: LookupValueModel;
  IsPlannedActivity: OptionSetValueModel;
  ScheduledStart: Date;
  ScheduledEnd: Date;
  CheckIn: string;
  CheckOut: string;
  IsAllDayEvent: boolean;
  ScheduledDurationMinutes: OptionSetValueModel;
  IsCarRent: boolean;
  IsIntegration: boolean;
  IsGift: boolean;
  IsMultiAdvantage: boolean;
  IsOtelnet: boolean;
  IsOtomisyon: boolean;
  IsOKC: boolean;
  IsPassnet: boolean;
  IsPetronet: boolean;
  IsRestonet: boolean;
  IsMultiTravelPlane: boolean;
  IsMultiTravelAccommodation: boolean;
  OwnerId: LookupValueModel;
  CreatedOn: Date;
  ModifiedOn: Date;
}

export type AppointmentRequest = {
  UserId: string;
  CrmUserId: string;
  UserCityId: string;
  Name: string;
};
