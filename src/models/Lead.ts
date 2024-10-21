export type Lead = {
  id: string;
  companyname: string;
  emailaddress3: string;
  telephone1: string;

  LeadId: string;
  Subject: string;
  FirstName: string;
  LastName: string;
  CompanyName: string;
  BrandName: string;
  JobTitleName: string;
  JobTitleId: string;
  EmailAddress: string;
  BusinessEmailAddress: string;
  BusinessPhone: string;
  MobilePhone: string;
  Fax: string;
  WebsiteUrl: string;
  LeadSource: string;
  LeadSourceCode: string;

  CountryId: string;
  CountryName: string;
  CityId: string;
  CityName: string;
  TownId: string;
  TownName: string;
  NeighbourhoodId: string;
  Neighbourhood: string;
  Addressline1: string;

  StatusCode: string;
  OwnerId: string;
  CreatedOn: string;
  ModifiedOn: string;
  CreatedBy: string;
  ModifiedBy: string;
};

export type LeadRequest = {
  userid: string;
  crmuserid: string;
  usercityid: string;
  new_taxnumber: string;
  name: string;
};
