import { LookupValueModel } from "./shared/LookupValueModel";
import { OptionSetValueModel } from "./shared/OptionSetValueModel";

export interface CustomerTurnoverInformation {
    name: string; // rms_name
    owner: LookupValueModel; // ownerid
    accountId: LookupValueModel; // rms_accountid
    contractId: LookupValueModel; // rms_contractid
    salesOrderProductId: LookupValueModel; // rms_salesorderproductid
    period: Date; // rms_period
    netTurnover: number; // rms_netturnover
    additionalTurnover: number; // rms_additionalturnover
    lostTurnover: number; // rms_lostturnover
    liter: number; // rms_liter
    additionalLiters: number; // rms_additionalliters
    cardVehicleNumber: string; // rms_cardvehiclenumberofnights
    situation: OptionSetValueModel; // rms_situation
    subcase: OptionSetValueModel; // rms_subcase
    currentSituation: OptionSetValueModel; // rms_thecurrentsituation
    createdOn: Date; // Metadata
  }