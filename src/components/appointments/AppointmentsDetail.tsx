import { KeyboardDoubleArrowLeftRounded, KeyboardDoubleArrowRightRounded, PersonPinCircleTwoTone, PinDropTwoTone } from "@mui/icons-material";
import { Box, Button, Container, Grid, IconButton, InputAdornment, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { BrandColors, BrandOptions } from "../../enums/Enums";
import { Appointment } from "../../models/Appointment";
import { getCRMData, sendRequest } from "../../requests/ApiCall";
import AlertComponent from "../../widgets/Alert";
import Spinner from "../../widgets/Spinner";
import { GenericAutocomplete } from "../../helper/Lookup";
import { LookupOptionType } from "../../models/shared/Lookup";

const gridItemSize = {
  xs: 12,
  sm: 12,
  md: 6,
  lg: 6,
  xl: 6,
};

const steps = ['Form 1', 'Form 2', /*'Test'*/];

// const center = { lat: 0, lng: 0, };

type Location = {
  lat: number;
  lng: number;
}

const AppointmentsDetail: React.FC = () => {
  const { selectedBrand, currentDate, currentTime } = useAppContext();
  const { id } = useParams();
  const location = useLocation();
  const stateData = location.state?.data || [];
  const [errors, setErrors] = React.useState<{ [key: string]: boolean }>({});
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [loading, setLoading] = useState(Boolean);

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

  // const [currentLocation, setCurrentLocation] = useState(center);
  // var ownerName = sessionStorage.getItem("username");
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

  const [appointment, setAppointment] = useState<Appointment>({
    AppointmentId: "",
    Subject: "",
    ActivityTypeId: {
      Id: "",
      Name: "",
      LogicalName: ""
    },
    RegardingObjectId: {
      Id: "",
      Name: "",
      LogicalName: ""
    },
    ActivityReasonId: {
      Id: "",
      Name: "",
      LogicalName: ""
    },
    IsOnlineMeeting: false,
    ActivityStateId: {
      Id: "",
      Name: "",
      LogicalName: ""
    },
    IsPlannedActivity: {
      Value: 0,
      Label: ""
    },
    ScheduledStart: new Date(),
    ScheduledEnd: new Date(),
    CheckIn: "",
    CheckOut: "",
    IsAllDayEvent: false,
    ScheduledDurationMinutes: {
      Value: 0,
      Label: ""
    },
    IsCarRent: false,
    IsIntegration: false,
    IsGift: false,
    IsMultiAdvantage: false,
    IsOtelnet: false,
    IsOtomisyon: false,
    IsOKC: false,
    IsPassnet: false,
    IsPetronet: false,
    IsRestonet: false,
    IsMultiTravelPlane: false,
    IsMultiTravelAccommodation: false,
    OwnerId: {
      Id: "",
      Name: "",
      LogicalName: ""
    },
    CreatedOn: new Date(),
    ModifiedOn: new Date()
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const response = await getCRMData('api/get-appointment-by-id', id);
          setAppointment(response.data);
        }
      } catch (error) {
        alert(error)
      }
    };
    fetchData();
  }, [id]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAppointment((prevAppointment) => ({
      ...prevAppointment,
      [name]: value,
    }));
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true)

    try {
      await sendRequest("api/upsert-appointment", appointment)
        .then(response => {
          console.log("Appointment updated:", response.data)
          setAlertState({
            message: "Appointment updated successfully!",
            type: 'success',
            position: 'bottom-right',
            showProgress: true,
            isOpen: true,
          });
        })
        .catch(error => {
          console.error("Error updating appointment:", error)
          setAlertState({
            message: "Error updating appointment. Please try again.",
            type: 'danger',
            position: 'bottom-right',
            showProgress: true,
            isOpen: true,
          });
        });
    } catch (error) {
      console.error("Error:", error);
      setAlertState({
        message: "Error updating appointment. Please try again.",
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

  const handleCurrentLocation = (callback: (location: Location) => void) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = { lat: latitude, lng: longitude };
        console.log(location);
        callback(location);
      },
      (error) => {
        console.error("Error getting current location:", error);
      }
    );
  };

  const handleCheckIn = () => {
    handleCurrentLocation((location) => {
      setAppointment({
        ...appointment,
        CheckIn: location.lat + ", " + location.lng,
        ScheduledStart: new Date(),
        // ScheduledStart: new Date().toISOString().slice(0, 16),
      });
    });
  }
  const handleCheckOut = () => {
    handleCurrentLocation((location) => {
      setAppointment({
        ...appointment,
        CheckOut: location.lat + ", " + location.lng,
        ScheduledEnd: new Date(),
        // ScheduledEnd: new Date().toISOString().slice(0, 16),
      });
    });
  }

  const handleSelectFieldChange = (idField: string, nameField: string) =>
    (value: LookupOptionType | LookupOptionType[] | null) => {
      if (Array.isArray(value)) {
        // Çoklu seçim modunda birden fazla seçili öğe varsa
        const selectedIds = value.map(option => option.Id).join(', ');
        const selectedNames = value.map(option => option.Name).join(', ');
        setAppointment((prev) => ({ ...prev, [idField]: selectedIds, [nameField]: selectedNames }));
      } else {
        // Tekli seçim modunda
        setAppointment((prev) => ({
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
        setAppointment(prev => ({
          ...prev,
          [fieldName]: { Id: selectedIds, Name: selectedNames }
        }));
      } else {
        // Tekli seçim modunda
        setAppointment(prev => ({
          ...prev,
          [fieldName]: { Id: value ? value.Id : "", Name: value ? value.Name : "" }
        }));
      }
    };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item {...gridItemSize}>
              <TextField
                label="Check In"
                fullWidth
                variant="outlined"
                id="checkin"
                name="checkin"
                value={appointment.CheckIn}
                InputProps={{
                  readOnly: true, // Setting the field as read-only
                  endAdornment: (
                    <InputAdornment position="end">
                      {/* <IconButton aria-label="Check In" onClick={handleCheckIn} disabled={isCheckInDisabled}> */}
                      {/* <CheckCircle color={isCheckInDisabled ? 'disabled' : 'primary'} /> */}
                      <IconButton aria-label="Check In"
                        sx={{
                          transition: 'color 0.3s',
                          animation: 'flashing 1.5s ease-in-out 5',
                          color: "#1b5e20",
                          '&:hover': {
                            color: selectedBrand === BrandOptions.Budget ? BrandColors.Budget : BrandColors.Avis,
                            animation: 'flashing 1s ease-in-out',
                          },
                          '@keyframes flashing': {
                            '0%, 100%': {
                              opacity: 0,
                            },
                            '50%': {
                              color: selectedBrand === BrandOptions.Budget ? BrandColors.BudgetDark : BrandColors.AvisDark,
                              opacity: 1,
                            },
                          },
                        }}
                        onClick={handleCheckIn}
                      // disabled={isCheckInDisabled}
                      >
                        <PersonPinCircleTwoTone />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true, // Bu satır, label'ın tarih picker'ın üstünde kalmasını sağlar.
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Check Out"
                fullWidth
                variant="outlined"
                id="checkout"
                name="checkout"
                value={appointment.CheckOut}
                InputProps={{
                  readOnly: true, // Setting the field as read-only
                  endAdornment: (
                    <InputAdornment position="end">
                      {/* <IconButton aria-label="Check In" onClick={handleCheckIn} disabled={isCheckInDisabled}> */}
                      {/* <CheckCircle color={isCheckInDisabled ? 'disabled' : 'primary'} /> */}
                      <IconButton aria-label="Check In"
                        sx={{
                          transition: 'color 0.3s',
                          color: BrandColors.Avis,
                          animation: 'flashing 1.5s ease-in-out 5',
                          '&:hover': {
                            color: selectedBrand === BrandOptions.Budget ? BrandColors.Budget : BrandColors.Avis,
                            animation: 'flashing 1s ease-in-out',
                          },
                          '@keyframes flashing': {
                            '0%, 100%': {
                              opacity: 0,
                            },
                            '50%': {
                              color: selectedBrand === BrandOptions.Budget ? BrandColors.BudgetDark : BrandColors.AvisDark,
                              opacity: 1,
                            },
                          },
                        }}
                        onClick={handleCheckOut}
                      >
                        <PinDropTwoTone />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true, // Bu satır, label'ın tarih picker'ın üstünde kalmasını sağlar.
                }}
              />
            </Grid>
            <Grid item {...gridItemSize} sx={{ display: "none" }}>
              <TextField
                label="Ziyaret Id"
                fullWidth
                variant="outlined"
                name="appoId"
                value={appointment.AppointmentId}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Konu"
                fullWidth
                variant="outlined"
                id="Subject"
                name="Subject"
                value={appointment.Subject}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/search-lookup-by-name/contact/fullname"
                label="İlgili"
                getCRMData={getCRMData}
                selectedValue={appointment.RegardingObjectId ? { Id: appointment.RegardingObjectId.Id, Name: appointment.RegardingObjectId.Name, LogicalName: appointment.RegardingObjectId.LogicalName } : null}
                onValueChange={handleSelectFieldChange2('RegardingObjectId')}
                error={!!errors.RegardingObjectId} // Hata kontrolü
                helperText={errors.RegardingObjectId ? 'Bu alan zorunludur' : ''} // Hata mesajı
                required={true}
              />
              {/* <TextField
                label="İlgi"
                fullWidth
                variant="outlined"
                id="RegardingObjectId"
                name="RegardingObjectId"
                value={appointment.RegardingObjectId?.Name}
                onChange={handleInputChange}
              /> */}
            </Grid>
            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/search-lookup-by-name/new_activitytype/new_name"
                label="Aktivite Türü"
                getCRMData={getCRMData}
                selectedValue={appointment.ActivityTypeId ? { Id: appointment.ActivityTypeId.Id, Name: appointment.ActivityTypeId.Name, LogicalName: "" } : null}
                onValueChange={handleSelectFieldChange2('ActivityTypeId')}
                error={!!errors.ActivityTypeId} // Hata kontrolü
                helperText={errors.ActivityTypeId ? 'Bu alan zorunludur' : ''} // Hata mesajı
                required={true}
              />
              {/* <TextField
                label="Aktivite Türü"
                fullWidth
                variant="outlined"
                id="ActivityTypeId"
                name="ActivityTypeId"
                value={appointment.ActivityTypeId?.Name}
                onChange={handleInputChange}
              /> */}
            </Grid>
            <Grid item {...gridItemSize}>
            <GenericAutocomplete
                apiEndpoint="api/search-lookup-by-name/new_activityreason/new_name"
                label="Ziyaret Sebepleri"
                getCRMData={getCRMData}
                selectedValue={appointment.ActivityReasonId ? { Id: appointment.ActivityReasonId.Id, Name: appointment.ActivityReasonId.Name, LogicalName: "" } : null}
                onValueChange={handleSelectFieldChange2('ActivityReasonId')}
                error={!!errors.ActivityReasonId} // Hata kontrolü
                helperText={errors.ActivityReasonId ? 'Bu alan zorunludur' : ''} // Hata mesajı
                required={true}
              />
              {/* <TextField
                label="Ziyaret Sebepleri"
                fullWidth
                variant="outlined"
                id="ActivityReasonId"
                name="ActivityReasonId"
                value={appointment.ActivityReasonId?.Name}
                onChange={handleInputChange}
              /> */}
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Teams Toplantısı"
                fullWidth
                variant="outlined"
                id="IsOnlineMeeting"
                name="IsOnlineMeeting"
                value={appointment.IsOnlineMeeting}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid >
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item {...gridItemSize}>
              <TextField
                label="Tarih"
                type="date"
                fullWidth
                variant="outlined"
                name="date"
                value={currentDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Saat"
                type="time"
                fullWidth
                variant="outlined"
                name="time"
                value={currentTime}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 minutes step
                }}
                disabled
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Check-In Tarihi"
                type="datetime-local"
                fullWidth
                variant="outlined"
                name="ScheduledStart"
                value={appointment.ScheduledStart}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Check-Out Tarihi"
                type="datetime-local"
                fullWidth
                variant="outlined"
                name="ScheduledEnd"
                value={appointment.ScheduledEnd}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Tüm Günlük Etkinlik"
                fullWidth
                variant="outlined"
                id="IsAllDayEvent"
                name="IsAllDayEvent"
                value={appointment.IsAllDayEvent}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Süre"
                fullWidth
                variant="outlined"
                id="ScheduledDurationMinutes"
                name="ScheduledDurationMinutes"
                value={appointment.ScheduledDurationMinutes?.Value}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Aktivite Durumu"
                fullWidth
                variant="outlined"
                id="ActivityStateId"
                name="ActivityStateId"
                value={appointment.ActivityStateId?.Name}
                onChange={handleInputChange}
              />
            </Grid>

            {/* <Grid item xs={12}>
              <TextField
                label="Açıklama"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                name="description"
                value={appointment.description}
                onChange={handleInputChange}
              />
            </Grid> */}
          </Grid>
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
              // if (isStepOptional(index)) {
              //   labelProps.optional = (
              //     <Typography variant="caption">Optional</Typography>
              //   );
              // }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps} >
                  <StepLabel {...labelProps}>{/*{label}*/}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
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
                  {getStepContent(activeStep)}
                  {activeStep === steps.length - 1 ?
                    <Grid container sx={{ mt: 3 }}>
                      <Grid item xs={12} md={3}>
                        <Button sx={{
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
                      </Grid>
                      <Grid item xs={12} md={9}>
                        <Grid container justifyContent="flex-end">
                          <Grid item>
                            {/* <Button variant="outlined"
                            type="button"
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
                              },
                            }}
                          >
                            Fırsat Aç
                          </Button> */}
                          </Grid>
                          <Grid item>
                            <Button variant="outlined"
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
                                },
                              }}
                            >
                              Kaydet
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    : null
                  }
                </form>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                {activeStep === steps.length - 1 ? null :
                  <Button sx={{
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
                }
                <Box sx={{ flex: '1 1 auto' }} />
                {activeStep === steps.length - 1 ?
                  null
                  :
                  <Button variant="outlined" sx={{
                    m: 1, width: "25px",
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
                    onClick={handleNext}>
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
                  </Button>}
              </Box>
            </React.Fragment>
          )}
        </Box>
      )}

    </Container >
  );
};

export default AppointmentsDetail;
