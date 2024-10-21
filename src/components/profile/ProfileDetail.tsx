import { ThemeProvider } from "@emotion/react";
import { KeyboardDoubleArrowLeftRounded, KeyboardDoubleArrowRightRounded } from "@mui/icons-material";
import { Box, Button, Container, createTheme, Grid, Step, StepLabel, Stepper, TextField, Typography, useMediaQuery, useTheme, InputAdornment, Badge } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { BrandColors, BrandOptions } from "../../enums/Enums";
import { Profile } from "../../models/Profile";
import { getCRMData, sendRequest } from "../../requests/ApiCall";
import GenericAutocomplete from "../../helper/Lookup";
import { LookupOptionType } from "../../models/Lookup";
import AlertComponent from "../../widgets/Alert";
import Spinner from "../../widgets/Spinner";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';


const gridItemSize = {
  xs: 12,
  sm: 12,
  md: 6,
  lg: 6,
  xl: 6,
};

const ProfileDetail: React.FC = () => {
  const { selectedBrand } = useAppContext();
  const location = useLocation();
  const stateData = location.state?.data || [];

  const steps = ['',];
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
  const currentUserId = localStorage.getItem("portaluserid");
  const getByBrand = () => {
    switch (selectedBrand) {
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

  const [profile, setProfile] = useState<Profile>({
    UserId: currentUserId || "",
    Email: "",
    UserName: "",
    Password: "",
    City: { Id: "", Name: "" }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCRMData('api/get-user-by-id', currentUserId);
        setProfile(response.data);
      } catch (error) {
        alert(error)
      }
    };
    fetchData();
  }, [currentUserId]);

  const handleCityChange = (selectedOption: LookupOptionType | null) => {
    if (selectedOption) {
      setProfile(prevLead => ({
        ...prevLead,
        City: { Id: selectedOption.Id, Name: selectedOption.Name },
      }));
    } else {
      setProfile(prevLead => ({
        ...prevLead,
        City: { Id: "", Name: "" },
      }));
    }
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setProfile((prevPhone) => ({
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requiredFields = [''];

    const newErrors: { [key: string]: boolean } = {};

    // requiredFields.forEach((field) => {
    //   if (!profile[field as keyof typeof profile]) {
    //     newErrors[field] = true;
    //   }
    // });

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

    console.log('Form submitted successfully', profile);


    setLoading(true)

    try {
      await sendRequest("api/update-user", profile)
        .then(response => {
          setAlertState({
            message: "Profile update successfully!",
            type: 'success',
            position: 'bottom-right',
            showProgress: true,
            isOpen: true,
          });
        })
        .catch(error => {
          setAlertState({
            message: "Error creating profile. Please try again.",
            type: 'danger',
            position: 'bottom-right',
            showProgress: true,
            isOpen: true,
          });
        });
    } catch (error) {
      console.error("Error:", error);
      setAlertState({
        message: "Error creating profile. Please try again.",
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
            </Stepper>
          </ThemeProvider>
          <React.Fragment>
            <Box sx={{ mt: 3, md: 12 }}>
              <form onSubmit={handleSubmit}>
                {/* Fill stepper content here. */}
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={12} sx={{ display: "none" }}>
                    <TextField
                      label=""
                      fullWidth
                      variant="outlined"
                      name="UserId"
                      value={profile.UserId}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item {...gridItemSize}>
                    <TextField
                      label="Email"
                      fullWidth
                      variant="outlined"
                      name="Email"
                      value={profile.Email}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item {...gridItemSize}>
                    <TextField
                      label="Kullanıcı Adı"
                      fullWidth
                      variant="outlined"
                      name="Username"
                      value={profile.UserName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon />
                          </InputAdornment>
                        ),
                      }}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item {...gridItemSize}>
                    <TextField
                      label="Şifre"
                      fullWidth
                      variant="outlined"
                      name="Password"
                      value={profile.Password}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon />
                          </InputAdornment>
                        ),
                      }}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  {/* <Grid item {...gridItemSize}>
                    <TextField
                      label="İl"
                      fullWidth
                      variant="outlined"
                      name="city"
                      value={profile.City ? profile.City.Name : ''}
                      onChange={handleInputChange}
                    />
                  </Grid> */}
                  <Grid item {...gridItemSize}>
                    <GenericAutocomplete
                      apiEndpoint="api/search-city-by-name"
                      label="İl"
                      getCRMData={getCRMData}
                      selectedValue={profile.City ? { Id: profile.City.Id, Name: profile.City.Name } : null}
                      onValueChange={handleCityChange}
                    />
                  </Grid>
                </Grid>
              </form>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              {/* Back Button */}
              {/* <Button
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
                </Button> */}

              <Box sx={{ flex: '1 1 auto' }} />

              {/* Next or Submit Button */}
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
            </Box>
          </React.Fragment>
        </Box>
      )}
    </Container>
  );
};

export default ProfileDetail;