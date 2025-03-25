import { LookupValueModel } from "./shared/LookupValueModel";

export interface OptionSetValueModel {
  Value: number;
  Label: string;
}

export interface Email {
  EmailId: string;
  Subject: string;
  Message: string;
  From: LookupValueModel;
  To: LookupValueModel; // Array for multiple recipients
  Cc: LookupValueModel; // Array for CC recipients
  Bcc: LookupValueModel; // Array for BCC recipients
  IsMultiNetActivity: boolean;
  RegardingObjectId: LookupValueModel;
  // ActualDurationMinutes: OptionSetValueModel; // Optional property
}

export type EmailRequest = {
  UserId: string;
  CrmUserId: string;
  UserCityId: string;
  Name: string;
};
