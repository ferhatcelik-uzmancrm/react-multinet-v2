export type Contact = {
  ContactId: string;
  FirstName: string;
  LastName: string;
  ContactTitleId: string;
  ContactTitleName: string;
  ParentCustomerId: string;
  ParentCustomerName: string;
  TcNo: string;
  GenderCode: number;
  BirthDate: Date;
  MobilePhone: string;
  Telephone: string;
  EmailAddress: string;
  CountryId: string;
  Country: string;
  City: string;
  CityId: string;
  CityName: string;
  Town: string;
  TownId: string;
  TownName: string;
  NeighbourhoodId: string;
  Neighbourhood: string;
  PostalCode: string;
  AddressLine: string;
  OwnerId: string;
  CreatedBy: string;
};

export type ContactRequest = {
  OwnerId: string;
  ContactId: string;
  UserId: string;
  CrmUserId: string;
  UserCityId: string;
  Name: string;
  MobilePhone: string;
};
