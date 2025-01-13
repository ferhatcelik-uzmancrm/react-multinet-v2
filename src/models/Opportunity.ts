import { OptionSetValueModel } from "./shared/OptionSetValueModel";
import { LookupValueModel } from "./shared/LookupValueModel";


export interface Opportunity {
  OpportunityId: string;
  Name: string;
  OpportunityNumber: string;
  CustomerId: string;
  CustomerName: string;
  EstimatedRevenue: number;
  CloseDate: string | null;
  SalesStage: number;
  SalesTypeCode: number;
  ParentContactId: string;
  ParentContactName: string;
  ParentAccountId: string;
  ParentAccountName: string;
  EstimatedCloseDate: string | null;
  OpportunityRatingCode: number;
  OpportunityRatingName: string;
  LeadSource: OptionSetValueModel;
  ProductGroup: LookupValueModel;
  CurrentSituation: string;
  CustomerNeed: string;
  ProposedSolution: string;
  OwnerId: LookupValueModel;
  CreatedBy: string;
  CreatedOn: string;
  ModifiedOn: string;
  ModifiedBy: string;
}

export type OpportunityRequest = {
  UserId: string;
  CrmUserId: string;
  UserCityId: string;
  Name: string;
};
