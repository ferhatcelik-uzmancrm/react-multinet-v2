/* eslint-disable jsx-a11y/anchor-is-valid */
import { BrowserUpdatedTwoTone, EditNoteTwoTone, KeyboardDoubleArrowLeftRounded, KeyboardDoubleArrowRightRounded, TravelExploreTwoTone } from '@mui/icons-material/';
import { CircularProgress } from "@mui/joy";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton, { iconButtonClasses } from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Link from "@mui/joy/Link";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import { Container, createTheme, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, MenuItem, Step, StepLabel, Stepper, TableBody, TableCell, TableHead, TableRow, TextField, ThemeProvider, useMediaQuery, useTheme } from "@mui/material";
import MaterialButton from "@mui/material/Button";
import * as React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { BrandColors, BrandOptions } from "../../enums/Enums";
import { fakeCompanyData } from "../../fake/fakeCompanyData";
import { handleExport } from "../../helper/Export";
import { Offer, OfferRequest } from "../../models/Offers";
import { fetchUserData, getCRMData, sendRequest } from "../../requests/ApiCall";
import Pagination from '../../helper/Pagination';
import { LookupOptionType } from '../../models/shared/Lookup';
import { OptionSetType } from '../../models/shared/OptionSetValueModel';
import { GenericAutocomplete, OptionSet } from '../../helper/Lookup';
import AlertComponent from '../../widgets/Alert';
import Spinner from '../../widgets/Spinner';
import { SalesOrder } from '../../models/SalesOrder';
import { SalesOrderSubDetail } from './SalesOrderSubDetail';

const gridItemSize = {
    xs: 12,
    sm: 12,
    md: 6,
    lg: 6,
    xl: 6,
  };
  
  const SalesOrderDetail: React.FC = () => {
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
  
    const [salesOrder, setSalesOrder] = useState<SalesOrder>({
        SalesOrderId: "",
        Name: "",
        ContractNumber: "",
        CustomerId: { Id: "", Name: "", LogicalName: "" },
        QuoteId: { Id: "", Name: "", LogicalName: "" },
        ContactId: { Id: "", Name: "", LogicalName: "" },
        OpportunityId: { Id: "", Name: "", LogicalName: "" },
        ContractStartDate: null,
        ContractEndDate: null,
        QuoteType: { Value: 0, Label: "" },
        SalesTypeCode: { Value: 0, Label: "" },
        IsSeasonal: false,
        RateId: { Id: "", Name: "", LogicalName: "" },
        DtedarikFlag: false,
        IssendErp: false,
        SalesOrders: [],
        CreatedOn: null,
        ModifiedOn: null
      });
      
      useEffect(() => {
        const fetchData = async () => {
          try {
            if (id) {
              const response = await getCRMData('api/get-salesorder-by-id', id);
              setSalesOrder(response.data);
            }
          } catch (error) {
            alert(error);
          }
        };
        fetchData();
      }, []);
  
    const handleSelectFieldChange2 = (fieldName: string) =>
      (value: LookupOptionType | LookupOptionType[] | null) => {
        if (Array.isArray(value)) {
          // Çoklu seçim modunda
          const selectedIds = value.map(option => option.Id).join(', ');
          const selectedNames = value.map(option => option.Name).join(', ');
          setSalesOrder(prev => ({
            ...prev,
            [fieldName]: { Id: selectedIds, Name: selectedNames }
          }));
        } else {
   
          setSalesOrder(prev => ({
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
        await sendRequest("api/create-offer", salesOrder)
          .then(response => {
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
  
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setSalesOrder((prevLead) => ({
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
          setSalesOrder(prev => ({
            ...prev,
            [fieldName]: { Value: selectedIds, Label: selectedNames }
          }));
        } else {
          // Tekli seçim modunda
          setSalesOrder(prev => ({
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
  
    //If companyType is contact
    const getStepContent = (step: number) => {
        switch (step) {
          case 0:
            return (
              <Grid container spacing={3}>
                <Grid item {...gridItemSize} sx={{ display: "none" }}>
                  <TextField
                    label="Sipariş Id"
                    fullWidth
                    variant="outlined"
                    name="SalesOrderId"
                    value={salesOrder.SalesOrderId}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item {...gridItemSize}>
                  <TextField
                    label="Sipariş Adı"
                    fullWidth
                    variant="outlined"
                    name="Name"
                    value={salesOrder.Name}
                    onChange={handleInputChange}
                    error={!!errors.Name}
                    helperText={errors.Name ? 'Bu alan zorunludur' : ''}
                  />
                </Grid>
                <Grid item {...gridItemSize}>
                  <TextField
                    label="Kontrat Numarası"
                    fullWidth
                    variant="outlined"
                    name="ContractNumber"
                    value={salesOrder.ContractNumber}
                    onChange={handleInputChange}
                    error={!!errors.ContractNumber}
                    helperText={errors.ContractNumber ? 'Bu alan zorunludur' : ''}
                  />
                </Grid>
                <Grid item {...gridItemSize}>
                  <GenericAutocomplete
                    apiEndpoint="api/get-all-customers"
                    label="Müşteri"
                    getCRMData={getCRMData}
                    selectedValue={salesOrder.CustomerId ? { Id: salesOrder.CustomerId.Id, Name: salesOrder.CustomerId.Name, LogicalName: salesOrder.CustomerId.LogicalName } : null}
                    onValueChange={handleSelectFieldChange2('CustomerId')}
                    error={!!errors.CustomerId}
                    helperText={errors.CustomerId ? 'Bu alan zorunludur' : ''}
                  />
                </Grid>
                <Grid item {...gridItemSize}>
                  <GenericAutocomplete
                    apiEndpoint="api/search-lookup-by-name/quote/name"
                    label="Teklif"
                    getCRMData={getCRMData}
                    selectedValue={salesOrder.QuoteId ? { Id: salesOrder.QuoteId.Id, Name: salesOrder.QuoteId.Name, LogicalName: "" } : null}
                    onValueChange={handleSelectFieldChange2('QuoteId')}
                    error={!!errors.QuoteId}
                    helperText={errors.QuoteId ? 'Bu alan zorunludur' : ''}
                  />
                </Grid>
                <Grid item {...gridItemSize}>
                  <GenericAutocomplete
                    apiEndpoint="api/search-lookup-by-name/contact/fullname"
                    label="İlgili Kişi"
                    getCRMData={getCRMData}
                    selectedValue={salesOrder.ContactId ? { Id: salesOrder.ContactId.Id, Name: salesOrder.ContactId.Name, LogicalName: "" } : null}
                    onValueChange={handleSelectFieldChange2('ContactId')}
                    error={!!errors.ContactId}
                    helperText={errors.ContactId ? 'Bu alan zorunludur' : ''}
                  />
                </Grid>
                <Grid item {...gridItemSize}>
                  <GenericAutocomplete
                    apiEndpoint="api/search-lookup-by-name/opportunity/name"
                    label="Fırsat"
                    getCRMData={getCRMData}
                    selectedValue={salesOrder.OpportunityId ? { Id: salesOrder.OpportunityId.Id, Name: salesOrder.OpportunityId.Name, LogicalName: "" } : null}
                    onValueChange={handleSelectFieldChange2('OpportunityId')}
                    error={!!errors.OpportunityId}
                    helperText={errors.OpportunityId ? 'Bu alan zorunludur' : ''}
                  />
                </Grid>
                <Grid item {...gridItemSize}>
                  <TextField
                    select
                    label="Satış Türü"
                    fullWidth
                    variant="outlined"
                    id="SalesTypeCode"
                    name="SalesTypeCode"
                    value={salesOrder.SalesTypeCode.Value}
                    onChange={handleInputChange}
                    error={!!errors.SalesTypeCode}
                    helperText={errors.SalesTypeCode ? 'Bu alan zorunludur' : ''}
                  >
                    <MenuItem value="">---</MenuItem>
                    <MenuItem value={100000000}>Müşteri Satış</MenuItem>
                    <MenuItem value={100000001}>Üye Satış</MenuItem>
                  </TextField>
                </Grid>
                <Grid item {...gridItemSize}>
                  <TextField
                    select
                    label="Teklif Türü"
                    fullWidth
                    variant="outlined"
                    id="QuoteType"
                    name="QuoteType"
                    value={salesOrder.QuoteType.Value}
                    onChange={handleInputChange}
                    error={!!errors.QuoteType}
                    helperText={errors.QuoteType ? 'Bu alan zorunludur' : ''}
                  >
                    <MenuItem value="">---</MenuItem>
                    <MenuItem value={100000000}>Yeni Teklif</MenuItem>
                    <MenuItem value={100000002}>Kayıptan Kazanç</MenuItem>
                    <MenuItem value={100000001}>Revize Çalışma Koşulu</MenuItem>
                    <MenuItem value={100000003}>Sözleşme Uzatma</MenuItem>
                  </TextField>
                </Grid>
                <Grid item {...gridItemSize}>
                  <TextField
                    type="date"
                    label="Kontrat Başlangıç Tarihi"
                    fullWidth
                    variant="outlined"
                    id="ContractStartDate"
                    name="ContractStartDate"
                    value={
                      salesOrder.ContractStartDate
                        ? new Date(salesOrder.ContractStartDate).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!errors.ContractStartDate}
                    helperText={errors.ContractStartDate ? 'Bu alan zorunludur' : ''}
                  />
                </Grid>
                <Grid item {...gridItemSize}>
                  <TextField
                    type="date"
                    label="Kontrat Bitiş Tarihi"
                    fullWidth
                    variant="outlined"
                    id="ContractEndDate"
                    name="ContractEndDate"
                    value={
                      salesOrder.ContractEndDate
                        ? new Date(salesOrder.ContractEndDate).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!errors.ContractEndDate}
                    helperText={errors.ContractEndDate ? 'Bu alan zorunludur' : ''}
                  />
                </Grid>
                <Grid item {...gridItemSize}>
                  <GenericAutocomplete
                    apiEndpoint="api/search-lookup-by-name/ratelist/name"
                    label="Oran Listesi"
                    getCRMData={getCRMData}
                    selectedValue={salesOrder.RateId ? { Id: salesOrder.RateId.Id, Name: salesOrder.RateId.Name, LogicalName: "" } : null}
                    onValueChange={handleSelectFieldChange2('RateId')}
                    error={!!errors.RateId}
                    helperText={errors.RateId ? 'Bu alan zorunludur' : ''}
                  />
                </Grid>
                <Grid item {...gridItemSize}>
                  <TextField
                    select
                    label="Sezonluk mu?"
                    fullWidth
                    variant="outlined"
                    id="IsSeasonal"
                    name="IsSeasonal"
                    value={Number(salesOrder.IsSeasonal)}
                    onChange={handleInputChange}
                    error={!!errors.IsSeasonal}
                    helperText={errors.IsSeasonal ? 'Bu alan zorunludur' : ''}
                  >
                    <MenuItem value="">---</MenuItem>
                    <MenuItem value={0}>Hayır</MenuItem>
                    <MenuItem value={1}>Evet</MenuItem>
                  </TextField>
                </Grid>
                <Grid item {...gridItemSize}>
                  <TextField
                    select
                    label="Dış Tedarik Flag"
                    fullWidth
                    variant="outlined"
                    id="DtedarikFlag"
                    name="DtedarikFlag"
                    value={Number(salesOrder.DtedarikFlag)}
                    onChange={handleInputChange}
                    error={!!errors.DtedarikFlag}
                    helperText={errors.DtedarikFlag ? 'Bu alan zorunludur' : ''}
                  >
                    <MenuItem value="">---</MenuItem>
                    <MenuItem value={0}>Hayır</MenuItem>
                    <MenuItem value={1}>Evet</MenuItem>
                  </TextField>
                </Grid>
                <Grid item {...gridItemSize}>
                  <TextField
                    select
                    label="ERP'ye Gönderilsin mi?"
                    fullWidth
                    variant="outlined"
                    id="IssendErp"
                    name="IssendErp"
                    value={Number(salesOrder.IssendErp)}
                    onChange={handleInputChange}
                    error={!!errors.IssendErp}
                    helperText={errors.IssendErp ? 'Bu alan zorunludur' : ''}
                  >
                    <MenuItem value="">---</MenuItem>
                    <MenuItem value={0}>Hayır</MenuItem>
                    <MenuItem value={1}>Evet</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            );
          case 1:
            return (<SalesOrderSubDetail data={salesOrder.SalesOrders} />);
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
                    {getStepContent(activeStep)}
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
  
  export default SalesOrderDetail;
  