import { ThemeProvider } from "@emotion/react";
import { KeyboardDoubleArrowLeftRounded, KeyboardDoubleArrowRightRounded } from "@mui/icons-material";
import { Box, Button, Container, Grid, MenuItem, Step, StepLabel, Stepper, TextField, Typography, createTheme } from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { BrandColors, BrandOptions } from "../../enums/Enums";
import { GenericAutocomplete } from "../../helper/Lookup";
import { Contact } from "../../models/Contact";
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

const ContactsCreate: React.FC = () => {
    const { selectedBrand } = useAppContext();
    const { id } = useParams();
    const steps = ['', '', ''];
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
    // const [cityApiEndpoint, setCityApiEndpoint] = useState('api/search-city-by-name');
    // const [cityApiEndpoint, setCityApiEndpoint] = useState('api/search-city-by-name');
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

    const [contact, setContact] = useState<Contact>({
        ContactId: id || "",
        FullName: "",
        FirstName: "",
        LastName: "",
        ContactTitleId: "",
        ContactTitleName: "",
        ParentCustomerId: "",
        ParentCustomerName: "",
        TcNo: "",
        GenderCode: 0,
        BirthDate: new Date(),
        MobilePhone: "",
        Telephone: "",
        EmailAddress: "",
        CountryId: "",
        Country: "",
        City: "",
        CityId: "",
        CityName: "",
        NeighbourhoodId: "",
        Neighbourhood: "",
        Town: "",
        TownId: "",
        TownName: "",
        PostalCode: "",
        AddressLine: "",
        OwnerId: crmOwner || "",
        CreatedBy: crmOwner || "",
    });


    const handleSelectFieldChange = (idField: string, nameField: string) =>
        (value: LookupOptionType | LookupOptionType[] | null) => {
            if (Array.isArray(value)) {
                // Çoklu seçim modunda birden fazla seçili öğe varsa
                const selectedIds = value.map(option => option.Id).join(', ');
                const selectedNames = value.map(option => option.Name).join(', ');
                setContact((prev) => ({ ...prev, [idField]: selectedIds, [nameField]: selectedNames }));
            } else {
                // Tekli seçim modunda
                setContact((prev) => ({
                    ...prev,
                    [idField]: value ? value.Id : null,
                    [nameField]: value ? value.Name : '',
                }));
            }
        };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setContact((prevLead) => ({
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
            'FirstName',
            'LastName',
            // 'ContactTitleName',
            // // 'ParentCustomerName',
            // 'TcNo',
            // 'GenderCode',
            // 'BirthDate',
            'ParentCustomerId',
            'MobilePhone',
            // 'Telephone',
            'EmailAddress',
            'CountryId',
            'CityId',
            'NeighbourhoodId',
            'TownId',
            // 'PostalCode',
            // 'AddressLine'
        ];

        const newErrors: { [key: string]: boolean } = {};

        requiredFields.forEach((field) => {
            if (!contact[field as keyof typeof contact]) {
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

        console.log('Form submitted successfully', contact);


        setLoading(true)

        try {
            await sendRequest("api/create-contact", contact)
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
            // GENEL BİLGİLER
            case 0:
                return (
                    <Grid container spacing={3}>
                        <Grid item {...gridItemSize} sx={{ display: "none" }}>
                            <TextField
                                label="Contact Id"
                                fullWidth
                                variant="outlined"
                                name="ContactId"
                                value={contact.ContactId}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Adı"
                                fullWidth
                                variant="outlined"
                                id="FirstName"
                                name="FirstName"
                                value={contact.FirstName}
                                onChange={handleInputChange}
                                required
                                error={!!errors.FirstName}
                                helperText={errors.FirstName ? 'Bu alan zorunludur' : ''}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Soyadı"
                                fullWidth
                                variant="outlined"
                                id="LastName"
                                name="LastName"
                                value={contact.LastName}
                                onChange={handleInputChange}
                                required
                                error={!!errors.FirstName}
                                helperText={errors.FirstName ? 'Bu alan zorunludur' : ''}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <GenericAutocomplete
                                apiEndpoint="api/search-contacttitle-by-name"
                                label="Yetkili Unvanı"
                                getCRMData={getCRMData}
                                selectedValue={contact.ContactTitleId ? { Id: contact.ContactTitleId, Name: contact.ContactTitleName, LogicalName: "" } : null}
                                onValueChange={handleSelectFieldChange('ContactTitleId', 'ContactTitleName')}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <GenericAutocomplete
                                apiEndpoint="api/search-companies-by-name"
                                label="Firması"
                                getCRMData={getCRMData}
                                selectedValue={contact.ParentCustomerId ? { Id: contact.ParentCustomerId, Name: contact.ParentCustomerName, LogicalName: "" } : null}
                                onValueChange={handleSelectFieldChange('ParentCustomerId', 'ParentCustomerName')}
                                required={true} // Alan zorunlu
                                error={!!errors.ParentCustomerId} // Hata kontrolü
                                helperText={errors.ParentCustomerId ? 'Bu alan zorunludur' : ''} // Hata mesajı
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="TC Kimlik No"
                                fullWidth
                                variant="outlined"
                                id="TcNo"
                                name="TcNo"
                                value={contact.TcNo}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                select
                                label="Cinsiyet"
                                fullWidth
                                variant="outlined"
                                id="GenderCode"
                                name="GenderCode"
                                value={contact.GenderCode}
                                onChange={handleInputChange}
                            >
                                <MenuItem value={1}>Erkek</MenuItem>
                                <MenuItem value={2}>Kadın</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                type="date"
                                label="Doğum Tarihi"
                                fullWidth
                                variant="outlined"
                                id="BirthDate"
                                name="BirthDate"
                                value={contact.BirthDate}
                                onChange={handleInputChange}
                                InputLabelProps={{
                                    shrink: true, // Bu satır, label'ın tarih picker'ın üstünde kalmasını sağlar.
                                }}
                            />
                        </Grid>
                    </Grid>
                );

            // İLETİŞİM BİLGİLERİ
            case 1:
                return (
                    <Grid container spacing={2}>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Cep Telefonu"
                                fullWidth
                                variant="outlined"
                                id="MobilePhone"
                                name="MobilePhone"
                                value={contact.MobilePhone}
                                onChange={handleInputChange}
                                required
                                error={!!errors.MobilePhone}
                                helperText={errors.MobilePhone ? 'Bu alan zorunludur' : ''}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="İş Telefonu"
                                fullWidth
                                variant="outlined"
                                id="Telephone"
                                name="Telephone"
                                value={contact.Telephone}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Email Adresi"
                                fullWidth
                                variant="outlined"
                                id="EmailAddress"
                                name="EmailAddress"
                                value={contact.EmailAddress}
                                onChange={handleInputChange}
                                required
                                error={!!errors.EmailAddress}
                                helperText={errors.EmailAddress ? 'Bu alan zorunludur' : ''}
                            />
                        </Grid>
                    </Grid >
                );

            //ADRES BİLGİLERİ
            case 2:
                return (
                    <Grid container spacing={2}>

                        {/* ADRES READONLY */}
                        <Grid item {...gridItemSize}>
                            <GenericAutocomplete
                                apiEndpoint="api/search-country-by-name"
                                label="Ülke"
                                getCRMData={getCRMData}
                                selectedValue={contact.CountryId ? { Id: contact.CountryId, Name: contact.Country, LogicalName: "" } : null}
                                onValueChange={handleSelectFieldChange('CountryId', 'Country')}
                                error={!!errors.CountryId} // Hata kontrolü
                                helperText={errors.CountryId ? 'Bu alan zorunludur' : ''} // Hata mesajı
                                required={true}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <GenericAutocomplete
                                apiEndpoint="api/search-city-by-name"
                                label="İl"
                                getCRMData={getCRMData}
                                selectedValue={contact.CityId ? { Id: contact.CityId, Name: contact.CityName, LogicalName: "" } : null}
                                onValueChange={handleSelectFieldChange('CityId', 'CityName')}
                                error={!!errors.CityId} // Hata kontrolü
                                helperText={errors.CityId ? 'Bu alan zorunludur' : ''} // Hata mesajı
                                required={true}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <GenericAutocomplete
                                apiEndpoint="api/search-town-by-name"
                                label="İlçe"
                                getCRMData={getCRMData}
                                selectedValue={contact.TownId ? { Id: contact.TownId, Name: contact.TownName, LogicalName: "" } : null}
                                onValueChange={handleSelectFieldChange('TownId', 'TownName')}
                                error={!!errors.TownId} // Hata kontrolü
                                helperText={errors.TownId ? 'Bu alan zorunludur' : ''} // Hata mesajı
                                required={true}
                            />
                        </Grid> 
                        <Grid item {...gridItemSize}>
                            <GenericAutocomplete
                                apiEndpoint="api/search-neighbourhood-by-name"
                                label="Mahalle"
                                getCRMData={getCRMData}
                                selectedValue={contact.NeighbourhoodId ? { Id: contact.NeighbourhoodId, Name: contact.Neighbourhood, LogicalName: "" } : null}
                                onValueChange={handleSelectFieldChange('NeighbourhoodId', 'Neighbourhood')}
                                error={!!errors.NeighbourhoodId} // Hata kontrolü
                                helperText={errors.NeighbourhoodId ? 'Bu alan zorunludur' : ''} // Hata mesajı
                                required={true}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Posta Kodu"
                                fullWidth
                                variant="outlined"
                                id="PostalCode"
                                name="PostalCode"
                                value={contact.PostalCode}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                label="Adres Satırı"
                                fullWidth
                                variant="outlined"
                                id="AddressLine"
                                name="AddressLine"
                                value={contact.AddressLine}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        {/* ADRES READONLY */}

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
                                    <Step key={index} {...stepProps}>
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

export default ContactsCreate;
