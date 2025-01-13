import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MaterialReactTable, { MaterialReactTableProps, MRT_Row } from 'material-react-table';
import * as React from 'react';
import { useState, useEffect, useMemo, } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { BrandOptions } from '../../enums/Enums';
import { Contact } from '../../models/Contact';
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserData, getCRMData } from "../../requests/ApiCall";
import { InterestedProduct } from '../../models/InterestedProduct';
import { Activity } from '../../models/Activity';
import { Address } from '../../models/Address';
import { Opportunity } from '../../models/Opportunity';
import { Offer } from '../../models/Offers';
import { QuoteDetail } from '../../models/QuoteDetail';


const OpportunitiesInfo = () => {
    const { id } = useParams<{ id: string }>();
    const [tableData, setTableData] = useState<Opportunity[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCRMData('api/get-opportunities-by-companyid', id);
                setTableData(response.data);
            } catch (error) {
                alert(error);
            }
        };
        fetchData();
    }, [id]);
    return (
        <React.Fragment>
            <Box sx={{ margin: 1, maxHeight: '400px', overflowY: 'auto' }}>
                <MaterialReactTable<Opportunity>
                    columns={[
                        {
                            header: 'Başlık',
                            accessorKey: 'Name',
                        },
                        {
                            header: 'Fırsat Kaynağı',
                            accessorKey: 'LeadSource.Label',
                        },
                        {
                            header: 'Ürün Grubu',
                            accessorKey: 'ProductGroup.Name',                    
                        },
                        {
                            header: 'Oluşturma Tarihi',
                            accessorKey: 'CreatedOn',
                        },
                        {
                            header: 'Sahibi',
                            accessorKey: 'OwnerId.Name',
                        },
                    ]}
                    data={tableData}
                    muiTableBodyCellEditTextFieldProps={{
                        variant: 'outlined',
                    }}
                />
            </Box>
        </React.Fragment>
    );
}

const RegardingContactInfo = () => {
    const { id } = useParams<{ id: string }>();
    const [tableData, setTableData] = useState<Contact[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCRMData('api/get-contacts-by-companyid', id);
                setTableData(response.data);
            } catch (error) {
                alert(error);
            }
        };
        fetchData();
    }, [id]);

    return (
        <React.Fragment>
            <Box sx={{ margin: 1, maxHeight: '400px', overflowY: 'auto' }}>
                <MaterialReactTable<Contact>
                    columns={[
                        {
                            header: 'Tam Ad',
                            accessorKey: 'FullName',
                        },
                        {
                            header: 'Email',
                            accessorKey: 'EmailAddress',
                        },
                        {
                            header: 'Cep Telefonu',
                            accessorKey: "MobilePhone",
                        },
                        {
                            header: 'İş Telefonu',
                            accessorKey: "Telephone",
                        },
                    ]}
                    data={tableData}
                // enableRowActions
                // enableEditing
                // editingMode="row"
                // muiTableBodyCellEditTextFieldProps={{
                //     variant: 'outlined',
                // }}
                />
            </Box>
        </React.Fragment>
    );
}

const AddressInfo = () => {
    const { id } = useParams<{ id: string }>();
    const [tableData, setTableData] = useState<Address[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCRMData('api/get-address-by-companyid', id);
                setTableData(response.data);
            } catch (error) {
                alert(error);
            }
        };
        fetchData();
    }, [id]);

    return (
        <React.Fragment>
            <Box sx={{ margin: 1, maxHeight: '400px', overflowY: 'auto' }}>
                <MaterialReactTable<Address>
                    columns={[
                        {
                            header: 'Adres Türü',
                            accessorKey: 'AddressType',
                            Cell: ({ cell }) => {
                                const value = cell.getValue<number>();
                                const displayValue = {
                                    100000000: 'Merkez Adres',
                                    100000002: 'Fatura Adresi',
                                    100000003: 'Şube',
                                }[value];
                                return displayValue || value;
                            },
                        },
                        {
                            header: 'İl',
                            accessorKey: 'City.Name',
                        },
                        {
                            header: 'İlçe',
                            accessorKey: 'Town.Name',
                        },
                        {
                            header: 'Mahalle',
                            accessorKey: 'Neighbourhood.Name',
                        },
                        {
                            header: 'Sokak',
                            accessorKey: 'Street.Name',
                        },
                        {
                            header: 'Cadde',
                            accessorKey: 'Road.Name',
                        },
                        {
                            header: 'Posta Kodu',
                            accessorKey: 'PostalCode',
                        },

                        {
                            header: 'Oluşturma Tarihi',
                            accessorKey: "CreatedOn",
                        },
                    ]}
                    data={tableData}
                    muiTableBodyRowProps={({ row }: { row: MRT_Row<Address> }) => ({
                        onClick: () => navigate(`/details/${row.original.AddressId}`),
                        style: { cursor: 'pointer' }, // Kullanıcı dostu bir gösterim
                    })}
                />
            </Box>
        </React.Fragment>
    );
}

const InterestedProductInfo = () => {
    const { id } = useParams<{ id: string }>();
    const [tableData, setTableData] = useState<InterestedProduct[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCRMData('api/get-interestedproducts-by-companyid', id);
                setTableData(response.data);
            } catch (error) {
                alert(error);
            }
        };
        fetchData();
    }, [id]);

    return (
        <React.Fragment>
            <Box sx={{ margin: 1, maxHeight: '400px', overflowY: 'auto' }}>
                <MaterialReactTable<InterestedProduct>
                    columns={[
                        {
                            header: 'Fırsat',
                            accessorKey: 'OpportunityId.Name',
                        },
                        {
                            header: 'Ürün Grubu',
                            accessorKey: 'ProductGroupId.Name',
                        },
                        {
                            header: 'Ana Ürün',
                            accessorKey: "MainProductId.Name",
                        },
                        {
                            header: 'Ürün',
                            accessorKey: "ProductId.Name",
                        },
                        {
                            header: 'Oluşturma Tarihi',
                            accessorKey: "CreatedOn",
                        },
                    ]}
                    data={tableData}
                />
            </Box>
        </React.Fragment>
    );
}

const ActivitiesInfo = () => {
    const { id } = useParams<{ id: string }>();
    const [tableData, setTableData] = useState<Activity[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCRMData('api/get-activities-by-companyid', id);
                setTableData(response.data);
            } catch (error) {
                alert(error);
            }
        };
        fetchData();
    }, [id]);

    return (
        <React.Fragment>
            <Box sx={{ margin: 1, maxHeight: '400px', overflowY: 'auto' }}>
                <MaterialReactTable<Activity>
                    columns={[
                        {
                            header: 'Konu',
                            accessorKey: 'Subject',
                        },
                        {
                            header: 'Oluşturma Tarihi',
                            accessorKey: "CreatedOn",
                        },
                        {
                            header: 'Etkinlik Türü',
                            accessorKey: 'ActivityTypeCode',
                            Cell: ({ cell }) => {
                                const value = cell.getValue<string>();
                                const displayValue = {
                                    phonecall: 'Telefon Görüşmesi',
                                    email: 'E-posta',
                                    appointment: 'Ziyaret',
                                }[value];
                                return displayValue || value;
                            },
                        },
                        {
                            header: 'Etkinlik Durumu',
                            accessorKey: 'StateCode',
                            Cell: ({ cell }) => {
                                const value = cell.getValue<number>();
                                const displayValue = {
                                    0: 'Açık',
                                    1: 'Tamamlandı',
                                    2: 'İptal Edildi',
                                    3: 'Zamanlanmış',
                                }[value];
                                return displayValue || value;
                            },
                        }
                    ]}
                    data={tableData}
                />
            </Box>
        </React.Fragment>
    );
}

const OffersInfo = () => {
    const { id } = useParams<{ id: string }>();
    const [tableData, setTableData] = useState<Offer[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCRMData('api/get-offers-by-companyid', id);
                setTableData(response.data);
            } catch (error) {
                alert(error);
            }
        };
        fetchData();
    }, [id]);
    return (
        <React.Fragment>
            <Box sx={{ margin: 1, maxHeight: '400px', overflowY: 'auto' }}>
                <MaterialReactTable<Offer>
                    columns={[
                        {
                            header: 'Teklif Başlığı',
                            accessorKey: 'Name',
                        },
                        {
                            header: 'Teklif Kaynağı',
                            accessorKey: 'LeadSource.Label',
                        },
                        {
                            header: 'Ürün Grubu',
                            accessorKey: 'ProductGroupId.Name',                    
                        },
                        {
                            header: 'Ana Ürün',
                            accessorKey: 'MainProductId.Name',                    
                        },
                        {
                            header: 'Sözleşme Onay Durumu',
                            accessorKey: 'QuoteApprovalStatus.Label',                    
                        },
                        {
                            header: 'Oluşturma Tarihi',
                            accessorKey: 'CreatedOn',
                        },
                        // {
                        //     header: 'Sahibi',
                        //     accessorKey: 'OwnerId',
                        // },
                    ]}
                    data={tableData}
                    muiTableBodyCellEditTextFieldProps={{
                        variant: 'outlined',
                    }}
                />
            </Box>
        </React.Fragment>
    );
}

const QuoteDetailsInfo = () => {
    const { id } = useParams<{ id: string }>();
    const [tableData, setTableData] = useState<QuoteDetail[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCRMData('api/get-quote-details-by-companyid', id);
                setTableData(response.data);
            } catch (error) {
                alert(error);
            }
        };
        fetchData();
    }, [id]);
    return (
        <React.Fragment>
            <Box sx={{ margin: 1, maxHeight: '400px', overflowY: 'auto' }}>
                <MaterialReactTable<QuoteDetail>
                    columns={[
                        {
                            header: 'Ana Ürün',
                            accessorKey: 'ProductId.Name',
                        },
                        {
                            header: 'Ödeme Tipi',
                            accessorKey: 'SettlementType.Label',
                        },
                        {
                            header: 'Vade(Gün)',
                            accessorKey: 'OptionDay',                    
                        },
                        {
                            header: 'Birim Fiyatı',
                            accessorKey: 'PricePerUnit',                    
                        },
                        {
                            header: 'Miktar',
                            accessorKey: 'Quantity',                    
                        },
                        {
                            header: 'Oranı(%)',
                            accessorKey: 'Rate',                    
                        },
                        {
                            header: 'Toplam Tutar',
                            accessorKey: 'ExtendedAmount',                    
                        },
                        {
                            header: 'Oluşturma Tarihi',
                            accessorKey: 'CreatedOn',
                        },
                    ]}
                    data={tableData}
                    muiTableBodyCellEditTextFieldProps={{
                        variant: 'outlined',
                    }}
                />
            </Box>
        </React.Fragment>
    );
}

export const CompaniesSubDetail = () => {
    const { isAccount } = useAppContext()

    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx={{ mb: 1, borderRadius: 3 }}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography sx={{ width: '33%', flexShrink: 0, color: 'GrayText' }}>İlgili Kişiler</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <RegardingContactInfo />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} sx={{ mb: 1, borderRadius: 3 }}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography sx={{ width: '33%', flexShrink: 0, color: 'GrayText' }}>Adres Bilgileri</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <AddressInfo />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} sx={{ mb: 1, borderRadius: 3 }}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography sx={{ width: '33%', flexShrink: 0, color: 'GrayText' }}>Aktivite Bilgileri</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ActivitiesInfo />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')} sx={{ mb: 1, borderRadius: 3 }}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography sx={{ width: '33%', flexShrink: 0, color: 'GrayText' }}>Fırsat Bilgileri</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <OpportunitiesInfo />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')} sx={{ mb: 1, borderRadius: 3 }}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                >
                    <Typography sx={{ width: '33%', flexShrink: 0, color: 'GrayText' }}>İlgilenilen Ürün Bilgileri</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <InterestedProductInfo />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')} sx={{ mb: 1, borderRadius: 3 }}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                >
                    <Typography sx={{ width: '33%', flexShrink: 0, color: 'GrayText' }}>Teklif Bilgileri</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <OffersInfo />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel7'} onChange={handleChange('panel7')} sx={{ mb: 1, borderRadius: 3 }}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                >
                    <Typography sx={{ width: '33%', flexShrink: 0, color: 'GrayText' }}>Teklif Ürünü Bilgileri</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <QuoteDetailsInfo />
                </AccordionDetails>
            </Accordion>
        </>
    );
}