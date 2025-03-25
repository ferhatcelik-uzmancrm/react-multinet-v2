import { LookupValueModel } from "./shared/LookupValueModel";
import { OptionSetValueModel } from "./shared/OptionSetValueModel";

export interface QuoteDetail {
    QuoteDetailId: string; // Guid
    Name: string; // string
    OptionDay: string; // new_optionday
    PricePerUnit: string; // priceperunit
    Description: string; // rms_description
    Quantity: string; // quantity
    ContractTerm: number; // new_contractterm
    Rate: string; // rms_rate
    ExtendedAmount: string; // extendedamount
    CreatedOn: Date; // createdon
    CustomerId: LookupValueModel; // rms_customerid
    QuoteId: LookupValueModel; // quoteid
    QuoteProductGroupId: LookupValueModel; // rms_quoteproductgroupid
    ProductGroupId: LookupValueModel; // rms_productgroupid
    MainProductId: LookupValueModel; // rms_mainproductid
    ProductId: LookupValueModel; // productid
    UomId: LookupValueModel; // uomid
    SettlementType: OptionSetValueModel; // new_settlementtype
    IsProductOverridden: boolean; // isproductoverridden
    OutSourcing: boolean; // rms_outsourcing
    UsageTypeCode: OptionSetValueModel; // rms_usagetypecode
    ServiceCostMonthCode: OptionSetValueModel; // rms_servicecostmonthcode
    IsUpdated: boolean; // rms_isupdated
  };

  export type QuoteDetailRequest = {
    UserId: string;
    CrmUserId: string;
    UserCityId: string;
    Name: string;
  };