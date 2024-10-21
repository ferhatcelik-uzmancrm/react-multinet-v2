import { ThemeProvider } from "@emotion/react";
import { KeyboardDoubleArrowLeftRounded, KeyboardDoubleArrowRightRounded } from "@mui/icons-material";
import { Box, Button, Container, createTheme, Grid, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { BrandColors, BrandOptions } from "../../enums/Enums";
import { Offer } from "../../models/Offers";
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

const OffersDetail: React.FC = () => {
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

  const [offer, setOffer] = useState<Offer>({
    OfferId: "", // Assuming this can be an empty string or you might want to use null
    Name: "", // Empty string for default
    CustomerId: "", // Empty string for default
    SalesTypeCode: { Value: 0, Label: "" }, // Default OptionSetValueModel
    Possibility: { Value: 0, Label: "" }, // Default OptionSetValueModel
    ApprovalRoleCode: { Value: 0, Label: "" }, // Default OptionSetValueModel
    IsSeasonal: false, // Default boolean value
    OpportunityId: "", // Required field, initialized as an empty string
    QuoteType: { Value: 0, Label: "" }, // Default OptionSetValueModel
    QuoteEndDate: undefined, // Default to undefined for optional Date field
    QuoteApprovalStatus: { Value: 0, Label: "" }, // Default OptionSetValueModel
    LeadSource: { Value: 0, Label: "" }, // Default OptionSetValueModel

    // Product properties
    InterestProductId: "", // Empty string for default
    ProductGroupId: "", // Empty string for default
    PriceLevelId: "", // Empty string for default
    MainProductId: "", // Empty string for default
    ContractTerm: 0, // Default number value

    // Sales Manager Approval properties
    ApprovalStatus4Code: { Value: 0, Label: "" }, // Default OptionSetValueModel
    ApprovalDate4: undefined, // Default to undefined for optional Date field
    ConfirmingStId: "", // Empty string for default

    // Regional Official/Deputy Manager Approval properties
    ApprovalStatus1: { Value: 0, Label: "" }, // Default OptionSetValueModel
    ApprovalDesc1: "", // Empty string for default
    ApprovalDate1: undefined, // Default to undefined for optional Date field
    ConfirmingBmId: "", // Empty string for default

    // Coordinator/Manager Approval properties
    ApprovalStatus2: { Value: 0, Label: "" }, // Default OptionSetValueModel
    ApprovalDesc2: "", // Empty string for default
    ApprovalDate2: undefined, // Default to undefined for optional Date field
    ConfirmingKoId: "", // Empty string for default

    // Collection Coordinator Approval properties
    ApprovalStatus5Code: { Value: 0, Label: "" }, // Default OptionSetValueModel
    ApprovalDesc5: "", // Empty string for default
    ApprovalDate5: undefined, // Default to undefined for optional Date field
    ConfirmingThId: "", // Empty string for default

    // General Manager Approval properties
    ApprovalStatus3: { Value: 0, Label: "" }, // Default OptionSetValueModel
    ApprovalDesc3: "", // Empty string for default
    ApprovalDate3: undefined, // Default to undefined for optional Date field
    ConfirmingGmId: "", // Empty string for default

    OwnerId: "", // Empty string for default
    CreatedBy: undefined, // Default to undefined for optional field
    CreatedOn: undefined, // Default to undefined for optional Date field
    ModifiedOn: undefined, // Default to undefined for optional Date field
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const response = await getCRMData('api/get-offer-by-id', id);
          console.log("OPPO RESPONSE: ", response.data)
          setOffer(response.data);
          console.log(response.data)
        }
      } catch (error) {
        alert(error)
      }
    };
    fetchData();
  }, [id]);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // alert(JSON.stringify(lead))
    setLoading(true)

    try {
      await sendRequest("api/create-offer", offer)
        .then(response => {
          console.log("Offer created:", response.data)
          setAlertState({
            message: "Offer created successfully!",
            type: 'success',
            position: 'bottom-right',
            showProgress: true,
            isOpen: true,
          });
        })
        .catch(error => {
          console.error("Error creating offer:", error)
          setAlertState({
            message: "Error creating offer. Please try again.",
            type: 'danger',
            position: 'bottom-right',
            showProgress: true,
            isOpen: true,
          });
        });
    } catch (error) {
      console.error("Error:", error);
      setAlertState({
        message: "Error creating offer. Please try again.",
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
                label="Offer Id"
                fullWidth
                variant="outlined"
                name="OfferId"
                value={offer.OfferId}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Müşteri"
                fullWidth
                variant="outlined"
                id="CustomerId"
                name="CustomerId"
                value={offer.CustomerId}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Fırsat"
                fullWidth
                variant="outlined"
                id="OpportunityId"
                name="OpportunityId"
                value={offer.OpportunityId}
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
                value={offer.SalesTypeCode.Label}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Teklif Türü"
                fullWidth
                variant="outlined"
                id="QuoteType"
                name="QuoteType"
                value={offer.QuoteType.Label}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Olasılık"
                fullWidth
                variant="outlined"
                id="Possibility"
                name="Possibility"
                value={offer.Possibility.Label}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Teklif Son Geçerlilik Tarihi"
                fullWidth
                variant="outlined"
                id="QuoteEndDate"
                name="QuoteEndDate"
                value={offer.QuoteEndDate}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Onay Veren Rol"
                fullWidth
                variant="outlined"
                id="ApprovalRoleCode"
                name="ApprovalRoleCode"
                value={offer.ApprovalRoleCode.Label}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Sözleşme Onay Durumu"
                fullWidth
                variant="outlined"
                id="QuoteApprovalStatus"
                name="QuoteApprovalStatus"
                value={offer.QuoteApprovalStatus.Label}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item {...gridItemSize}>
              <TextField
                label="Teklif Kaynağı"
                fullWidth
                variant="outlined"
                id="LeadSource"
                name="LeadSource"
                value={offer.LeadSource.Label}
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
                label="İlgilenilen Ürün"
                fullWidth
                variant="outlined"
                id="InterestProductId"
                name="InterestProductId"
                value={offer.InterestProductId}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Ürün Grubu"
                fullWidth
                variant="outlined"
                id="ProductGroupId"
                name="ProductGroupId"
                value={offer.ProductGroupId}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Fiyat Listesi"
                fullWidth
                variant="outlined"
                id="PriceLevelId"
                name="PriceLevelId"
                value={offer.PriceLevelId}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Ana Ürün"
                fullWidth
                variant="outlined"
                id="MainProductId"
                name="MainProductId"
                value={offer.MainProductId}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Kontrat Süresi"
                fullWidth
                variant="outlined"
                id="ContractTerm"
                name="ContractTerm"
                value={offer.ContractTerm}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

          </Grid >
        );

      case 2:
        return (
          <Grid container spacing={2}>

            <Grid item {...gridItemSize}>
              <TextField
                label="Onay Durumu"
                fullWidth
                variant="outlined"
                id="ApprovalStatus4Code"
                name="ApprovalStatus4Code"
                value={offer.ApprovalStatus4Code}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item {...gridItemSize}>
              <TextField
                label="Onay/Ret Tarihi"
                fullWidth
                variant="outlined"
                id="ApprovalDate4"
                name="ApprovalDate4"
                value={offer.ApprovalDate4}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Onay/Ret Açıklaması"
                fullWidth
                variant="outlined"
                id="ApprovalDesc1"
                name="ApprovalDesc1"
                value={offer.ApprovalDesc1}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Onaylayan"
                fullWidth
                variant="outlined"
                id="ConfirmingStId"
                name="ConfirmingStId"
                value={offer.ConfirmingStId}
                // onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

          </Grid >
        )
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

export default OffersDetail;
