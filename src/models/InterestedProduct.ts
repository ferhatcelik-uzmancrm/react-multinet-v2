import { LookupValueModel } from "./shared/LookupValueModel";


export interface InterestedProduct{
  InterestedProductId: string;
  Name: string;
  LeadId: LookupValueModel;
  AccountId: LookupValueModel;
  OpportunityId: LookupValueModel;
  ContractId: LookupValueModel;
  QuoteId: LookupValueModel;
  IsCustomerOrMember: boolean | null;
  ProductGroupId: LookupValueModel;
  MainProductId: LookupValueModel;
  ProductId: LookupValueModel;
  Description: string | null;
  SelfOwnedVehicleNumber: number | null;
  NumberLeasedCar: number | null;
  VehiclesRequested: number | null;
  RequestedRentalTime: number | null;
  OwnerId: string;
  CreatedOn: Date | null;
  ModifiedOn: Date | null;
}

export type InterestedProductRequest = {
  UserId: string;
  CrmUserId: string;
  UserCityId: string;
  Name: string;
};
