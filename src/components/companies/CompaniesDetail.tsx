import { ThemeProvider } from "@emotion/react";
import { FeedRounded, KeyboardDoubleArrowLeftRounded, KeyboardDoubleArrowRightRounded } from "@mui/icons-material";
import { Box, Button, Container, createTheme, Grid, MenuItem, Step, StepLabel, Stepper, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { BrandColors, BrandOptions } from "../../enums/Enums";
import { Company } from "../../models/Company";
import { getCRMData } from "../../requests/ApiCall";
import { CompaniesSubDetail } from "./CompaniesSubDetail";
import {GenericAutocomplete} from "../../helper/Lookup";
import { LookupOptionType } from "../../models/shared/Lookup";

const gridItemSize = {
    xs: 12,
    sm: 12,
    md: 6,
    lg: 6,
    xl: 6,
};

const CompaniesDetail: React.FC = () => {
    const { selectedBrand, isAccount } = useAppContext();
    const { id } = useParams();
    const location = useLocation();
    const stateData = location.state?.data || [];
    console.log(stateData);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const step = ['Genel', 'Adres ve İletişim', 'Diğer Bilgiler'];
    const mobileStep = ['', '', 'Diğer Bilgiler'];

    let steps = isMobile ? mobileStep : step

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
        IsBranch:  false,
        Description: "",

        OwnerId: "",
        CreatedOn: "",
        ModifiedOn: "",
        CreatedBy: "",
        ModifiedBy: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    console.log("CompanyId: ", id)
                    const response = await getCRMData('api/get-company-by-id', id);
                    setAccount(response.data);
                }
            } catch (error) {
                alert(error)
            }
        };
        fetchData();
    }, [id]);


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAccount((prevAccount) => ({
            ...prevAccount,
            [name]: value,
        }));
    };

    const handleSelectFieldChange = (idField: string, nameField: string) => 
        (value: LookupOptionType | LookupOptionType[] | null) => {
          if (Array.isArray(value)) {
            // Çoklu seçim modunda birden fazla seçili öğe varsa
            const selectedIds = value.map(option => option.Id).join(', ');
            const selectedNames = value.map(option => option.Name).join(', ');
            setAccount((prev) => ({ ...prev, [idField]: selectedIds, [nameField]: selectedNames }));
          } else {
            // Tekli seçim modunda
            setAccount((prev) => ({
              ...prev,
              [idField]: value ? value.Id : null,
              [nameField]: value ? value.Name : '',
            }));
          }
        };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        alert(JSON.stringify(account))
        window.location.reload();
    };

    // const isStepOptional = (step: number) => {
    //   return step === 1;
    // };

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

    // const switchStyles = {
    //     '& .MuiSwitch-switchBase.Mui-checked': {
    //         color: selectedBrand === BrandOptions.Budget ? BrandColors.BudgetDark : BrandColors.Avis,
    //     },
    //     '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    //         backgroundColor: selectedBrand === BrandOptions.Budget ? BrandColors.BudgetDark : BrandColors.Avis,
    //     },
    // };


    // type Incident = {
    //     customercode: string;
    //     membershiptype: string;
    //     defaultaccountcode: string;
    //     companyname: string;
    //     invoicecity: string;
    // }

    // const incidentInitData: Incident[] = [
    //     {
    //         customercode: '001',
    //         membershiptype: 'Gold',
    //         defaultaccountcode: '120',
    //         companyname: 'ABC Inc.',
    //         invoicecity: 'Los Angeles',
    //     },
    //     {
    //         customercode: '002',
    //         membershiptype: 'Silver',
    //         defaultaccountcode: '320',
    //         companyname: 'XYZ Corp.',
    //         invoicecity: 'New York',
    //     },
    //     {
    //         customercode: '003',
    //         membershiptype: 'Bronze',
    //         defaultaccountcode: '120',
    //         companyname: '123 Industries',
    //         invoicecity: 'Dallas',
    //     },
    // ];

    // const IncidentInfo = () => {
    //     const [tableData, setTableData] = useState<Incident[]>(incidentInitData);
    //     // const handleSaveRow: MaterialReactTableProps<Invoice>['onEditingRowSave'] = ({ row, values }) => {
    //     //     const updatedData = [...tableData];
    //     //     updatedData[row.index] = values;
    //     //     setTableData(updatedData);
    //     // };

    //     return (
    //         <React.Fragment>
    //             <Box sx={{ margin: 1, maxHeight: '400px', overflowY: 'auto' }}>
    //                 <MaterialReactTable<Incident>
    //                     columns={[
    //                         {
    //                             header: 'Bilet No',
    //                             accessorKey: 'customercode',
    //                         },
    //                         {
    //                             header: 'Oluşturma Tarihi',
    //                             accessorKey: 'customercode',
    //                         },
    //                         {
    //                             header: 'Geliş Kanalı',
    //                             accessorKey: 'customercode',
    //                         },
    //                         {
    //                             header: 'Konu Ağacı 5',
    //                             accessorKey: 'customercode',
    //                         },
    //                         {
    //                             header: 'Marka',
    //                             accessorKey: 'customercode',
    //                         },
    //                         {
    //                             header: 'Sahibi',
    //                             accessorKey: 'customercode',
    //                         },
    //                         {
    //                             header: 'Sorumlu Personel',
    //                             accessorKey: 'customercode',
    //                         },
    //                         {
    //                             header: 'Durum Açıklaması',
    //                             accessorKey: 'membershiptype',
    //                             editVariant: 'select',
    //                             editSelectOptions: [
    //                                 'Hiçbiri', 'Çalışılıyor'
    //                             ],
    //                         },
    //                         {
    //                             header: 'Müşteri',
    //                             accessorKey: 'companyname',
    //                         }
    //                     ]}
    //                     data={tableData}
    //                     enableRowActions
    //                     enableEditing
    //                     editingMode="modal"
    //                     muiTableBodyCellEditTextFieldProps={{
    //                         variant: 'outlined',
    //                     }}
    //                     renderRowActions={({ row, table }) => (
    //                         <Box sx={{ display: 'flex', gap: '1rem' }}>
    //                             <Tooltip arrow placement="left" title="Bilet detay">
    //                                 <IconButton onClick={() => { } /*() => table.setEditingRow(row)*/}>
    //                                     <ConfirmationNumberTwoTone />
    //                                 </IconButton>
    //                             </Tooltip>
    //                         </Box>
    //                     )}
    //                 // onEditingRowSave={handleSaveRow}
    //                 />
    //             </Box>
    //         </React.Fragment>
    //     );
    // }

    // const [expanded, setExpanded] = React.useState<string | false>(false);

    // const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    //     setExpanded(isExpanded ? panel : false);
    // };

    //If companyType is contact
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
                                <MenuItem value="false">Kurumsal</MenuItem>
                                <MenuItem value="true">Şahıs</MenuItem>
                                
                            </TextField>
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <GenericAutocomplete
                                apiEndpoint="api/search-companytype-by-name"
                                label="Şirket Tipi"
                                getCRMData={getCRMData}
                                selectedValue={account.CompanyTypeId ? { Id: account.CompanyTypeId, Name: account.CompanyTypeName, LogicalName:"" } : null}
                                onValueChange={handleSelectFieldChange('CompanyTypeId', 'CompanyTypeName')}
                            />
                        </Grid>
                        {/* <Grid item {...gridItemSize}>
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
                        </Grid> */}
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
                                disabled
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
                        {/* <Grid item {...gridItemSize}>
                            <TextField
                                label="Grup Firma"
                                fullWidth
                                variant="outlined"
                                id="GroupAccountName"
                                name="GroupAccountName"
                                value={account.GroupAccountName}
                                onChange={handleInputChange}
                            />
                        </Grid> */}
                        <Grid item {...gridItemSize}>
                            <GenericAutocomplete
                                apiEndpoint="api/search-lookup-by-name/rms_groupaccount/rms_name"
                                label="Grup Firma"
                                getCRMData={getCRMData}
                                selectedValue={account.GroupAccountId ? { Id: account.GroupAccountId, Name: account.GroupAccountName, LogicalName:"" } : null}
                                onValueChange={handleSelectFieldChange('GroupAccountId', 'GroupAccountName')}
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
                                disabled
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item {...gridItemSize}>
                            <TextField
                                select
                                label="Firma/Şube"
                                fullWidth
                                variant="outlined"
                                id="IsBranch"
                                name="IsBranch"
                                value={account.IsBranch?1:0}
                                onChange={handleInputChange}
                            >
                                <MenuItem value=""></MenuItem>
                                <MenuItem value={0}>Firma</MenuItem>
                                <MenuItem value={1}>Şube</MenuItem>
                            </TextField>
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
                                label="Geliş Kaynağı"
                                fullWidth
                                variant="outlined"
                                id="LeadSource"
                                name="LeadSource"
                                value={account.LeadSource}
                                onChange={handleInputChange}
                            />
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
                    </Grid >
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
                                id="MobilePhone"
                                name="MobilePhone"
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
                                value=""
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
                                value=""
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

    //If companyType is account
    const getStepAccountContent = (step: number) => {
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
                                label="Geliş Kaynağı"
                                fullWidth
                                variant="outlined"
                                id="LeadSource"
                                name="LeadSource"
                                value={account.LeadSource}
                                onChange={handleInputChange}
                            />
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
                                id="MobilePhone"
                                name="MobilePhone"
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
                                value=""
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
                                value=""
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
            <Box sx={{ width: '100%' }}>
                <ThemeProvider theme={defaultTheme}>
                    <Stepper activeStep={activeStep} sx={{
                        '& .MuiSvgIcon-root': {
                            color: selectedBrand === BrandOptions.Budget ? BrandColors.Budget : BrandColors.AvisDark,
                        }
                    }}>
                        {steps.map((label, index) => {
                            const stepProps: { completed?: boolean } = {};
                            const labelProps: {
                                optional?: React.ReactNode;
                            } = {};
                            if (isStepSkipped(index)) {
                                stepProps.completed = false;
                            }
                            return (
                                <Step key={label} {...stepProps} >
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
                            <Button onClick={handleReset}>Sıfırla</Button>
                        </Box>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Box sx={{ mt: 3 }}>
                            <form onSubmit={handleSubmit}>
                                {/* Fill stepper content here.  */}
                                {isAccount ? getStepAccountContent(activeStep) : getStepContactContent(activeStep)}
                            </form>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
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
                                disabled={activeStep === 0}>
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
                            <Box sx={{ flex: '1 1 auto' }} />
                            {(activeStep !== steps.length - 1) &&
                                (
                                    <>
                                        {/* {(activeStep === steps.length - 2) &&
                                            <form onSubmit={handleSubmit}>
                                                <Button variant="outlined"
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
                                                            justifyContent: "flex-end"
                                                        },
                                                    }}
                                                >
                                                    Kaydet
                                                </Button>
                                            </form>
                                        } */}

                                        <Button variant="outlined"
                                            sx={{
                                                m: 1,
                                                width: "25px",
                                                borderColor: selectedBrand === BrandOptions.Budget
                                                    ? BrandColors.Budget
                                                    : BrandColors.AvisDark,
                                                "&:hover": {
                                                    borderColor:
                                                        selectedBrand === BrandOptions.Budget
                                                            ? BrandColors.Budget
                                                            : BrandColors.AvisDark,
                                                    cursor: "pointer",
                                                },
                                                "&:active": {
                                                    color: "red",
                                                },
                                            }}
                                            onClick={handleNext}>
                                            {(activeStep !== steps.length - 2) &&
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
                                                            color: "primary.dark",
                                                        },
                                                    }}
                                                />
                                            }
                                            {(activeStep === steps.length - 2) &&
                                                <FeedRounded
                                                    sx={{
                                                        color: btnColor,
                                                        borderColor: selectedBrand === BrandOptions.Budget
                                                            ? BrandColors.Budget
                                                            : BrandColors.AvisDark,
                                                        "&:hover": {
                                                            color:
                                                                selectedBrand === BrandOptions.Budget
                                                                    ? BrandColors.Budget
                                                                    : BrandColors.AvisDark,
                                                            cursor: "pointer",
                                                        },
                                                        "&:active": {
                                                            color: "primary.dark",
                                                        },
                                                    }}
                                                />
                                            }
                                        </Button>
                                    </>
                                )
                            }
                        </Box>
                    </React.Fragment>
                )}
            </Box>
        </Container >
    );
};

export default CompaniesDetail;
