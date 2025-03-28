import { ThemeProvider } from "@emotion/react";
import {
  KeyboardDoubleArrowLeftRounded,
  KeyboardDoubleArrowRightRounded
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  createTheme,
  Grid,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { BrandColors, BrandOptions } from "../../enums/Enums";
import { GenericAutocomplete } from "../../helper/Lookup";
import { Lead } from "../../models/Lead";
import { LookupOptionType } from "../../models/shared/Lookup";
import { getCRMData, sendRequest } from "../../requests/ApiCall";
import AlertComponent from "../../widgets/Alert";
import Spinner from "../../widgets/Spinner";

const gridItemSize = {
  xs: 12,
  sm: 12,
  md: 6,
  lg: 6,
  xl: 6
};

const LeadsCreate: React.FC = () => {
  const { selectedBrand } = useAppContext();
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
  var crmOwner = sessionStorage.getItem("crmuserid");

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

  const [lead, setLead] = useState<Lead>({
    LeadId: "",
    Subject: "",
    FirstName: "",
    LastName: "",
    CompanyName: "",
    BrandName: "",
    JobTitleName: "",
    JobTitleId: "",
    EmailAddress: "",
    BusinessEmailAddress: "",
    BusinessPhone: "",
    MobilePhone: "",
    Fax: "",
    WebsiteUrl: "",
    LeadSource: "",
    LeadSourceCode: "",
    CountryId: "",
    CountryName: "",
    CityName: "",
    CityId: "",
    NeighbourhoodId: "",
    Neighbourhood: "",
    TownName: "",
    TownId: "",
    Addressline1: "",
    StatusCode: "",
    OwnerId: crmOwner || "",
    CreatedOn: "",
    ModifiedOn: "",
    CreatedBy: crmOwner || "",
    ModifiedBy: "",
    companyname: "",
    emailaddress3: "",
    id: "",
    telephone1: ""
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLead((prevLead) => ({
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

  const handleSelectFieldChange =
    (idField: string, nameField: string) =>
    (value: LookupOptionType | LookupOptionType[] | null) => {
      if (Array.isArray(value)) {
        // Çoklu seçim modunda birden fazla seçili öğe varsa
        const selectedIds = value.map((option) => option.Id).join(", ");
        const selectedNames = value.map((option) => option.Name).join(", ");
        setLead((prev) => ({
          ...prev,
          [idField]: selectedIds,
          [nameField]: selectedNames
        }));
      } else {
        // Tekli seçim modunda
        setLead((prev) => ({
          ...prev,
          [idField]: value ? value.Id : null,
          [nameField]: value ? value.Name : ""
        }));
      }
    };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requiredFields = [
      "CompanyName",
      "BusinessPhone",
      "BusinessEmailAddress",
      "LeadSource",
      "FirstName",
      "LastName",
      "JobTitleId",
      "EmailAddress",
      "MobilePhone",
      "WebsiteUrl",
      "CountryId",
      "CityId",
      "TownId",
      "Neighbourhood",
      "Addressline1"
    ];

    const newErrors: { [key: string]: boolean } = {};

    requiredFields.forEach((field) => {
      if (!lead[field as keyof typeof lead]) {
        newErrors[field] = true;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setAlertState({
        message: "Lütfen tüm zorunlu alanları doldurun.",
        type: "danger",
        position: "bottom-right",
        showProgress: false,
        isOpen: true
      });
      return;
    }

    setLoading(true);

    // Format the data properly for the API
    const formattedLead = {
      // Use proper Guid.Empty format for empty ID
      LeadId: lead.LeadId || "00000000-0000-0000-0000-000000000000",

      // Basic lead information
      FirstName: lead.FirstName,
      LastName: lead.LastName,
      CompanyName: lead.CompanyName,
      BrandName: lead.BrandName,

      // Convert string values to proper types
      JobTitleId: lead.JobTitleId || "00000000-0000-0000-0000-000000000000",
      EmailAddress: lead.EmailAddress,
      BusinessEmailAddress: lead.BusinessEmailAddress,
      BusinessPhone: lead.BusinessPhone,
      MobilePhone: lead.MobilePhone,
      WebsiteUrl: lead.WebsiteUrl,

      // Location information
      CountryId: lead.CountryId || "00000000-0000-0000-0000-000000000000",
      CityId: lead.CityId || "00000000-0000-0000-0000-000000000000",
      TownId: lead.TownId || "00000000-0000-0000-0000-000000000000",
      NeighbourhoodId:
        lead.NeighbourhoodId || "00000000-0000-0000-0000-000000000000",
      Addressline1: lead.Addressline1,

      // CRITICAL: Convert string to integer for OptionSetValue
      LeadSourceCode: parseInt(lead.LeadSourceCode) || 0,

      // System user references
      OwnerId: lead.OwnerId || "00000000-0000-0000-0000-000000000000",
      CreatedBy: lead.CreatedBy || "00000000-0000-0000-0000-000000000000"
    };

    try {
      // Use your existing API method but with properly formatted data
      const response = await getCRMData("api/upsert-lead",formattedLead);

      setAlertState({
        message: "Lead başarıyla kaydedildi!",
        type: "success",
        position: "bottom-right",
        showProgress: true,
        isOpen: true
      });
    } catch (error) {
      console.error("Error:", error);
      setAlertState({
        message: "Lead kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.",
        type: "danger",
        position: "bottom-right",
        showProgress: true,
        isOpen: true
      });
    } finally {
      setLoading(false);
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
  const getStepContactContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            {/* <Grid item {...gridItemSize}>
                            <GenericAutocomplete
                                apiEndpoint="api/search-companies-by-name"
                                label="Firma"
                                getCRMData={getCRMData}
                            />
                        </Grid> */}
            <Grid item {...gridItemSize}>
              <TextField
                label="Firma Adı"
                fullWidth
                variant="outlined"
                id="CompanyName"
                name="CompanyName"
                value={lead.CompanyName}
                onChange={handleInputChange}
                required
                error={!!errors.CompanyName}
                helperText={errors.CompanyName ? "Bu alan zorunludur" : ""}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Marka Adı"
                fullWidth
                variant="outlined"
                id="BrandName"
                name="BrandName"
                value={lead.BrandName}
                onChange={handleInputChange}
                required
                error={!!errors.BrandName}
                helperText={errors.BrandName ? "Bu alan zorunludur" : ""}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Firma İletişim Telefonu"
                fullWidth
                variant="outlined"
                id="BusinessPhone"
                name="BusinessPhone"
                value={lead.BusinessPhone}
                onChange={handleInputChange}
                required
                error={!!errors.BusinessPhone}
                helperText={errors.BusinessPhone ? "Bu alan zorunludur" : ""}
              />
            </Grid>

            <Grid item {...gridItemSize}>
              <TextField
                label="Firma E-posta Adresi"
                fullWidth
                variant="outlined"
                id="BusinessEmailAddress"
                name="BusinessEmailAddress"
                value={lead.BusinessEmailAddress}
                onChange={handleInputChange}
                required
                error={!!errors.BusinessEmailAddress}
                helperText={
                  errors.BusinessEmailAddress ? "Bu alan zorunludur" : ""
                }
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/get-source"
                label="Müşteri Aday Kaynağı"
                getCRMData={getCRMData}
                selectedValue={
                  lead.LeadSourceCode
                    ? {
                        Id: lead.LeadSourceCode,
                        Name: lead.LeadSource,
                        LogicalName: ""
                      }
                    : null
                }
                onValueChange={handleSelectFieldChange(
                  "LeadSourceCode",
                  "LeadSource"
                )}
                required={true} // Alan zorunlu
                error={!!errors.LeadSource} // Hata kontrolü
                helperText={errors.LeadSource ? "Bu alan zorunludur" : ""} // Hata mesajı
              />
            </Grid>
            {/* <Grid item {...gridItemSize}>
                            <TextField
                                label="Müşteri Aday Kaynağı"
                                fullWidth
                                variant="outlined"
                                id="LeadSource"
                                name="LeadSource"
                                value={lead.LeadSource}
                                onChange={handleInputChange}
                                required
                                error={!!errors.LeadSource}
                                helperText={errors.LeadSource ? 'Bu alan zorunludur' : ''}
                            />
                        </Grid> */}

            {/* İLGİLİ KİŞİ READONLY */}
            <Grid item {...gridItemSize}>
              <TextField
                label="Adı"
                fullWidth
                variant="outlined"
                id="FirstName"
                name="FirstName"
                value={lead.FirstName}
                onChange={handleInputChange}
                required
                error={!!errors.FirstName}
                helperText={errors.FirstName ? "Bu alan zorunludur" : ""}
                // InputProps={{
                //     readOnly: true,
                // }}
              />
            </Grid>

            <Grid item {...gridItemSize}>
              <TextField
                label="Soyadı"
                fullWidth
                variant="outlined"
                id="LastName"
                name="LastName"
                value={lead.LastName}
                onChange={handleInputChange}
                required
                error={!!errors.LastName}
                helperText={errors.LastName ? "Bu alan zorunludur" : ""}
                // InputProps={{
                //     readOnly: true,
                // }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/search-contacttitle-by-name"
                label="Yetkili Unvanı"
                getCRMData={getCRMData}
                selectedValue={
                  lead.JobTitleId
                    ? {
                        Id: lead.JobTitleId,
                        Name: lead.JobTitleName,
                        LogicalName: ""
                      }
                    : null
                }
                onValueChange={handleSelectFieldChange(
                  "JobTitleId",
                  "JobTitleName"
                )}
              />
            </Grid>

            <Grid item {...gridItemSize}>
              <TextField
                label="E-posta Adresi"
                fullWidth
                variant="outlined"
                id="EmailAddress"
                name="EmailAddress"
                value={lead.EmailAddress}
                onChange={handleInputChange}
                required
                error={!!errors.EmailAddress}
                helperText={errors.EmailAddress ? "Bu alan zorunludur" : ""}
                // InputProps={{
                //     readOnly: true,
                // }}
              />
            </Grid>

            <Grid item {...gridItemSize}>
              <TextField
                label="Cep Telefonu"
                fullWidth
                variant="outlined"
                id="MobilePhone"
                name="MobilePhone"
                value={lead.MobilePhone}
                onChange={handleInputChange}
                required
                error={!!errors.MobilePhone}
                helperText={errors.MobilePhone ? "Bu alan zorunludur" : ""}
                // InputProps={{
                //     readOnly: true,
                // }}
              />
            </Grid>

            <Grid item {...gridItemSize}>
              <TextField
                label="Web Sitesi"
                fullWidth
                variant="outlined"
                id="WebsiteUrl"
                name="WebsiteUrl"
                value={lead.WebsiteUrl}
                onChange={handleInputChange}
                required
                error={!!errors.WebsiteUrl}
                helperText={errors.WebsiteUrl ? "Bu alan zorunludur" : ""}
                // InputProps={{
                //     readOnly: true,
                // }}
              />
            </Grid>
            {/* İLGİLİ KİŞİ READONLY */}
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/search-country-by-name"
                label="Ülke"
                getCRMData={getCRMData}
                selectedValue={
                  lead.CountryId
                    ? {
                        Id: lead.CountryId,
                        Name: lead.CountryName,
                        LogicalName: ""
                      }
                    : null
                }
                onValueChange={handleSelectFieldChange(
                  "CountryId",
                  "CountryName"
                )}
                required={true} // Alan zorunlu
                error={!!errors.CountryId} // Hata kontrolü
                helperText={errors.CountryId ? "Bu alan zorunludur" : ""} // Hata mesajı
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/search-city-by-name"
                label="İl"
                getCRMData={getCRMData}
                selectedValue={
                  lead.CityId
                    ? { Id: lead.CityId, Name: lead.CityName, LogicalName: "" }
                    : null
                }
                onValueChange={handleSelectFieldChange("CityId", "CityName")}
                required={true} // Alan zorunlu
                error={!!errors.CityId} // Hata kontrolü
                helperText={errors.CityId ? "Bu alan zorunludur" : ""} // Hata mesajı
              />
            </Grid>

            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/search-town-by-name"
                label="İlçe"
                getCRMData={getCRMData}
                selectedValue={
                  lead.TownId
                    ? { Id: lead.TownId, Name: lead.TownName, LogicalName: "" }
                    : null
                }
                onValueChange={handleSelectFieldChange("TownId", "TownName")}
                required={true} // Alan zorunlu
                error={!!errors.TownId} // Hata kontrolü
                helperText={errors.TownId ? "Bu alan zorunludur" : ""} // Hata mesajı
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/search-neighbourhood-by-name"
                label="Mahalle"
                getCRMData={getCRMData}
                selectedValue={
                  lead.NeighbourhoodId
                    ? {
                        Id: lead.NeighbourhoodId,
                        Name: lead.Neighbourhood,
                        LogicalName: ""
                      }
                    : null
                }
                onValueChange={handleSelectFieldChange(
                  "NeighbourhoodId",
                  "Neighbourhood"
                )}
                required={true} // Alan zorunlu
                error={!!errors.CityId} // Hata kontrolü
                helperText={errors.CityId ? "Bu alan zorunludur" : ""} // Hata mesajı
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Adres Satırı"
                fullWidth
                variant="outlined"
                id="Addressline1"
                name="Addressline1"
                value={lead.Addressline1}
                onChange={handleInputChange}
                required
                error={!!errors.CompanyName}
                helperText={errors.CompanyName ? "Bu alan zorunludur" : ""}
                // InputProps={{
                //     readOnly: true,
                // }}
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
                  <Step key={`step-${index}`} {...stepProps}>
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
                  {getStepContactContent(activeStep)}
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
                {activeStep === steps.length - 1 ? (
                  <form onSubmit={handleSubmit}>
                    <Button
                      variant="outlined"
                      type="submit"
                      sx={{
                        m: 1,
                        color: btnColor,
                        borderColor: btnColor,
                        "&:hover": {
                          borderColor:
                            selectedBrand === BrandOptions.Budget
                              ? BrandColors.BudgetDark
                              : BrandColors.AvisDark,
                          backgroundColor:
                            selectedBrand === BrandOptions.Budget
                              ? BrandColors.Budget
                              : BrandColors.AvisDark,
                          color: "#fff",
                          justifyContent: "flex-end"
                        }
                      }}
                    >
                      Kaydet
                    </Button>
                  </form>
                ) : (
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

export default LeadsCreate;
