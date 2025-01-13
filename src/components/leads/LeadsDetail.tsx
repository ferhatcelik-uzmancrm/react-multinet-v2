import { ThemeProvider } from "@emotion/react";
import { KeyboardDoubleArrowLeftRounded, KeyboardDoubleArrowRightRounded } from "@mui/icons-material";
import { Box, Button, Container, createTheme, Grid, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { BrandColors, BrandOptions } from "../../enums/Enums";
import { Lead } from "../../models/Lead";
import {GenericAutocomplete} from "../../helper/Lookup";
import { LookupOptionType } from "../../models/shared/Lookup";
import { getCRMData, sendRequest } from "../../requests/ApiCall";
import AlertComponent from "../../widgets/Alert";
import Spinner from "../../widgets/Spinner";
const gridItemSize = {
  xs: 12,
  sm: 12,
  md: 6,
  lg: 6,
  xl: 6,
};

const LeadsDetail: React.FC = () => {
  const { selectedBrand } = useAppContext();
  const { id } = useParams();
  // const location = useLocation();
  // const stateData = location.state?.data || [];
  const steps = ['', ''];
  const [alertState, setAlertState] = useState({
    message: '',
    type: 'success' as 'success' | 'danger',
    position: 'bottom-right' as 'bottom-right' | 'center',
    showProgress: false,
    isOpen: false,
  });

  const closeAlert = () => {
    setAlertState((prevState) => ({ ...prevState, isOpen: false }));
  };

  const [loading, setLoading] = useState(Boolean);

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  var crmOwner = localStorage.getItem("crmuserid");
  const getByBrand = () => {
    switch (selectedBrand) {
      case BrandOptions.Avis:
        return {
          btnColor: BrandColors.AvisDark,
        };
      case BrandOptions.Filo:
        return {
          btnColor: BrandColors.FiloDark,
        };
      case BrandOptions.Budget:
        return {
          btnColor: BrandColors.BudgetDark,
        };

      default:
        return {
          btnColor: "#333333",
        };
    }
  };

  const { btnColor } = getByBrand();

  const defaultTheme = createTheme({
    palette: {
      primary: {
        main: btnColor,
      }
    },
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
    CreatedBy: "",
    ModifiedBy: "",
    companyname: "",
    emailaddress3: "",
    id: "",
    telephone1: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const response = await getCRMData('api/get-lead-by-id', id);
          console.log("LEAD RESPONSE: ", response.data)
          setLead(response.data);
          console.log(response.data)
        }
      } catch (error) {
        alert(error)
      }
    };
    fetchData();
  }, [id]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLead((prevAccount) => ({
      ...prevAccount,
      [name]: value,
    }));
  };
  
  const handleSelectFieldChange = (idField: string, nameField: string) => 
    (value: LookupOptionType | LookupOptionType[] | null) => {
      if (Array.isArray(value)) {
        // Çoklu seçim modunda birden fazla seçili öğe varsa
        const selectedIds = value.map(option => option.Id).join(', ');
        const selectedNames = value.map(option => option.Name).join(', ');
        setLead((prev) => ({ ...prev, [idField]: selectedIds, [nameField]: selectedNames }));
      } else {
        // Tekli seçim modunda
        setLead((prev) => ({
          ...prev,
          [idField]: value ? value.Id : null,
          [nameField]: value ? value.Name : '',
        }));
      }
    };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // alert(JSON.stringify(lead))
    setLoading(true)

    try {
      await sendRequest("api/upsert-lead", lead)
        .then(response => {
          console.log("Lead updated:", response.data)
          setAlertState({
            message: "Lead updated successfully!",
            type: 'success',
            position: 'bottom-right',
            showProgress: true,
            isOpen: true,
          });
        })
        .catch(error => {
          console.error("Error updating lead:", error)
          setAlertState({
            message: "Error updating lead. Please try again.",
            type: 'danger',
            position: 'bottom-right',
            showProgress: true,
            isOpen: true,
          });
        });
    } catch (error) {
      console.error("Error:", error);
      setAlertState({
        message: "Error updating lead. Please try again.",
        type: 'danger',
        position: 'bottom-right',
        showProgress: true,
        isOpen: true,
      });
    }
    finally {
      setLoading(false)
    }

    // window.location.reload();
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
            <Grid item {...gridItemSize} sx={{ display: "none" }}>
              <TextField
                label="Lead Id"
                fullWidth
                variant="outlined"
                name="leadid"
                value={lead.LeadId}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Firma Adı"
                fullWidth
                variant="outlined"
                id="CompanyName"
                name="CompanyName"
                value={lead.CompanyName}
                onChange={handleInputChange}
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
              />
            </Grid>

            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/get-source"
                label="Müşteri Aday Kaynağı"
                getCRMData={getCRMData}
                selectedValue={lead.LeadSourceCode ? { Id: lead.LeadSourceCode, Name: lead.LeadSource, LogicalName:"" } : null}
                onValueChange={handleSelectFieldChange('LeadSourceCode', 'LeadSource')}
              />
            </Grid>

            {/* İLGİLİ KİŞİ READONLY */}
            <Grid item {...gridItemSize}>
              <TextField
                label="Adı"
                fullWidth
                variant="outlined"
                id="firstname"
                name="firstname"
                value={lead.FirstName}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item {...gridItemSize}>
              <TextField
                label="Soyadı"
                fullWidth
                variant="outlined"
                id="lastname"
                name="lastname"
                value={lead.LastName}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/search-contacttitle-by-name"
                label="Yetkili Unvanı"
                getCRMData={getCRMData}
                selectedValue={lead.JobTitleId ? { Id: lead.JobTitleId, Name: lead.JobTitleName , LogicalName:""} : null}
                onValueChange={handleSelectFieldChange('JobTitleId', 'JobTitleName')}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="E-posta Adresi"
                fullWidth
                variant="outlined"
                id="email"
                name="email"
                value={lead.EmailAddress}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item {...gridItemSize}>
              <TextField
                label="Cep Telefonu"
                fullWidth
                variant="outlined"
                id="phone"
                name="phone"
                value={lead.MobilePhone}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item {...gridItemSize}>
              <TextField
                label="Web Sitesi"
                fullWidth
                variant="outlined"
                id="website"
                name="website"
                value={lead.WebsiteUrl}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            {/* İLGİLİ KİŞİ READONLY */}

          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>

            {/* ADRES READONLY */}
            {/* <Grid item {...gridItemSize}>
              <TextField
                label="Ülke"
                fullWidth
                variant="outlined"
                id="country"
                name="country"
                value={lead.CountryName}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }} />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="İl"
                fullWidth
                variant="outlined"
                id="city"
                name="city"
                value={lead.CityName}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="İlçe"
                fullWidth
                variant="outlined"
                id="town"
                name="town"
                value={lead.TownName}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Mahalle"
                fullWidth
                variant="outlined"
                id="neighbourhood"
                name="neighbourhood"
                value={lead.Neighbourhood}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid> */}
            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/search-country-by-name"
                label="Ülke"
                getCRMData={getCRMData}
                selectedValue={lead.CountryId ? { Id: lead.CountryId, Name: lead.CountryName , LogicalName:""} : null}
                onValueChange={handleSelectFieldChange('CountryId', 'CountryName')}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/search-city-by-name"
                label="İl"
                getCRMData={getCRMData}
                selectedValue={lead.CityId ? { Id: lead.CityId, Name: lead.CityName, LogicalName:"" } : null}
                onValueChange={handleSelectFieldChange('CityId', 'CityName')}
              />
            </Grid>

            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/search-town-by-name"
                label="İlçe"
                getCRMData={getCRMData}
                selectedValue={lead.TownId ? { Id: lead.TownId, Name: lead.TownName, LogicalName:"" } : null}
                onValueChange={handleSelectFieldChange('TownId', 'TownName')}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/search-neighbourhood-by-name"
                label="Mahalle"
                getCRMData={getCRMData}
                selectedValue={lead.NeighbourhoodId ? { Id: lead.NeighbourhoodId, Name: lead.Neighbourhood, LogicalName:"" } : null}
                onValueChange={handleSelectFieldChange('NeighbourhoodId', 'Neighbourhood')}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Adres Satırı"
                fullWidth
                variant="outlined"
                id="addressline"
                name="addressline"
                value={lead.Addressline1}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            {/* ADRES READONLY */}

          </Grid >
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container
      sx={{
        maxWidth: {
          xs: '100%',
          sm: '600px',
          md: '960px',
          lg: '1280px',
          xl: '1920px',
        },
        display: 'block',
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

      {loading ? <Spinner type="hash" size={50} color="#d0052d" /> : (
        <Box sx={{ width: '100%' }}>
          <ThemeProvider theme={defaultTheme}>
            <Stepper
              activeStep={activeStep}
              sx={{
                '& .MuiSvgIcon-root': {
                  color:
                    selectedBrand === BrandOptions.Budget
                      ? BrandColors.Budget
                      : BrandColors.AvisDark,
                },
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
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
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
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                {/* Back Button */}
                <Button
                  sx={{
                    m: 1,
                    width: '25px',
                    borderColor: 'GrayText',
                    '&:hover': {
                      borderColor:
                        selectedBrand === BrandOptions.Budget
                          ? BrandColors.Budget
                          : BrandColors.AvisDark,
                      cursor: 'pointer',
                    },
                    '&:active': {
                      color: 'dark',
                    },
                  }}
                  variant="outlined"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  <KeyboardDoubleArrowLeftRounded
                    sx={{
                      color: btnColor,
                      '&:hover': {
                        color:
                          selectedBrand === BrandOptions.Budget
                            ? BrandColors.Budget
                            : BrandColors.AvisDark,
                        cursor: 'pointer',
                      },
                      '&:active': {
                        color: 'dark',
                      },
                    }}
                  />
                </Button>

                <Box sx={{ flex: '1 1 auto' }} />

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
                        '&:hover': {
                          borderColor:
                            selectedBrand === BrandOptions.Budget
                              ? BrandColors.BudgetDark
                              : BrandColors.AvisDark,
                          backgroundColor:
                            selectedBrand === BrandOptions.Budget
                              ? BrandColors.Budget
                              : BrandColors.AvisDark,
                          color: '#fff',
                          justifyContent: 'flex-end',
                        },
                      }}
                    >
                      Güncelle
                    </Button>
                  </form>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={handleNext}
                    sx={{
                      m: 1,
                      width: '25px',
                      borderColor: 'GrayText',
                      '&:hover': {
                        borderColor:
                          selectedBrand === BrandOptions.Budget
                            ? BrandColors.Budget
                            : BrandColors.AvisDark,
                        cursor: 'pointer',
                      },
                      '&:active': {
                        color: 'dark',
                      },
                    }}
                  >
                    <KeyboardDoubleArrowRightRounded
                      sx={{
                        color: btnColor,
                        '&:hover': {
                          color:
                            selectedBrand === BrandOptions.Budget
                              ? BrandColors.Budget
                              : BrandColors.AvisDark,
                          cursor: 'pointer',
                        },
                        '&:active': {
                          color: 'dark',
                        },
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

export default LeadsDetail;
