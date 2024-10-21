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
  LeadSource: number;
  CurrentSituation: string;
  CustomerNeed: string;
  ProposedSolution: string;
  OwnerId: string;
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
