import { ThemeProvider } from "@emotion/react";
import { KeyboardDoubleArrowLeftRounded, KeyboardDoubleArrowRightRounded } from "@mui/icons-material";
import { Box, Button, Container, createTheme, Grid, MenuItem, Step, StepLabel, Stepper, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { BrandColors, BrandOptions } from "../../enums/Enums";
import { Contact } from "../../models/Contact";
import { getCRMData } from "../../requests/ApiCall";

const gridItemSize = {
  xs: 12,
  sm: 12,
  md: 6,
  lg: 6,
  xl: 6,
};

const ContactsDetail: React.FC = () => {
  const { selectedBrand } = useAppContext();
  const { id } = useParams();
  const location = useLocation();
  const stateData = location.state?.data || [];
  console.log(stateData);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const step = ['Genel', 'İletişim', 'Adres'];
  const mobileStep = ['', '', ''];

  let steps = isMobile ? mobileStep : step

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
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

  const [contact, setContact] = useState<Contact>({
    ContactId: id || "",
    FirstName: "",
    LastName: "",
    ContactTitleId: "",
    ContactTitleName: "",
    ParentCustomerId: "",
    ParentCustomerName: "",
    TcNo: "",
    GenderCode: 0,
    BirthDate: new Date(),
    MobilePhone: "",
    Telephone: "",
    EmailAddress: "",
    CountryId: "",
    Country: "",
    City: "",
    CityId: "",
    CityName: "",
    Neighbourhood: "",
    NeighbourhoodId: "",
    Town: "",
    TownId: "",
    TownName: "",
    PostalCode: "",
    AddressLine: "",
    CreatedBy: "",
    OwnerId: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          console.log("ContactId: ", id)
          const response = await getCRMData('api/get-contact-by-id', id);
          setContact(response.data);
        }
      } catch (error) {
        alert(error)
      }
    };
    fetchData();
  }, [id]);


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setContact((prevAccount) => ({
      ...prevAccount,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert(JSON.stringify(contact))
    window.location.reload();
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

  // const switchStyles = {
  //   '& .MuiSwitch-switchBase.Mui-checked': {
  //     color: selectedBrand === BrandOptions.Budget ? BrandColors.BudgetDark : BrandColors.Avis,
  //   },
  //   '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
  //     backgroundColor: selectedBrand === BrandOptions.Budget ? BrandColors.BudgetDark : BrandColors.Avis,
  //   },
  // };

  //If companyType is contact
  const getStepContactContent = (step: number) => {
    switch (step) {
      // GENEL BİLGİLER
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item {...gridItemSize} sx={{ display: "none" }}>
              <TextField
                label="Contact Id"
                fullWidth
                variant="outlined"
                name="ContactId"
                value={contact.ContactId}
                onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Adı"
                fullWidth
                variant="outlined"
                id="FirstName"
                name="FirstName"
                value={contact.FirstName}
                onChange={handleInputChange}
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
                id="LastName"
                name="LastName"
                value={contact.LastName}
                onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Yetkili Unvanı"
                fullWidth
                variant="outlined"
                id="ContactTitleName"
                name="ContactTitleName"
                value={contact.ContactTitleName}
                onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Firması"
                fullWidth
                variant="outlined"
                id="ParentCustomerName"
                name="ParentCustomerName"
                value={contact.ParentCustomerName}
                onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="TC Kimlik No"
                fullWidth
                variant="outlined"
                id="TcNo"
                name="TcNo"
                value={contact.TcNo}
                onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                select
                label="Cinsiyet"
                fullWidth
                variant="outlined"
                id="GenderCode"
                name="GenderCode"
                value={contact.GenderCode}
                onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              >
                <MenuItem value="">---</MenuItem>
                <MenuItem value={2}>Kadın</MenuItem>
                <MenuItem value={1}>Erkek</MenuItem>

              </TextField>
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Doğum Tarihi"
                fullWidth
                variant="outlined"
                id="BirthDate"
                name="BirthDate"
                value={contact.BirthDate?contact.BirthDate.toLocaleDateString():""}
                onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
        );

      // İLETİŞİM BİLGİLERİ
      case 1:
        return (
          <Grid container spacing={2}>
            {/* <Grid item {...gridItemSize}>
                            <Autocomplete
                                multiple
                                id="company"
                                className="company"
                                fullWidth
                                options={account.Name}
                                getOptionLabel={(option) => option.name}
                                value={account.Name}
                                onChange={handleCompanyChange}
                                // renderOption={(props, option, { selected }) => (
                                //   <li {...props} style={{ fontWeight: selected ? 'bold' : 'normal' }}>
                                //     {option.name}
                                //   </li>
                                // )}
                                renderInput={(params) => (
                                    <TextField {...params} label="Firma" />
                                )}
                                limitTags={1}
                                readOnly
                                sx={{
                                    '& .MuiAutocomplete-tag': {
                                        fontWeight: 'bold',
                                        color: 'GrayText'
                                    },
                                }}
                            />
                        </Grid> */}
            <Grid item {...gridItemSize}>
              <TextField
                label="Cep Telefonu"
                fullWidth
                variant="outlined"
                id="MobilePhone"
                name="MobilePhone"
                value={contact.MobilePhone}
                onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="İş Telefonu"
                fullWidth
                variant="outlined"
                id="Telephone"
                name="Telephone"
                value={contact.Telephone}
                onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Email Adresi"
                fullWidth
                variant="outlined"
                id="EmailAddress"
                name="EmailAddress"
                value={contact.EmailAddress}
                onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid >
        );

      //ADRES BİLGİLERİ
      case 2:
        return (
          <Grid container spacing={2}>

            {/* ADRES READONLY */}
            <Grid item {...gridItemSize}>
              <TextField
                label="Ülke"
                fullWidth
                variant="outlined"
                id="Country"
                name="Country"
                value={contact.Country}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="İl"
                fullWidth
                variant="outlined"
                id="City"
                name="City"
                value={contact.City}
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
                id="Town"
                name="Town"
                value={contact.Town}
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
                id="Neighbourhood"
                name="Neighbourhood"
                value={contact.Neighbourhood}
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
                id="PostalCode"
                name="PostalCode"
                value={contact.PostalCode}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Adres Satırı"
                fullWidth
                variant="outlined"
                id="AddressLine"
                name="AddressLine"
                value={contact.AddressLine}
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
      <Box sx={{ width: '100%' }}>
        <ThemeProvider theme={defaultTheme}>
          <Stepper activeStep={activeStep} sx={{
            '& .MuiSvgIcon-root': {
              color: selectedBrand === BrandOptions.Budget ? BrandColors.Budget : BrandColors.AvisDark,
            }
          }}>
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps} >
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
              <Button onClick={handleReset}>Sıfırla</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Box sx={{ mt: 3 }}>
              <form onSubmit={handleSubmit}>
                {/* Fill stepper content here.  */}
                {getStepContactContent(activeStep)}
              </form>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
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
                    cursor: "pointer",
                  },
                  "&:active": {
                    color: "dark",
                  },
                }}
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0}>
                <KeyboardDoubleArrowLeftRounded
                  sx={{
                    color: btnColor,
                    "&:hover": {
                      color:
                        selectedBrand === BrandOptions.Budget
                          ? BrandColors.Budget
                          : BrandColors.AvisDark,
                      cursor: "pointer",
                    },
                    "&:active": {
                      color: "dark",
                    },
                  }}
                />
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              {(activeStep !== steps.length - 1) &&
                (
                  <>
                    <Button variant="outlined"
                      sx={{
                        m: 1,
                        width: "25px",
                        borderColor: selectedBrand === BrandOptions.Budget
                          ? BrandColors.Budget
                          : BrandColors.AvisDark,
                        "&:hover": {
                          borderColor:
                            selectedBrand === BrandOptions.Budget
                              ? BrandColors.Budget
                              : BrandColors.AvisDark,
                          cursor: "pointer",
                        },
                        "&:active": {
                          color: "red",
                        },
                      }}
                      onClick={handleNext}>
                      {(activeStep !== steps.length - 2) &&
                        <KeyboardDoubleArrowRightRounded
                          sx={{
                            color: btnColor,
                            "&:hover": {
                              color:
                                selectedBrand === BrandOptions.Budget
                                  ? BrandColors.Budget
                                  : BrandColors.AvisDark,
                              cursor: "pointer",
                            },
                            "&:active": {
                              color: "primary.dark",
                            },
                          }}
                        />
                      }
                      {(activeStep === steps.length - 2) &&
                        <KeyboardDoubleArrowRightRounded
                          sx={{
                            color: btnColor,
                            "&:hover": {
                              color:
                                selectedBrand === BrandOptions.Budget
                                  ? BrandColors.Budget
                                  : BrandColors.AvisDark,
                              cursor: "pointer",
                            },
                            "&:active": {
                              color: "primary.dark",
                            },
                          }}
                        />
                      }
                    </Button>
                  </>
                )
              }
            </Box>
          </React.Fragment>
        )}
      </Box>
    </Container >
  );
};

export default ContactsDetail;
