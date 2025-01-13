import { ThemeProvider } from "@emotion/react";
import { KeyboardDoubleArrowLeftRounded, KeyboardDoubleArrowRightRounded } from "@mui/icons-material";
import { Box, Button, Container, createTheme, Grid, Step, StepLabel, Stepper, MenuItem, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { BrandColors, BrandOptions } from "../../enums/Enums";
import { Offer } from "../../models/Offers";
import { getCRMData, sendRequest } from "../../requests/ApiCall";
import AlertComponent from "../../widgets/Alert";
import Spinner from "../../widgets/Spinner";
import { GenericAutocomplete, OptionSet } from "../../helper/Lookup";
import { LookupOptionType } from "../../models/shared/Lookup";
import { OptionSetType } from "../../models/shared/OptionSetValueModel";
import { QuoteDetail } from "../../models/QuoteDetail";

const gridItemSize = {
  xs: 12,
  sm: 12,
  md: 6,
  lg: 6,
  xl: 6,
};

const QuoteDetailsCreate: React.FC = () => {
  const { selectedBrand } = useAppContext();
  const { id } = useParams();

  const steps = [''];
  
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

  const [quotedetail, setQuoteDetail] = useState<QuoteDetail>({
    QuoteDetailId: "", // Guid
    Name: "", // string
    OptionDay: "", // new_optionday
    PricePerUnit: "", // priceperunit
    Description: "", // rms_description
    Quantity: "", // quantity
    ContractTerm: 0, // new_contractterm
    Rate: "", // rms_rate
    ExtendedAmount: "", // extendedamount
    CreatedOn: new Date(), // createdon
    CustomerId: { Id: "", Name: "", LogicalName:"" }, // rms_customerid
    QuoteId: { Id: "", Name: "", LogicalName:"" }, // quoteid
    QuoteProductGroupId: { Id: "", Name: "", LogicalName:"" }, // rms_quoteproductgroupid
    ProductGroupId: { Id: "", Name: "", LogicalName:"" }, // rms_productgroupid
    MainProductId: { Id: "", Name: "", LogicalName:"" }, // rms_mainproductid
    ProductId: { Id: "", Name: "", LogicalName:"" }, // productid
    UomId: { Id: "", Name: "", LogicalName:"" }, // uomid
    SettlementType: { Value: 0, Label: ""}, // new_settlementtype
    IsProductOverridden: { Value: 0, Label: ""}, // isproductoverridden
    OutSourcing: { Value: 0, Label: ""}, // rms_outsourcing
    UsageTypeCode: { Value: 0, Label: ""}, // rms_usagetypecode
    ServiceCostMonthCode: { Value: 0, Label: ""}, // rms_servicecostmonthcode
    IsUpdated: { Value: 0, Label: ""}, // rms_isupdated
  });


  const handleSelectFieldChange2 = (fieldName: string) =>
    (value: LookupOptionType | LookupOptionType[] | null) => {
      if (Array.isArray(value)) {
        // Çoklu seçim modunda
        const selectedIds = value.map(option => option.Id).join(', ');
        const selectedNames = value.map(option => option.Name).join(', ');
        const selectedLogicalNames = value.map(option => option.LogicalName).join(', ');
        setQuoteDetail(prev => ({
          ...prev,
          [fieldName]: { Id: selectedIds, Name: selectedNames, LogicalName: selectedLogicalNames}
        }));
      } else {
        // Tekli seçim modunda
        setQuoteDetail(prev => ({
          ...prev,
          [fieldName]: { Id: value ? value.Id : "", Name: value ? value.Name : "", LogicalName: value ? value.LogicalName : "" }
        }));
      }
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // alert(JSON.stringify(lead))
    setLoading(true)

    try {
      await sendRequest("api/upsert-quotedetail", quotedetail)
        .then(response => {
          setAlertState({
            message: "QuoteDetail created successfully!",
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setQuoteDetail((prevLead) => ({
      ...prevLead,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: false,
      }));
    }
  };

  const handleSelectOptionFieldChange = (fieldName: string) =>
    (value: OptionSetType | OptionSetType[] | null) => {
      if (Array.isArray(value)) {
        // Çoklu seçim modunda
        const selectedIds = value.map(option => option.Value).join(', ');
        const selectedNames = value.map(option => option.Label).join(', ');
        setQuoteDetail(prev => ({
          ...prev,
          [fieldName]: { Value: selectedIds, Label: selectedNames }
        }));
      } else {
        // Tekli seçim modunda
        setQuoteDetail(prev => ({
          ...prev,
          [fieldName]: { Value: value ? value.Value : "", Label: value ? value.Label : "" }
        }));
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


  const getStepContactContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item {...gridItemSize} sx={{ display: "none" }}>
              <TextField
                label="QuoteDetail Id"
                fullWidth
                variant="outlined"
                name="QuoteDetailId"
                value={quotedetail.QuoteDetailId}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/get-all-customers"
                label="Müşteri"
                getCRMData={getCRMData}
                selectedValue={quotedetail.CustomerId ? { Id: quotedetail.CustomerId.Id, Name: quotedetail.CustomerId.Name, LogicalName: quotedetail.CustomerId.LogicalName } : null}
                onValueChange={handleSelectFieldChange2('CustomerId')}
                error={!!errors.CustomerId} // Hata kontrolü
                helperText={errors.CustomerId ? 'Bu alan zorunludur' : ''} // Hata mesajı
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/search-lookup-by-name/quote/name"
                label="Teklif"
                getCRMData={getCRMData}
                selectedValue={quotedetail.QuoteId ? { Id: quotedetail.QuoteId.Id, Name: quotedetail.QuoteId.Name, LogicalName: "" } : null}
                onValueChange={handleSelectFieldChange2('QuoteId')}
                error={!!errors.QuoteId} // Hata kontrolü
                helperText={errors.QuoteId ? 'Bu alan zorunludur' : ''} // Hata mesajı
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/search-lookup-by-name/rms_productgroup/rms_name"
                label="Teklif Ürün Grubu"
                getCRMData={getCRMData}
                selectedValue={quotedetail.QuoteProductGroupId ? { Id: quotedetail.QuoteProductGroupId.Id, Name: quotedetail.QuoteProductGroupId.Name, LogicalName: "" } : null}
                onValueChange={handleSelectFieldChange2('QuoteProductGroupId')}
                error={!!errors.QuoteProductGroupId} // Hata kontrolü
                helperText={errors.QuoteProductGroupId ? 'Bu alan zorunludur' : ''} // Hata mesajı
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/search-lookup-by-name/rms_mainproduct/rms_name"
                label="Ana Ürün "
                getCRMData={getCRMData}
                selectedValue={quotedetail.MainProductId ? { Id: quotedetail.MainProductId.Id, Name: quotedetail.MainProductId.Name, LogicalName: "" } : null}
                onValueChange={handleSelectFieldChange2('MainProductId')}
                error={!!errors.MainProductId} // Hata kontrolü
                helperText={errors.MainProductId ? 'Bu alan zorunludur' : ''} // Hata mesajı
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/search-lookup-by-name/product/name"
                label="Varolan Ürün "
                getCRMData={getCRMData}
                selectedValue={quotedetail.ProductId ? { Id: quotedetail.ProductId.Id, Name: quotedetail.ProductId.Name, LogicalName: "" } : null}
                onValueChange={handleSelectFieldChange2('ProductId')}
                error={!!errors.ProductId} // Hata kontrolü
                helperText={errors.ProductId ? 'Bu alan zorunludur' : ''} // Hata mesajı
              />
            </Grid>

            <Grid item {...gridItemSize}>
              <TextField
                select
                label="Ürün Seç"
                fullWidth
                variant="outlined"
                id="IsProductOverridden"
                name="IsProductOverridden"
                value={quotedetail.IsProductOverridden.Value}
                onChange={handleInputChange}
              >
                <MenuItem value="">---</MenuItem>
                <MenuItem value={0}>Varolan</MenuItem>
                <MenuItem value={1}>Serbest Ekle</MenuItem>
              </TextField>
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                select
                label="Dış Tedarik"
                fullWidth
                variant="outlined"
                id="OutSourcing"
                name="OutSourcing"
                value={quotedetail.OutSourcing.Value}
                onChange={handleInputChange}
              >
                <MenuItem value="">---</MenuItem>
                <MenuItem value={1}>Evet</MenuItem>
                <MenuItem value={0}>Hayır</MenuItem>

              </TextField>
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                select
                label="Kullanım Tipi"
                fullWidth
                variant="outlined"
                id="UsageTypeCode"
                name="UsageTypeCode"
                value={quotedetail.UsageTypeCode.Value}
                onChange={handleInputChange}
              >
                <MenuItem value="">---</MenuItem>
                <MenuItem value={0}>Tek Seferlik</MenuItem>
                <MenuItem value={1}>Aylık</MenuItem>
                <MenuItem value={2}>İade Faturası</MenuItem>
              </TextField>
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Miktar"
                fullWidth
                variant="outlined"
                id="Quantity"
                name="Quantity"
                value={quotedetail.Quantity}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Vade(Gün)"
                fullWidth
                variant="outlined"
                id="OptionDay"
                name="OptionDay"
                value={quotedetail.OptionDay}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Oranı(%)"
                fullWidth
                variant="outlined"
                id="Rate"
                name="Rate"
                value={quotedetail.Rate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Kontrat Süresi(Ay)"
                fullWidth
                variant="outlined"
                id="ContractTerm"
                name="ContractTerm"
                value={quotedetail.ContractTerm}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <TextField
                label="Açıklama"
                fullWidth
                variant="outlined"
                id="Description"
                name="Description"
                value={quotedetail.Description}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <GenericAutocomplete
                apiEndpoint="api/search-lookup-by-name/uom/name"
                label="Birim"
                getCRMData={getCRMData}
                selectedValue={quotedetail.UomId ? { Id: quotedetail.UomId.Id, Name: quotedetail.UomId.Name, LogicalName: "" } : null}
                onValueChange={handleSelectFieldChange2('UomId')}
                error={!!errors.UomId} // Hata kontrolü
                helperText={errors.UomId ? 'Bu alan zorunludur' : ''} // Hata mesajı
              />
            </Grid>
            <Grid item {...gridItemSize}>
              <OptionSet
                apiEndpoint="api/search-lookup-by-optionsetname/new_month"
                label="Hizmet Bedeli Alınacak İlk Ay"
                getCRMData={getCRMData}
                selectedValue={quotedetail.ServiceCostMonthCode ? { Value: quotedetail.ServiceCostMonthCode.Value, Label: quotedetail.ServiceCostMonthCode.Label } : null}
                onValueChange={handleSelectOptionFieldChange('ServiceCostMonthCode')}
                error={!!errors.ServiceCostMonthCode} // Hata kontrolü
                helperText={errors.ServiceCostMonthCode ? 'Bu alan zorunludur' : ''} // Hata mesajı
              />
            </Grid>

            {/* <Grid item {...gridItemSize}>
              <TextField
                type="date"
                label="Oluşturma Tarihi"
                fullWidth
                variant="outlined"
                id="CreatedOn"
                name="CreatedOn"
                value={
                    quotedetail.CreatedOn
                    ? new Date(quotedetail.CreatedOn).toISOString().split('T')[0]
                    : '' // Eğer boş bir değer varsa
                }
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true, // Bu satır, label'ın tarih picker'ın üstünde kalmasını sağlar.
                }}
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

export default QuoteDetailsCreate;
