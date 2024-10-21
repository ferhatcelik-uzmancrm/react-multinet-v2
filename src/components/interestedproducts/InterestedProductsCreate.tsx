import { ThemeProvider } from "@emotion/react";
import { KeyboardDoubleArrowLeftRounded, KeyboardDoubleArrowRightRounded } from "@mui/icons-material";
import { Box, Button, Container, Grid, Step, StepLabel, Stepper, TextField, Typography, createTheme } from "@mui/material";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { BrandColors, BrandOptions } from "../../enums/Enums";
import { InterestedProduct } from "../../models/InterestedProduct";
import { sendRequest } from "../../requests/ApiCall";
import AlertComponent from "../../widgets/Alert";
import Spinner from "../../widgets/Spinner";

const gridItemSize = {
    xs: 12,
    sm: 12,
    md: 6,
    lg: 6,
    xl: 6,
};

const InterestedProductsCreate: React.FC = () => {
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
        LeadId: { Id: "", Name: "" },
        AccountId: { Id: "", Name: "" },
        OpportunityId: { Id: "", Name: "" },
        ContractId: { Id: "", Name: "" },
        QuoteId: { Id: "", Name: "" },
        IsCustomerOrMember: false,
        ProductGroupId: { Id: "", Name: "" },
        MainProductId: { Id: "", Name: "" },
        ProductId: { Id: "", Name: "" },
        Description: "",
        SelfOwnedVehicleNumber: 0,
        NumberLeasedCar: 0,
        VehiclesRequested: 0,
        RequestedRentalTime: 0,
        OwnerId: crmOwner || "",
        CreatedOn: null,
        ModifiedOn: null
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setInterestedProduct((prevLead) => ({
            ...prevLead,
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

        const requiredFields = [
            'Name',
            'LeadId',
            'AccountId',
        ];

        const newErrors: { [key: string]: boolean } = {};

        requiredFields.forEach((field) => {
            if (!interestedProduct[field as keyof typeof interestedProduct]) {
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

        console.log('Form submitted successfully', interestedProduct);


        setLoading(true)

        try {
            await sendRequest("api/upsert-interestedproduct", interestedProduct)
                .then(response => {
                    console.log("Interested product created:", response.data)
                    setAlertState({
                        message: "Interested product successfully!",
                        type: 'success',
                        position: 'bottom-right',
                        showProgress: true,
                        isOpen: true,
                    });
                })
                .catch(error => {
                    const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
                    console.error("Error creating interested product:", errorMessage)
                    setAlertState({
                        message: "Error creating interested product. Please try again." + errorMessage,
                        type: 'danger',
                        position: 'bottom-right',
                        showProgress: true,
                        isOpen: true,
                    });
                });
        } catch (error) {
            console.error("Error:", error);
            setAlertState({
                message: "Error creating interested product. Please try again." + error,
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
                            <TextField
                                label="Müşteri Adayı"
                                fullWidth
                                variant="outlined"
                                id="LeadId"
                                name="LeadId"
                                value={interestedProduct.LeadId?.Name}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Firma"
                                fullWidth
                                variant="outlined"
                                id="AccountId"
                                name="AccountId"
                                value={interestedProduct.AccountId?.Name}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Fırsat"
                                fullWidth
                                variant="outlined"
                                id="OpportunityId"
                                name="OpportunityId"
                                value={interestedProduct.OpportunityId?.Name}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Teklif"
                                fullWidth
                                variant="outlined"
                                id="QuoteId"
                                name="QuoteId"
                                value={interestedProduct.QuoteId?.Name}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={2}>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Ürün Grubu"
                                fullWidth
                                variant="outlined"
                                id="ProductGroupId"
                                name="ProductGroupId"
                                value={interestedProduct.ProductGroupId?.Name}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Ana Ürün"
                                fullWidth
                                variant="outlined"
                                id="MainProductId"
                                name="MainProductId"
                                value={interestedProduct.MainProductId?.Name}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Ürün"
                                fullWidth
                                variant="outlined"
                                id="ProductId"
                                name="ProductId"
                                value={interestedProduct.ProductId?.Name}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Müşteri mi Üye mi?"
                                fullWidth
                                variant="outlined"
                                id="IsCustomerOrMember"
                                name="IsCustomerOrMember"
                                value={interestedProduct.IsCustomerOrMember ? "Yes" : "No"}
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

export default InterestedProductsCreate;
