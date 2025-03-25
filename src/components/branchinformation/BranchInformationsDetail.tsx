/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  KeyboardDoubleArrowLeftRounded,
  KeyboardDoubleArrowRightRounded,
} from "@mui/icons-material/";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import {
  Container,
  createTheme,
  Grid,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  TextField,
  ThemeProvider,
} from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { BrandColors, BrandOptions } from "../../enums/Enums";
import { getCRMData, sendRequest } from "../../requests/ApiCall";
import { LookupOptionType } from "../../models/shared/Lookup";
import { OptionSetType } from "../../models/shared/OptionSetValueModel";
import { GenericAutocomplete, OptionSet } from "../../helper/Lookup";
import AlertComponent from "../../widgets/Alert";
import Spinner from "../../widgets/Spinner";
import { BranchInformation } from "../../models/BranchInformation";

const gridItemSize = {
  xs: 12,
  sm: 12,
  md: 6,
  lg: 6,
  xl: 6
};

const BranchInformationsDetail: React.FC = () => {
  const { selectedBrand } = useAppContext();
  const { id } = useParams();
  const location = useLocation();
  const stateData = location.state?.data || [];
  const steps = ["", ""];
  const [alertState, setAlertState] = useState({
    message: "",
    type: "success" as "success" | "danger",
    position: "bottom-right" as "bottom-right" | "center",
    showProgress: false,
    isOpen: false
  });

  const closeAlert = () => {
    setAlertState((prevState) => ({ ...prevState, isOpen: false }));
  };

  const [loading, setLoading] = useState(Boolean);
  const [errors, setErrors] = React.useState<{ [key: string]: boolean }>({});
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const getByBrand = () => {
    switch (selectedBrand) {
      case BrandOptions.Avis:
        return {
          btnColor: BrandColors.AvisDark
        };
      case BrandOptions.Filo:
        return {
          btnColor: BrandColors.FiloDark
        };
      case BrandOptions.Budget:
        return {
          btnColor: BrandColors.BudgetDark
        };

      default:
        return {
          btnColor: "#333333"
        };
    }
  };

  const { btnColor } = getByBrand();

  const defaultTheme = createTheme({
    palette: {
      primary: {
        main: btnColor
      }
    }
  });

  const [branchInformation, setBranchInformation] = useState<BranchInformation>(
    {
      BranchName: "", // rms_name
      AccountId: { Id: "", Name: "", LogicalName: "" }, // rms_accountid
      AccountNumber: "", // rms_accountnumber
      ReferenceBranchCode: "", // rms_referencebranchcode
      BranchId: "", // rms_branchid
      BranchInformationId: "", // rms_branchinformationid (GUID)
      RelatedCompany: { Id: "", Name: "", LogicalName: "" }, // rms_relatedaccountid
      ErpCode: { Id: "", Name: "", LogicalName: "" }, // rms_erpcodeid
      ContractType: false, // rms_isbranchbasedcontract
      BranchType: { Value: 0, Label: "" }, // rms_branchtypecode
      Description: "", // rms_description (Opsiyonel olarak belirttim, boş olabilir)
      OwnerId: { Id: "", Name: "", LogicalName: "" } // ownerid
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const response = await getCRMData("api/get-branchinformation-by-id", id);
          setBranchInformation(response.data);
        }
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, []);

  const handleSelectFieldChange2 =
    (fieldName: string) =>
    (value: LookupOptionType | LookupOptionType[] | null) => {
      if (Array.isArray(value)) {
        // Çoklu seçim modunda
        const selectedIds = value.map((option) => option.Id).join(", ");
        const selectedNames = value.map((option) => option.Name).join(", ");
        setBranchInformation((prev) => ({
          ...prev,
          [fieldName]: { Id: selectedIds, Name: selectedNames }
        }));
      } else {
        setBranchInformation((prev) => ({
          ...prev,
          [fieldName]: {
            Id: value ? value.Id : "",
            Name: value ? value.Name : ""
          }
        }));
      }
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // alert(JSON.stringify(lead))
    setLoading(true);

    try {
      await sendRequest("api/create-offer", branchInformation)
        .then((response) => {
          setAlertState({
            message: "Offer created successfully!",
            type: "success",
            position: "bottom-right",
            showProgress: true,
            isOpen: true
          });
        })
        .catch((error) => {
          console.error("Error creating offer:", error);
          setAlertState({
            message: "Error creating offer. Please try again.",
            type: "danger",
            position: "bottom-right",
            showProgress: true,
            isOpen: true
          });
        });
    } catch (error) {
      console.error("Error:", error);
      setAlertState({
        message: "Error creating offer. Please try again.",
        type: "danger",
        position: "bottom-right",
        showProgress: true,
        isOpen: true
      });
    } finally {
      setLoading(false);
    }

    // window.location.reload();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setBranchInformation((prevLead) => ({
      ...prevLead,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: false
      }));
    }
  };

  const handleSelectOptionFieldChange = (fieldName: string) => (value: OptionSetType | OptionSetType[] | null) => {
      if (Array.isArray(value)) {
        // Çoklu seçim modunda
        const selectedIds = value.map((option) => option.Value).join(", ");
        const selectedNames = value.map((option) => option.Label).join(", ");
        setBranchInformation((prev) => ({
          ...prev,
          [fieldName]: { Value: selectedIds, Label: selectedNames }
        }));
      } else {
        // Tekli seçim modunda
        setBranchInformation((prev) => ({
          ...prev,
          [fieldName]: {
            Value: value ? value.Value : "",
            Label: value ? value.Label : ""
          }
        }));
      }
    };
  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  //If companyType is contact
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item {...gridItemSize} sx={{ display: "none" }}>
              <TextField
                label="Şube Bilgi Id"
                fullWidth
                variant="outlined"
                name="BranchInformationId"
                value={branchInformation.BranchInformationId}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Şube Adı"
                fullWidth
                variant="outlined"
                name="BranchName"
                value={branchInformation.BranchName}
                onChange={handleInputChange}
                error={!!errors.BranchName}
                helperText={errors.BranchName ? "Bu alan zorunludur" : ""}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Şube No"
                fullWidth
                variant="outlined"
                name="BranchId"
                value={branchInformation.BranchId}
                onChange={handleInputChange}
                error={!!errors.BranchId}
                helperText={errors.BranchId ? "Bu alan zorunludur" : ""}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/get-all-accounts"
                label="Şube"
                getCRMData={getCRMData}
                selectedValue={
                  branchInformation.AccountId
                    ? {
                        Id: branchInformation.AccountId.Id,
                        Name: branchInformation.AccountId.Name,
                        LogicalName: branchInformation.AccountId.LogicalName
                      }
                    : null
                }
                onValueChange={handleSelectFieldChange2("AccountId")}
                error={!!errors.AccountId}
                helperText={errors.AccountId ? "Bu alan zorunludur" : ""}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Firma Numarası"
                fullWidth
                variant="outlined"
                name="AccountNumber"
                value={branchInformation.AccountNumber}
                onChange={handleInputChange}
                error={!!errors.AccountNumber}
                helperText={errors.AccountNumber ? "Bu alan zorunludur" : ""}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Garanti Şube Kodu"
                fullWidth
                variant="outlined"
                name="ReferenceBranchCode"
                value={branchInformation.ReferenceBranchCode}
                onChange={handleInputChange}
                error={!!errors.ReferenceBranchCode}
                helperText={errors.ReferenceBranchCode ? "Bu alan zorunludur" : ""}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/get-all-accounts"
                label="Bağlı Olduğu Firma"
                getCRMData={getCRMData}
                selectedValue={
                  branchInformation.RelatedCompany
                    ? {
                        Id: branchInformation.RelatedCompany.Id,
                        Name: branchInformation.RelatedCompany.Name,
                        LogicalName: branchInformation.RelatedCompany.LogicalName
                      }
                    : null
                }
                onValueChange={handleSelectFieldChange2("RelatedCompany")}
                error={!!errors.RelatedCompany}
                helperText={errors.RelatedCompany ? "Bu alan zorunludur" : ""}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/search-lookup-by-name/new_customererprecord/new_name"
                label="ERP Kodu"
                getCRMData={getCRMData}
                selectedValue={
                  branchInformation.ErpCode
                    ? {
                        Id: branchInformation.ErpCode.Id,
                        Name: branchInformation.ErpCode.Name,
                        LogicalName: branchInformation.ErpCode.LogicalName
                      }
                    : null
                }
                onValueChange={handleSelectFieldChange2("ErpCode")}
                error={!!errors.ErpCode}
                helperText={errors.ErpCode ? "Bu alan zorunludur" : ""}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                select
                label="Şube Tipi"
                fullWidth
                variant="outlined"
                id="BranchType"
                name="BranchType"
                value={branchInformation.BranchType.Value}
                onChange={handleInputChange}
                error={!!errors.BranchType}
                helperText={errors.BranchType ? "Bu alan zorunludur" : ""}
              >
                <MenuItem value={0}>---</MenuItem>
                <MenuItem value={1}>Üye Şube</MenuItem>
                <MenuItem value={2}>Müşteri Şube</MenuItem>
                <MenuItem value={3}>MCR Şube</MenuItem>
                <MenuItem value={4}>MultiTravel Müşteri Şube</MenuItem>
                <MenuItem value={5}>MultiTravel Üye Şube</MenuItem>
              </TextField>
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                select
                label="Sözleşme Tipi"
                fullWidth
                variant="outlined"
                id="ContractType"
                name="ContractType"
                value={Number(branchInformation.ContractType)}
                onChange={handleInputChange}
                error={!!errors.ContractType}
                helperText={errors.ContractType ? "Bu alan zorunludur" : ""}
              >
                <MenuItem value="">---</MenuItem>
                <MenuItem value={0}>Şubeye Bağlı</MenuItem>
                <MenuItem value={1}>Firmaya Bağlı</MenuItem>
              </TextField>
            </Grid>
            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/get-all-users"
                label="Sahibi"
                getCRMData={getCRMData}
                selectedValue={
                  branchInformation.OwnerId
                    ? {
                        Id: branchInformation.OwnerId.Id,
                        Name: branchInformation.OwnerId.Name,
                        LogicalName: branchInformation.OwnerId.LogicalName
                      }
                    : null
                }
                onValueChange={handleSelectFieldChange2("OwnerId")}
                error={!!errors.OwnerId}
                helperText={errors.OwnerId ? "Bu alan zorunludur" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Açıklama"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                name="Description"
                value={branchInformation.Description || ""}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Container
      sx={{
        maxWidth: {
          xs: "100%",
          sm: "600px",
          md: "960px",
          lg: "1280px",
          xl: "1920px"
        },
        display: "block"
      }}
    >
      {/* CUSTOM ALERT */}
      <AlertComponent
        message={alertState.message}
        type={alertState.type}
        position={alertState.position}
        showProgress={alertState.showProgress}
        isOpen={alertState.isOpen}
        onClose={closeAlert}
      />
      {/* CUSTOM ALERT */}

      {loading ? (
        <Spinner type="hash" size={50} color="#d0052d" />
      ) : (
        <Box sx={{ width: "100%" }}>
          <ThemeProvider theme={defaultTheme}>
            <Stepper
              activeStep={activeStep}
              sx={{
                "& .MuiSvgIcon-root": {
                  color:
                    selectedBrand === BrandOptions.Budget
                      ? BrandColors.Budget
                      : BrandColors.AvisDark
                }
              }}
            >
              {steps.map((label, index) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: { optional?: React.ReactNode } = {};
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </ThemeProvider>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Box sx={{ mt: 3 }}>
                <form onSubmit={handleSubmit}>
                  {/* Fill stepper content here. */}
                  {getStepContent(activeStep)}
                </form>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                {/* Back Button */}
                <Button
                  sx={{
                    m: 1,
                    width: "25px",
                    borderColor: "GrayText",
                    "&:hover": {
                      borderColor:
                        selectedBrand === BrandOptions.Budget
                          ? BrandColors.Budget
                          : BrandColors.AvisDark,
                      cursor: "pointer"
                    },
                    "&:active": {
                      color: "dark"
                    }
                  }}
                  variant="outlined"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  <KeyboardDoubleArrowLeftRounded
                    sx={{
                      color: btnColor,
                      "&:hover": {
                        color:
                          selectedBrand === BrandOptions.Budget
                            ? BrandColors.Budget
                            : BrandColors.AvisDark,
                        cursor: "pointer"
                      },
                      "&:active": {
                        color: "dark"
                      }
                    }}
                  />
                </Button>

                <Box sx={{ flex: "1 1 auto" }} />

                {/* Next or Submit Button */}
                {activeStep === steps.length - 1 ? null : (
                  <Button
                    variant="outlined"
                    onClick={handleNext}
                    sx={{
                      m: 1,
                      width: "25px",
                      borderColor: "GrayText",
                      "&:hover": {
                        borderColor:
                          selectedBrand === BrandOptions.Budget
                            ? BrandColors.Budget
                            : BrandColors.AvisDark,
                        cursor: "pointer"
                      },
                      "&:active": {
                        color: "dark"
                      }
                    }}
                  >
                    <KeyboardDoubleArrowRightRounded
                      sx={{
                        color: btnColor,
                        "&:hover": {
                          color:
                            selectedBrand === BrandOptions.Budget
                              ? BrandColors.Budget
                              : BrandColors.AvisDark,
                          cursor: "pointer"
                        },
                        "&:active": {
                          color: "dark"
                        }
                      }}
                    />
                  </Button>
                )}
              </Box>
            </React.Fragment>
          )}
        </Box>
      )}
    </Container>
  );
};

export default BranchInformationsDetail;
