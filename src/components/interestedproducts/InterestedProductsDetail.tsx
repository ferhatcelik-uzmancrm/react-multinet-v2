import { ThemeProvider } from "@emotion/react";
import { KeyboardDoubleArrowLeftRounded, KeyboardDoubleArrowRightRounded } from "@mui/icons-material";
import { Box, Button, Container, createTheme, Grid, Step, StepLabel, MenuItem, Stepper, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { BrandColors, BrandOptions } from "../../enums/Enums";
import { InterestedProduct } from "../../models/InterestedProduct";
import {GenericAutocomplete} from "../../helper/Lookup";
import { LookupOptionType } from "../../models/shared/Lookup";
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

const InterestedProductsDetail: React.FC = () => {
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

    const [interestedProduct, setInterestedProduct] = useState<InterestedProduct>({
        InterestedProductId: "",
        Name: "",
        LeadId: { Id: "", Name: "", LogicalName:"" },
        AccountId: { Id: "", Name: "", LogicalName:"" },
        OpportunityId: { Id: "", Name: "", LogicalName:"" },
        ContractId: { Id: "", Name: "", LogicalName:"" },
        QuoteId: { Id: "", Name: "", LogicalName:"" },
        IsCustomerOrMember: false,
        ProductGroupId: { Id: "", Name: "", LogicalName:"" },
        MainProductId: { Id: "", Name: "", LogicalName:"" },
        ProductId: { Id: "", Name: "", LogicalName:"" },
        Description: "",
        SelfOwnedVehicleNumber: 0,
        NumberLeasedCar: 0,
        VehiclesRequested: 0,
        RequestedRentalTime: 0,
        OwnerId: crmOwner || "",
        CreatedOn: null,
        ModifiedOn: null
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const response = await getCRMData('api/get-interested-product-by-id', id);
                    // console.log("LEAD RESPONSE: ", response.data)
                    setInterestedProduct(response.data);
                    // console.log(response.data)
                }
            } catch (error) {
                alert(error)
            }
        };
        fetchData();
    }, [id]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setInterestedProduct((prevAccount) => ({
            ...prevAccount,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // alert(JSON.stringify(lead))
        setLoading(true)

        try {
            await sendRequest("api/upsert-interestedproduct", interestedProduct)
                .then(response => {
                    console.log("Lead updated:", response.data)
                    setAlertState({
                        message: "Lead updated successfully!",
                        type: 'success',
                        position: 'bottom-right',
                        showProgress: true,
                        isOpen: true,
                    });
                })
                .catch(error => {
                    console.error("Error updating lead:", error)
                    setAlertState({
                        message: "Error updating lead. Please try again.",
                        type: 'danger',
                        position: 'bottom-right',
                        showProgress: true,
                        isOpen: true,
                    });
                });
        } catch (error) {
            console.error("Error:", error);
            setAlertState({
                message: "Error updating lead. Please try again.",
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

    const handleSelectFieldChange2 = (fieldName: string) =>
        (value: LookupOptionType | LookupOptionType[] | null) => {
            if (Array.isArray(value)) {
                // Çoklu seçim modunda
                const selectedIds = value.map(option => option.Id).join(', ');
                const selectedNames = value.map(option => option.Name).join(', ');
                setInterestedProduct(prev => ({
                    ...prev,
                    [fieldName]: { Id: selectedIds, Name: selectedNames }
                }));
            } else {
                // Tekli seçim modunda
                setInterestedProduct(prev => ({
                    ...prev,
                    [fieldName]: { Id: value ? value.Id : "", Name: value ? value.Name : "" }
                }));
            }
        };
    //If companyType is contact
    const getStepInterestedProductContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={3}>
                        <Grid item {...gridItemSize} sx={{ display: "none" }}>
                            <TextField
                                label="Interested Product Id"
                                fullWidth
                                variant="outlined"
                                name="InterestedProductId"
                                value={interestedProduct.InterestedProductId}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="İlgilenilen Ürün"
                                fullWidth
                                variant="outlined"
                                id="Name"
                                name="Name"
                                value={interestedProduct.Name}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <GenericAutocomplete
                                apiEndpoint="api/search-lookup-by-name/lead/companyname"
                                label="Müşteri Adayı"
                                getCRMData={getCRMData}
                                selectedValue={interestedProduct.LeadId ? { Id: interestedProduct.LeadId.Id, Name: interestedProduct.LeadId.Name, LogicalName:"" } : null}
                                onValueChange={handleSelectFieldChange2('LeadId')}
                                disabled={true}
                                error={!!errors.LeadId} // Hata kontrolü
                                helperText={errors.LeadId ? 'Bu alan zorunludur' : ''} // Hata mesajı
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <GenericAutocomplete
                                apiEndpoint="api/search-lookup-by-name/account/name"
                                label="Firma"
                                getCRMData={getCRMData}
                                selectedValue={interestedProduct.AccountId ? { Id: interestedProduct.AccountId.Id, Name: interestedProduct.AccountId.Name , LogicalName:""} : null}
                                onValueChange={handleSelectFieldChange2('AccountId')}
                                error={!!errors.AccountId} // Hata kontrolü
                                helperText={errors.AccountId ? 'Bu alan zorunludur' : ''} // Hata mesajı
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <GenericAutocomplete
                                apiEndpoint="api/search-lookup-by-name/opportunity/name"
                                label="Fırsat"
                                getCRMData={getCRMData}
                                selectedValue={interestedProduct.OpportunityId ? { Id: interestedProduct.OpportunityId.Id, Name: interestedProduct.OpportunityId.Name, LogicalName:"" } : null}
                                onValueChange={handleSelectFieldChange2('OpportunityId')}
                                error={!!errors.AccountId} // Hata kontrolü
                                helperText={errors.AccountId ? 'Bu alan zorunludur' : ''} // Hata mesajı
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <GenericAutocomplete
                                apiEndpoint="api/search-lookup-by-name/quote/name"
                                label="Teklif"
                                getCRMData={getCRMData}
                                selectedValue={interestedProduct.QuoteId ? { Id: interestedProduct.QuoteId.Id, Name: interestedProduct.QuoteId.Name, LogicalName:"" } : null}
                                onValueChange={handleSelectFieldChange2('QuoteId')}
                                error={!!errors.QuoteId} // Hata kontrolü
                                helperText={errors.QuoteId ? 'Bu alan zorunludur' : ''} // Hata mesajı
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <GenericAutocomplete
                                apiEndpoint="api/search-lookup-by-name/contract/name"
                                label="Sözleşme"
                                getCRMData={getCRMData}
                                selectedValue={interestedProduct.ContractId ? { Id: interestedProduct.ContractId.Id, Name: interestedProduct.ContractId.Name, LogicalName:"" } : null}
                                onValueChange={handleSelectFieldChange2('ContractId')}
                                error={!!errors.ContractId} // Hata kontrolü
                                helperText={errors.ContractId ? 'Bu alan zorunludur' : ''} // Hata mesajı
                            />
                        </Grid>
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={2}>
                        <Grid item {...gridItemSize}>
                            <GenericAutocomplete
                                apiEndpoint="api/search-lookup-by-name/rms_productgroup/rms_name"
                                label="Ürün Grubu"
                                getCRMData={getCRMData}
                                selectedValue={interestedProduct.ProductGroupId ? { Id: interestedProduct.ProductGroupId.Id, Name: interestedProduct.ProductGroupId.Name, LogicalName:"" } : null}
                                onValueChange={handleSelectFieldChange2('ProductGroupId')}
                                disabled={true}
                                error={!!errors.ProductGroupId} // Hata kontrolü
                                helperText={errors.ProductGroupId ? 'Bu alan zorunludur' : ''} // Hata mesajı
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <GenericAutocomplete
                                apiEndpoint="api/search-lookup-by-name/rms_mainproduct/rms_name"
                                label="Ana Ürün"
                                getCRMData={getCRMData}
                                selectedValue={interestedProduct.MainProductId ? { Id: interestedProduct.MainProductId.Id, Name: interestedProduct.MainProductId.Name, LogicalName:"" } : null}
                                onValueChange={handleSelectFieldChange2('MainProductId')}
                                disabled={true}
                                error={!!errors.MainProductId} // Hata kontrolü
                                helperText={errors.MainProductId ? 'Bu alan zorunludur' : ''} // Hata mesajı
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <GenericAutocomplete
                                apiEndpoint="api/search-lookup-by-name/product/name"
                                label="Ürün"
                                getCRMData={getCRMData}
                                selectedValue={interestedProduct.ProductId ? { Id: interestedProduct.ProductId.Id, Name: interestedProduct.ProductId.Name , LogicalName:""} : null}
                                onValueChange={handleSelectFieldChange2('ProductId')}
                                error={!!errors.ProductId} // Hata kontrolü
                                helperText={errors.ProductId ? 'Bu alan zorunludur' : ''} // Hata mesajı
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                select
                                label="Müşteri mi Üye mi?"
                                fullWidth
                                variant="outlined"
                                id="IsCustomerOrMember"
                                name="IsCustomerOrMember"
                                value={Number(interestedProduct.IsCustomerOrMember)}
                                onChange={handleInputChange}
                                InputProps={{
                                    readOnly: true,
                                  }}
                            >
                                <MenuItem value="">---</MenuItem>
                                <MenuItem value={0}>Müşteri</MenuItem>
                                <MenuItem value={1}>Üye</MenuItem>

                            </TextField>
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Açıklama"
                                fullWidth
                                variant="outlined"
                                id="Description"
                                name="Description"
                                value={interestedProduct.Description}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Özmal Binek Araç Sayısı"
                                fullWidth
                                variant="outlined"
                                id="SelfOwnedVehicleNumber"
                                name="SelfOwnedVehicleNumber"
                                value={interestedProduct.SelfOwnedVehicleNumber}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Kiralık Araç Sayısı"
                                fullWidth
                                variant="outlined"
                                id="NumberLeasedCar"
                                name="NumberLeasedCar"
                                value={interestedProduct.NumberLeasedCar}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Talep Edilen Araç Sayısı"
                                fullWidth
                                variant="outlined"
                                id="VehiclesRequested"
                                name="VehiclesRequested"
                                value={interestedProduct.VehiclesRequested}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Talep Edilen Kira Süresi"
                                fullWidth
                                variant="outlined"
                                id="RequestedRentalTime"
                                name="RequestedRentalTime"
                                value={interestedProduct.RequestedRentalTime}
                                onChange={handleInputChange}
                            />
                        </Grid>
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
                                    {getStepInterestedProductContent(activeStep)}
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
                                            Güncelle
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

export default InterestedProductsDetail;
