import { LookupValueModel } from "./shared/LookupValueModel";

export interface Address {
    AddressId:string;
    Account: LookupValueModel;
    Country: LookupValueModel;
    City: LookupValueModel;
    Town: LookupValueModel;
    Neighbourhood: LookupValueModel;
    Road: LookupValueModel;
    Street: LookupValueModel;
    StateCode: number | null; // int? -> number | null
    AddressType: number; // Guid -> string
    PostalCode: string; // Guid -> string
    Latitude: string; // Guid -> string
    Longitude: string; // DateTime? -> Date | null
    Name: string; // DateTime? -> Date | null
    CreatedOn: Date; // DateTime? -> Date | null
  }