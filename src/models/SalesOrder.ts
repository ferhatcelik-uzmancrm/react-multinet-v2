import { LookupValueModel } from "./shared/LookupValueModel";
import { OptionSetValueModel } from "./shared/OptionSetValueModel";

export interface SalesOrder {
    SalesOrderId: string;
    Name: string;
    ContractNumber: string;
    CustomerId: LookupValueModel;
    QuoteId: LookupValueModel;
    ContactId: LookupValueModel;
    OpportunityId: LookupValueModel;
    ContractStartDate?: Date | null;
    ContractEndDate?: Date | null;
    QuoteType: OptionSetValueModel;
    SalesTypeCode: OptionSetValueModel;
    IsSeasonal?: boolean | null;
    RateId: LookupValueModel;
    DtedarikFlag?: boolean | null;
    IssendErp?: boolean | null;
    SalesOrders: SalesOrderDetail[];
    CreatedOn?: Date | null;
    ModifiedOn?: Date | null;
}

export interface SalesOrderDetail {
    SalesOrderDetailId: string;
    CustomerId: LookupValueModel;
    ProductId: LookupValueModel;
    ProductGroupId: LookupValueModel;
    MainProductId: LookupValueModel;
    UomId: LookupValueModel;
    UsageTypeCode: OptionSetValueModel;
    OutSourcing: boolean;
    IsFlag: boolean;
    Description: string;
}
