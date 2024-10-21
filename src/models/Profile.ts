export interface LookupValueModel {
    Id: string;
    Name: string;
  }
  
  export interface OptionSetValueModel {
    Value: number;
    Label: string;
  }
  
  export interface Profile {
    UserId:string;
    UserName: string;
    Password: string;
    City: LookupValueModel;
    Email: string;
    
  }
  
  export type ProfileRequest = {
    UserId: string;
  };