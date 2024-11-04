import { ThemeProvider } from "@emotion/react";
import { KeyboardDoubleArrowLeftRounded, KeyboardDoubleArrowRightRounded } from "@mui/icons-material";
import { Box, Button, Container, createTheme, Grid, MenuItem, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { BrandColors, BrandOptions } from "../../enums/Enums";
import { Company } from "../../models/Company";
import { sendRequest } from "../../requests/ApiCall";
import AlertComponent from "../../widgets/Alert";
import Spinner from "../../widgets/Spinner";
import { CompaniesSubDetail } from "./CompaniesSubDetail";
const gridItemSize = {
    xs: 12,
    sm: 12,
    md: 6,
    lg: 6,
    xl: 6,
};

const CompaniesCreate: React.FC = () => {
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

    const [account, setAccount] = useState<Company>({
        CompanyId: id || "",
        Name: "",
        BrandName: "",
        IsAccountType: false,
        TaxNumber: "",
        TcNo: "",
        EmailAddress: "",
        MobilePhone: "",

        TaxOfficeId: "",
        TaxOfficeName: "",
        CompanyTypeId: "",
        CompanyTypeName: "",
        GroupAccountId: "",
        GroupAccountName: "",
        LeadSource: 100000000,
        CardType: "",
        CustomerSector: "",
        InvoiceName: "",
        IsBranch: false,
        Description: "",

        OwnerId: crmOwner || "",
        CreatedOn: "",
        ModifiedOn: "",
        CreatedBy: crmOwner || "",
        ModifiedBy: "",
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        // const jsonString = JSON.stringify(value);
        // console.log(value);
        // console.log(jsonString);
        setAccount((prevLead) => ({
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
            'EmailAddress',
            'MobilePhone',
            'BrandName',
            'TaxNumber',
            'TcNo',
            'CompanyTypeId',
            'LeadSource',
            'InvoiceName',
            'Description',
        ];

        const newErrors: { [key: string]: boolean } = {};

        requiredFields.forEach((field) => {
            if (!account[field as keyof typeof account]) {
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

        console.log('Form submitted successfully', account);


        setLoading(true)

        try {
            await sendRequest("api/create-company", account)
                .then(response => {
                    console.log("Company created:", response.data)
                    setAlertState({
                        message: "Company created successfully!",
                        type: 'success',
                        position: 'bottom-right',
                        showProgress: true,
                        isOpen: true,
                    });
                })
                .catch(error => {
                    const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
                    console.error("Error creating company:", errorMessage)
                    setAlertState({
                        message: "Error creating company. Please try again." + errorMessage,
                        type: 'danger',
                        position: 'bottom-right',
                        showProgress: true,
                        isOpen: true,
                    });
                });
        } catch (error) {
            console.error("Error:", error);
            setAlertState({
                message: "Error creating company. Please try again." + error,
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
                        <Grid item {...gridItemSize} sx={{ display: "none" }}>
                            <TextField
                                label="Company Id"
                                fullWidth
                                variant="outlined"
                                name="CompanyId"
                                value={account.CompanyId}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Firma Adı"
                                fullWidth
                                variant="outlined"
                                id="Name"
                                name="Name"
                                value={account.Name}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Marka/Tabela Adı"
                                fullWidth
                                variant="outlined"
                                id="BrandName"
                                name="BrandName"
                                value={account.BrandName}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Fatura Adı"
                                fullWidth
                                variant="outlined"
                                id="InvoiceName"
                                name="InvoiceName"
                                value={account.InvoiceName}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                select
                                label="Firma Türü"
                                fullWidth
                                variant="outlined"
                                id="IsAccountType"
                                name="IsAccountType"
                                value={account.IsAccountType}
                                onChange={handleInputChange}
                            >
                                <MenuItem value="1">Şahıs</MenuItem>
                                <MenuItem value="2">Kurumsal</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                select
                                label="Şirket Tipi"
                                fullWidth
                                variant="outlined"
                                id="CompanyTypeId"
                                name="CompanyTypeId"
                                value={account.CompanyTypeId}
                                onChange={handleInputChange}
                            >
                                <MenuItem value="1">Şahıs</MenuItem>
                                <MenuItem value="2">Anonim</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Vergi Dairesi"
                                fullWidth
                                variant="outlined"
                                id="TaxOfficeName"
                                name="TaxOfficeName"
                                value={account.TaxOfficeName}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Vergi Numarası"
                                fullWidth
                                variant="outlined"
                                id="TaxNumber"
                                name="TaxNumber"
                                value={account.TaxNumber}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="TC Kimlik No"
                                fullWidth
                                variant="outlined"
                                id="TcNo"
                                name="TcNo"
                                value={account.TcNo}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Grup Firma"
                                fullWidth
                                variant="outlined"
                                id="GroupAccountName"
                                name="GroupAccountName"
                                value={account.GroupAccountName}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Müşteri Sektör"
                                fullWidth
                                variant="outlined"
                                id="CustomerSector"
                                name="CustomerSector"
                                value={account.CustomerSector}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Firma/Şube"
                                fullWidth
                                variant="outlined"
                                id="IsBranch"
                                name="IsBranch"
                                value={account.IsBranch}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Kart Tipi"
                                fullWidth
                                variant="outlined"
                                id="CardType"
                                name="CardType"
                                value={account.CardType}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                select
                                label="Geliş Kaynağı"
                                fullWidth
                                variant="outlined"
                                id="LeadSource"
                                name="LeadSource"
                                value={account.LeadSource}
                                onChange={handleInputChange}
                            >
                                <MenuItem value="100000000">Web Sitesi</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Açıklama"
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                name="Description"
                                value={account.Description}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={2}>
                        {/* <Grid item {...gridItemSize}>
                            <Autocomplete
                                multiple
                                id="company"
                                className="company"
                                fullWidth
                                options={account.Name}
                                getOptionLabel={(option) => option.name}
                                value={account.Name}
                                onChange={handleCompanyChange}
                                // renderOption={(props, option, { selected }) => (
                                //   <li {...props} style={{ fontWeight: selected ? 'bold' : 'normal' }}>
                                //     {option.name}
                                //   </li>
                                // )}
                                renderInput={(params) => (
                                    <TextField {...params} label="Firma" />
                                )}
                                limitTags={1}
                                readOnly
                                sx={{
                                    '& .MuiAutocomplete-tag': {
                                        fontWeight: 'bold',
                                        color: 'GrayText'
                                    },
                                }}
                            />
                        </Grid> */}
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Telefon"
                                fullWidth
                                variant="outlined"
                                id="MobilePhone"
                                name="MobilePhone"
                                value={account.MobilePhone}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Cep Telefonu"
                                fullWidth
                                variant="outlined"
                                id="Phone"
                                name="Phone"
                                value={account.MobilePhone}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="E-posta Adresi"
                                fullWidth
                                variant="outlined"
                                id="EmailAddress"
                                name="EmailAddress"
                                value={account.EmailAddress}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Fatura Adresi"
                                fullWidth
                                variant="outlined"
                                id="invoiceaddress"
                                name="invoiceaddress"
                                value={account.EmailAddress}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Merkez Adresi"
                                fullWidth
                                variant="outlined"
                                id="address"
                                name="address"
                                value={account.EmailAddress}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid >
                );
            case 2:
                return <CompaniesSubDetail />
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

export default CompaniesCreate;
