import { ThemeProvider } from "@emotion/react";
import { KeyboardDoubleArrowLeftRounded, KeyboardDoubleArrowRightRounded } from "@mui/icons-material";
import { Box, Button, Container, createTheme, Grid, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { BrandColors, BrandOptions } from "../../enums/Enums";
import { Phone } from "../../models/Phone";
import { getCRMData, sendRequest } from "../../requests/ApiCall";
import AlertComponent from "../../widgets/Alert";
import Spinner from "../../widgets/Spinner";
import { LookupOptionType } from "../../models/shared/Lookup";
import { GenericAutocomplete } from "../../helper/Lookup";

// const gridItemSize = {
//   xs: 12,
//   sm: 12,
//   md: 6,
//   lg: 6,
//   xl: 6,
// };

const PhonesDetail: React.FC = () => {
  const { selectedBrand } = useAppContext();
  const { id } = useParams();
  const location = useLocation();
  const stateData = location.state?.data || [];
  console.log(stateData);
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
  const [errors, setErrors] = React.useState<{ [key: string]: boolean }>({});
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

  const [phone, setPhone] = useState<Phone>({
    PhoneId: "",
    Subject: "",
    From: { Id: "", Name: "", LogicalName: "" },
    To: { Id: "", Name: "", LogicalName: "" },
    RegardingObjectId: { Id: "", Name: "", LogicalName: "" },
    PhoneNumber: "",
    DirectionCode: false,
    ActivityTypeId: { Id: "", Name: "", LogicalName: "" },
    ActivityReasonId: { Id: "", Name: "", LogicalName: "" },
    ActivityStateId: { Id: "", Name: "", LogicalName: "" },
    AramaKod: "",
    Gakampnayaad: "",
    IsPlannedActivity: false,
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const response = await getCRMData('api/get-phone-by-id', id);
          console.log("PHONE RESPONSE: ", response.data)
          setPhone(response.data);
          console.log(response.data)
        }
      } catch (error) {
        alert(error)
      }
    };
    fetchData();
  }, [id]);

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = event.target;
  //   setPhone((prevAccount) => ({
  //     ...prevAccount,
  //     [name]: value,
  //   }));
  // };
  const handleSelectFieldChange = (idField: string, nameField: string) =>
    (value: LookupOptionType | LookupOptionType[] | null) => {
      if (Array.isArray(value)) {
        // Çoklu seçim modunda birden fazla seçili öğe varsa
        const selectedIds = value.map(option => option.Id).join(', ');
        const selectedNames = value.map(option => option.Name).join(', ');
        setPhone((prev) => ({ ...prev, [idField]: selectedIds, [nameField]: selectedNames }));
      } else {
        // Tekli seçim modunda
        setPhone((prev) => ({
          ...prev,
          [idField]: value ? value.Id : null,
          [nameField]: value ? value.Name : '',
        }));
      }
    };
  const handleSelectFieldChange2 = (fieldName: string) =>
    (value: LookupOptionType | LookupOptionType[] | null) => {
      if (Array.isArray(value)) {
        // Çoklu seçim modunda
        const selectedIds = value.map(option => option.Id).join(', ');
        const selectedNames = value.map(option => option.Name).join(', ');
        setPhone(prev => ({
          ...prev,
          [fieldName]: { Id: selectedIds, Name: selectedNames }
        }));
      } else {
        // Tekli seçim modunda
        setPhone(prev => ({
          ...prev,
          [fieldName]: { Id: value ? value.Id : "", Name: value ? value.Name : "" }
        }));
      }
    };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // alert(JSON.stringify(lead))
    setLoading(true)

    try {
      await sendRequest("api/upsert-phone", phone)
        .then(response => {
          console.log("Phone created:", response.data)
          setAlertState({
            message: "Phone created successfully!",
            type: 'success',
            position: 'bottom-right',
            showProgress: true,
            isOpen: true,
          });
        })
        .catch(error => {
          console.error("Error creating phone:", error)
          setAlertState({
            message: "Error creating phone. Please try again.",
            type: 'danger',
            position: 'bottom-right',
            showProgress: true,
            isOpen: true,
          });
        });
    } catch (error) {
      console.error("Error:", error);
      setAlertState({
        message: "Error creating phone. Please try again.",
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
            <Grid item xs={12} sm={6} md={4} sx={{ display: "none" }}>
              <TextField
                label="Telefon ID"
                fullWidth
                variant="outlined"
                name="PhoneId"
                value={phone.PhoneId}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Konu"
                fullWidth
                variant="outlined"
                name="Subject"
                value={phone.Subject}
              // onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <GenericAutocomplete
                apiEndpoint="api/search-partylist-by-activities"
                label="Gönderen"
                getCRMData={getCRMData}
                selectedValue={phone.From ? phone.From : null}
                onValueChange={handleSelectFieldChange2('From')}
                error={!!errors.From} // Hata kontrolü
                helperText={errors.From ? 'Bu alan zorunludur' : ''} // Hata mesajı
                isMulti={true}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <GenericAutocomplete
                apiEndpoint="api/search-partylist-by-activities"
                label="Alıcı"
                getCRMData={getCRMData}
                selectedValue={phone.To ? phone.To : null}
                onValueChange={handleSelectFieldChange2('To')}
                error={!!errors.To} // Hata kontrolü
                helperText={errors.To ? 'Bu alan zorunludur' : ''} // Hata mesajı
                isMulti={true}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="İlgili Kişi"
                fullWidth
                variant="outlined"
                name="RegardingObjectId"
                value={phone.RegardingObjectId ? phone.RegardingObjectId.Name : ''}
              // onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Telefon Numarası"
                fullWidth
                variant="outlined"
                name="PhoneNumber"
                value={phone.PhoneNumber}
              // onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Yönlendirme Kodu"
                fullWidth
                variant="outlined"
                name="DirectionCode"
                value={phone.DirectionCode ? phone.DirectionCode : ''}
              // onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Etkinlik Türü"
                fullWidth
                variant="outlined"
                name="ActivityTypeId"
                value={phone.ActivityTypeId ? phone.ActivityTypeId.Name : ''}
              // onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Etkinlik Nedeni"
                fullWidth
                variant="outlined"
                name="ActivityReasonId"
                value={phone.ActivityReasonId ? phone.ActivityReasonId.Name : ''}
              // onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Etkinlik Durumu"
                fullWidth
                variant="outlined"
                name="ActivityStateId"
                value={phone.ActivityStateId ? phone.ActivityStateId.Name : ''}
              // onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Planlı Etkinlik"
                fullWidth
                variant="outlined"
                name="IsPlannedActivity"
                value={phone.IsPlannedActivity ? phone.IsPlannedActivity : ''}
              // onChange={handleInputChange}
              />
            </Grid>

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
                  // <form onSubmit={handleSubmit}>
                  //   <Button
                  //     variant="outlined"
                  //     type="submit"
                  //     sx={{
                  //       m: 1,
                  //       color: btnColor,
                  //       borderColor: btnColor,
                  //       '&:hover': {
                  //         borderColor:
                  //           selectedBrand === BrandOptions.Budget
                  //             ? BrandColors.BudgetDark
                  //             : BrandColors.AvisDark,
                  //         backgroundColor:
                  //           selectedBrand === BrandOptions.Budget
                  //             ? BrandColors.Budget
                  //             : BrandColors.AvisDark,
                  //         color: '#fff',
                  //         justifyContent: 'flex-end',
                  //       },
                  //     }}
                  //   >
                  //     Güncelle
                  //   </Button>
                  // </form>
                  null
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

export default PhonesDetail;
