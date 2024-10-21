export interface OptionSetValueModel {
  Value: number;
  Label: string;
}

export interface Offer {
  OfferId: string;
  Name: string;
  CustomerId: string;
  SalesTypeCode: OptionSetValueModel; // Updated
  Possibility: OptionSetValueModel; // Updated
  ApprovalRoleCode: OptionSetValueModel; // Updated
  IsSeasonal: boolean;
  OpportunityId: string;
  QuoteType: OptionSetValueModel; // Updated
  QuoteEndDate?: Date;
  QuoteApprovalStatus: OptionSetValueModel; // Updated
  LeadSource: OptionSetValueModel; // Updated

  // Product properties
  InterestProductId: string;
  ProductGroupId: string;
  PriceLevelId: string;
  MainProductId: string;
  ContractTerm: number;

  // Sales Manager Approval properties
  ApprovalStatus4Code: OptionSetValueModel; // Updated
  ApprovalDate4?: Date;
  ConfirmingStId: string;

  // Regional Official/Deputy Manager Approval properties
  ApprovalStatus1: OptionSetValueModel; // Updated
  ApprovalDesc1: string;
  ApprovalDate1?: Date;
  ConfirmingBmId: string;

  // Coordinator/Manager Approval properties
  ApprovalStatus2: OptionSetValueModel; // Updated
  ApprovalDesc2: string;
  ApprovalDate2?: Date;
  ConfirmingKoId: string;

  // Collection Coordinator Approval properties
  ApprovalStatus5Code: OptionSetValueModel; // Updated
  ApprovalDesc5: string;
  ApprovalDate5?: Date;
  ConfirmingThId: string;

  // General Manager Approval properties
  ApprovalStatus3: OptionSetValueModel; // Updated
  ApprovalDesc3: string;
  ApprovalDate3?: Date;
  ConfirmingGmId: string;

  OwnerId: string;
  CreatedBy?: string;
  CreatedOn?: Date;
  ModifiedOn?: Date;
}

export type OfferRequest = {
  UserId: string;
  CrmUserId: string;
  UserCityId: string;
  Name: string;
};
