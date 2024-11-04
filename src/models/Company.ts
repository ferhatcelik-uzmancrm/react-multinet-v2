export type Company = {
  CompanyId: string;
  Name: string;
  BrandName: string;
  InvoiceName: string;
  IsAccountType: boolean;
  TaxNumber: string;
  TcNo: string;
  EmailAddress: string;
  MobilePhone: string;

  TaxOfficeId: string;
  TaxOfficeName: string;
  CompanyTypeId: string;
  CompanyTypeName: string;
  GroupAccountId: string;
  GroupAccountName: string;
  LeadSource: number;
  CustomerSector: string;
  IsBranch: boolean;
  CardType: string;
  Description: string;

  OwnerId: string;
  CreatedOn: string;
  ModifiedOn: string;
  CreatedBy: string;
  ModifiedBy: string;
};

export type CompanyRequest = {
  UserId: string;
  CrmUserId: string;
  UserCityId: string;
  TaxNumber: string;
  Name: string;
};
