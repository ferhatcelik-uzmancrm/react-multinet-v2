import { LookupValueModel } from "./shared/LookupValueModel";
import { OptionSetValueModel } from "./shared/OptionSetValueModel";

export interface BranchInformation {
    BranchName: string; // rms_name
    AccountId: LookupValueModel; // rms_accountid
    AccountNumber: string; // rms_accountnumber
    ReferenceBranchCode: string; // rms_referencebranchcode
    BranchId: string; // rms_branchid
    BranchInformationId: string; // rms_branchinformationid (GUID)
    RelatedCompany: LookupValueModel; // rms_relatedaccountid
    ErpCode: LookupValueModel; // rms_erpcodeid
    ContractType: boolean; // rms_isbranchbasedcontract
    BranchType: OptionSetValueModel; // rms_branchtypecode
    Description?: string; // rms_description (Opsiyonel olarak belirttim, boş olabilir)
    OwnerId: LookupValueModel; // ownerid
}