import { ThemeProvider } from "@emotion/react";
import {
  KeyboardDoubleArrowLeftRounded,
  KeyboardDoubleArrowRightRounded,
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
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { BrandColors, BrandOptions } from "../../enums/Enums";
import { Email } from "../../models/Email";
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

const EmailsCreate: React.FC = () => {
  const { selectedBrand } = useAppContext();
  const location = useLocation();
  const stateData = location.state?.data || [];
  const user = {
    Id: sessionStorage.getItem("crmuserid"),
    Name: sessionStorage.getItem("crmusername"),
  };
  console.log(stateData);
  const steps = [""];
  const [alertState, setAlertState] = useState({
    message: "",
    type: "success" as "success" | "danger",
    position: "bottom-right" as "bottom-right" | "center",
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
      },
    },
  });

  const [email, setEmail] = useState<Email>({
    EmailId: "",
    Subject: "",
    Message: "",
    From: {
      Id: user.Id || "",
      Name: user.Name || "",
      LogicalName: "systemuser",
    },
    To: [], // Initialize as an empty array for multiple recipients
    Cc: [], // Initialize as an empty array for CC recipients
    Bcc: [], // Initialize as an empty array for BCC recipients
    IsMultiNetActivity: false,
    RegardingObjectId: { Id: "", Name: "", LogicalName: "" },
    ActualDurationMinutes: null, // Initialize as null
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // const jsonString = JSON.stringify(value);
    // console.log(value);
    // console.log(jsonString);
    setEmail((prevEmail) => ({
      ...prevEmail,
      [name]: value,
    }));

    console.log("Error name: ", name);

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: false,
      }));
    }
  };

  const handleSelectFieldChange2 =
    (fieldName: string) =>
    (value: LookupOptionType | LookupOptionType[] | null) => {
      if (Array.isArray(value)) {
        // Çoklu seçim modunda
        const selectedIds = value.map((option) => option.Id).join(", ");
        const selectedNames = value.map((option) => option.Name).join(", ");
        setEmail((prev) => ({
          ...prev,
          [fieldName]: { Id: selectedIds, Name: selectedNames },
        }));
      } else {
        // Tekli seçim modunda
        setEmail((prev) => ({
          ...prev,
          [fieldName]: {
            Id: value ? value.Id : "",
            Name: value ? value.Name : "",
          },
        }));
      }
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requiredFields = ["Subject"];

    const newErrors: { [key: string]: boolean } = {};

    requiredFields.forEach((field) => {
      if (!email[field as keyof typeof email]) {
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
        isOpen: true,
      });
      return;
    }

    console.log("Form submitted successfully", email);

    setLoading(true);

    try {
      await sendRequest("api/upsert-email", email)
        .then((response) => {
          console.log("Email created:", response.data);
          setAlertState({
            message: "Email created successfully!",
            type: "success",
            position: "bottom-right",
            showProgress: true,
            isOpen: true,
          });
        })
        .catch((error) => {
          console.error("Error creating email:", error);
          setAlertState({
            message: "Error creating email. Please try again.",
            type: "danger",
            position: "bottom-right",
            showProgress: true,
            isOpen: true,
          });
        });
    } catch (error) {
      console.error("Error:", error);
      setAlertState({
        message: "Error creating email. Please try again.",
        type: "danger",
        position: "bottom-right",
        showProgress: true,
        isOpen: true,
      });
    } finally {
      setLoading(false);
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
            <Grid item {...gridItemSize}>
              <TextField
                label="Konu"
                fullWidth
                variant="outlined"
                id="Subject"
                name="Subject"
                value={email.Subject}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/get-all-customers"
                label="Kimden"
                getCRMData={getCRMData}
                selectedValue={
                  email.From
                    ? {
                        Id: email.From.Id,
                        Name: email.From.Name,
                        LogicalName: "",
                      }
                    : null
                }
                onValueChange={handleSelectFieldChange2("From")}
                error={!!errors.From} // Hata kontrolü
                helperText={errors.From ? "Bu alan zorunludur" : ""} // Hata mesajı
                disabled={true}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/search-partylist-by-activities"
                label="Kime"
                getCRMData={getCRMData}
                selectedValue={email.To ? email.To : null}
                onValueChange={handleSelectFieldChange2("To")}
                error={!!errors.To} // Hata kontrolü
                helperText={errors.To ? "Bu alan zorunludur" : ""} // Hata mesajı
                isMulti={true}
                required={true}
              />
              {/* <TextField
                label="Kime"
                fullWidth
                variant="outlined"
                id="To"
                name="To"
                value={email.To}
                onChange={handleInputChange}
              /> */}
            </Grid>
            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/search-partylist-by-activities"
                label="Bilgi"
                getCRMData={getCRMData}
                selectedValue={email.Cc ? email.Cc : null}
                onValueChange={handleSelectFieldChange2("Cc")}
                error={!!errors.Cc} // Hata kontrolü
                helperText={errors.Cc ? "Bu alan zorunludur" : ""} // Hata mesajı
                isMulti={true}
                required={false}
              />
              {/* <TextField
                label="Bilgi"
                fullWidth
                variant="outlined"
                id="Cc"
                name="Cc"
                value={email.Cc}
                onChange={handleInputChange}
              /> */}
            </Grid>
            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/search-partylist-by-activities"
                label="Gizli"
                getCRMData={getCRMData}
                selectedValue={email.Bcc ? email.Bcc : null}
                onValueChange={handleSelectFieldChange2("Bcc")}
                error={!!errors.Bcc} // Hata kontrolü
                helperText={errors.Bcc ? "Bu alan zorunludur" : ""} // Hata mesajı
                isMulti={true}
                required={false}
              />
              {/* <TextField
                label="Gizli"
                fullWidth
                variant="outlined"
                id="Bcc"
                name="Bcc"
                value={email.Bcc}
                onChange={handleInputChange}
              /> */}
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Mesaj"
                fullWidth
                variant="outlined"
                id="Message"
                name="Message"
                value={email.Message}
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
          xl: "1920px",
        },
        display: "block",
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
                      cursor: "pointer",
                    },
                    "&:active": {
                      color: "dark",
                    },
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
                        cursor: "pointer",
                      },
                      "&:active": {
                        color: "dark",
                      },
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
                          justifyContent: "flex-end",
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
                  >
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
                          color: "dark",
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

export default EmailsCreate;
