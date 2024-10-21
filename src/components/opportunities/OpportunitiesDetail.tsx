import { ThemeProvider } from "@emotion/react";
import { KeyboardDoubleArrowLeftRounded, KeyboardDoubleArrowRightRounded } from "@mui/icons-material";
import { Box, Button, Container, createTheme, Grid, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { BrandColors, BrandOptions } from "../../enums/Enums";
import { Opportunity } from "../../models/Opportunity";
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

const OpportunitiesDetail: React.FC = () => {
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

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  // var ownerName = localStorage.getItem("username");
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

  const [opportunity, setOpportunity] = useState<Opportunity>({
    OpportunityId: "",
    Name: "",
    OpportunityNumber: "",
    CustomerId: "",
    CustomerName: "",
    EstimatedRevenue: 0,
    CloseDate: "",
    SalesStage: 0,
    SalesTypeCode: 0,
    ParentContactId: "",
    ParentContactName: "",
    ParentAccountId: "",
    ParentAccountName: "",
    EstimatedCloseDate: "",
    OpportunityRatingCode: 0,
    OpportunityRatingName: "",
    LeadSource: 0,
    CurrentSituation: "",
    CustomerNeed: "",
    ProposedSolution: "",
    OwnerId: crmOwner || "",
    CreatedBy: crmOwner || "",
    CreatedOn: "",
    ModifiedOn: "",
    ModifiedBy: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const response = await getCRMData('api/get-opportunity-by-id', id);
          console.log("OPPO RESPONSE: ", response.data)
          setOpportunity(response.data);
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
  //   setOpportunity((prevAccount) => ({
  //     ...prevAccount,
  //     [name]: value,
  //   }));
  // };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // alert(JSON.stringify(lead))
    setLoading(true)

    try {
      await sendRequest("api/create-opportunity", opportunity)
        .then(response => {
          console.log("Opportunity created:", response.data)
          setAlertState({
            message: "Opportunity created successfully!",
            type: 'success',
            position: 'bottom-right',
            showProgress: true,
            isOpen: true,
          });
        })
        .catch(error => {
          console.error("Error creating opportunity:", error)
          setAlertState({
            message: "Error creating opportunity. Please try again.",
            type: 'danger',
            position: 'bottom-right',
            showProgress: true,
            isOpen: true,
          });
        });
    } catch (error) {
      console.error("Error:", error);
      setAlertState({
        message: "Error creating opportunity. Please try again.",
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
                label="Opportunity Id"
                fullWidth
                variant="outlined"
                name="OpportunityId"
                value={opportunity.OpportunityId}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Firma"
                fullWidth
                variant="outlined"
                id="ParentAccountName"
                name="ParentAccountName"
                value={opportunity.ParentAccountName}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="İlgili Kişi"
                fullWidth
                variant="outlined"
                id="ParentContactName"
                name="ParentContactName"
                value={opportunity.ParentContactName}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Satış Türü"
                fullWidth
                variant="outlined"
                id="SalesTypeCode"
                name="SalesTypeCode"
                value={opportunity.SalesTypeCode}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item {...gridItemSize}>
              <TextField
                label="Tahmini Kapanış Tarihi"
                fullWidth
                variant="outlined"
                id="EstimatedCloseDate"
                name="EstimatedCloseDate"
                value={opportunity.EstimatedCloseDate}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item {...gridItemSize}>
              <TextField
                label="Fırsatın Durumu"
                fullWidth
                variant="outlined"
                id="OpportunityRatingCode"
                name="OpportunityRatingCode"
                value={opportunity.OpportunityRatingCode}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Tahmini Gelir"
                fullWidth
                variant="outlined"
                id="EstimatedRevenue"
                name="EstimatedRevenue"
                value={opportunity.EstimatedRevenue}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item {...gridItemSize}>
              <TextField
                label="Geliş Kaynağı"
                fullWidth
                variant="outlined"
                id="LeadSource"
                name="LeadSource"
                value={opportunity.LeadSource}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item {...gridItemSize}>
              <TextField
                label="Şu Anki Durum"
                fullWidth
                variant="outlined"
                id="CurrentSituation"
                name="CurrentSituation"
                value=""
                // value={opportunity.CurrentSituation}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Müşteri Gereksinimi"
                fullWidth
                variant="outlined"
                id="CustomerNeed"
                name="CustomerNeed"
                value={opportunity.CustomerNeed}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Sunulan Çözüm"
                fullWidth
                variant="outlined"
                id="ProposedSolution"
                name="ProposedSolution"
                value={opportunity.ProposedSolution}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
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

export default OpportunitiesDetail;