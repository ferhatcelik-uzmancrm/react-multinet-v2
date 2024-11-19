import { ThemeProvider } from "@emotion/react";
import { KeyboardDoubleArrowLeftRounded, KeyboardDoubleArrowRightRounded } from "@mui/icons-material";
import { Box, Button, Container, createTheme, Grid, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { BrandColors, BrandOptions } from "../../enums/Enums";
import GenericAutocomplete from "../../helper/Lookup";
import { Phone } from "../../models/Phone";
import { LookupOptionType } from "../../models/Lookup";
import { getCRMData, sendRequest } from "../../requests/ApiCall";
import AlertComponent from "../../widgets/Alert";
import Spinner from "../../widgets/Spinner";

const PhonesCreate: React.FC = () => {
  const { selectedBrand } = useAppContext();
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
    From: { Id: "", Name: "" },
    To: { Id: "", Name: "" },
    RegardingObjectId: { Id: "", Name: "" },
    PhoneNumber: "",
    DirectionCode: false,
    ActivityTypeId: { Id: "", Name: "" },
    ActivityReasonId: { Id: "", Name: "" },
    ActivityStateId: { Id: "", Name: "" },
    AramaKod: "",
    Gakampnayaad: "",
    IsPlannedActivity: false,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPhone((prevPhone) => ({
      ...prevPhone,
      [name]: value,
    }));

    console.log("Error name: ", name)

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: false,
      }));
    }
  };
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

    const requiredFields = [
      'Subject',
      'From',
      'To'
    ];

    const newErrors: { [key: string]: boolean } = {};

    requiredFields.forEach((field) => {
      if (!phone[field as keyof typeof phone]) {
        newErrors[field] = true;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setAlertState({
        message: 'Lütfen tüm zorunlu alanları doldurun.',
        type: 'danger',
        position: 'bottom-right',
        showProgress: false,
        isOpen: true,
      });
      return;
    }

    console.log('Form submitted successfully', phone);


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
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <GenericAutocomplete
                apiEndpoint="api/search-partylist-by-name/phonecall/from"
                label="Arayan Kişi"
                getCRMData={getCRMData}
                selectedValue={phone.From ? { Id: phone.From.Id, Name: phone.From.Name } : null}
                onValueChange={handleSelectFieldChange2('From')}
                error={!!errors.From} // Hata kontrolü
                helperText={errors.From ? 'Bu alan zorunludur' : ''} // Hata mesajı
              />
              {/* <TextField
                label="Gönderen"
                fullWidth
                variant="outlined"
                name="From"
                value={phone.From ? phone.From.Name : ''}
                onChange={handleInputChange}
              /> */}
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <GenericAutocomplete
                apiEndpoint="api/search-partylist-by-name/phonecall/to"
                label="Arama Hedefi"
                getCRMData={getCRMData}
                selectedValue={phone.To ? { Id: phone.To.Id, Name: phone.To.Name } : null}
                onValueChange={handleSelectFieldChange2('To')}
                error={!!errors.To} // Hata kontrolü
                helperText={errors.From ? 'Bu alan zorunludur' : ''} // Hata mesajı
                isMulti={false}
              />
              {/* <TextField
                label="Alıcı"
                fullWidth
                variant="outlined"
                name="To"
                value={phone.To ? phone.To.Name : ''}
                onChange={handleInputChange}
              /> */}
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="İlgili Kişi"
                fullWidth
                variant="outlined"
                name="RegardingObjectId"
                value={phone.RegardingObjectId ? phone.RegardingObjectId.Name : ''}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Telefon Numarası"
                fullWidth
                variant="outlined"
                name="PhoneNumber"
                value={phone.PhoneNumber}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <GenericAutocomplete
                apiEndpoint="api/search-lookup-by-name/new_activitytype/new_name"
                label="Aktivite Türü"
                getCRMData={getCRMData}
                selectedValue={phone.ActivityTypeId ? { Id: phone.ActivityTypeId.Id, Name: phone.ActivityTypeId.Name } : null}
                onValueChange={handleSelectFieldChange2('ActivityTypeId')}
                error={!!errors.ActivityTypeId} // Hata kontrolü
                helperText={errors.ActivityTypeId ? 'Bu alan zorunludur' : ''} // Hata mesajı
              />
              {/* <TextField
                label="Etkinlik Türü"
                fullWidth
                variant="outlined"
                name="ActivityTypeId"
                value={phone.ActivityTypeId ? phone.ActivityTypeId.Name : ''}
                onChange={handleInputChange}
              /> */}
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <GenericAutocomplete
                apiEndpoint="api/search-lookup-by-name/new_activityreason/new_name"
                label="Aktivite Sebepleri"
                getCRMData={getCRMData}
                selectedValue={phone.ActivityReasonId ? { Id: phone.ActivityReasonId.Id, Name: phone.ActivityReasonId.Name } : null}
                onValueChange={handleSelectFieldChange2('ActivityReasonId')}
                error={!!errors.ActivityReasonId} // Hata kontrolü
                helperText={errors.ActivityReasonId ? 'Bu alan zorunludur' : ''} // Hata mesajı
              />
              {/* <TextField
                label="Etkinlik Nedeni"
                fullWidth
                variant="outlined"
                name="ActivityReasonId"
                value={phone.ActivityReasonId ? phone.ActivityReasonId.Name : ''}
                onChange={handleInputChange}
              /> */}
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Etkinlik Durumu"
                fullWidth
                variant="outlined"
                name="ActivityStateId"
                value={phone.ActivityStateId ? phone.ActivityStateId.Name : ''}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Planlı Etkinlik"
                fullWidth
                variant="outlined"
                name="IsPlannedActivity"
                value={phone.IsPlannedActivity ? phone.IsPlannedActivity : ''}
                onChange={handleInputChange}
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
                      Kaydet
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

export default PhonesCreate;
