import { Add, CalendarMonth, Email, ExpandMore, Phone } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Button } from '@mui/material';
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
import { SalesOrderDetail } from '../../models/SalesOrder';
import { Lead } from '../../models/Lead';

const InterestedProductInfo = ({ data }: { data: Lead }) => {
    const { id } = useParams<{ id: string }>();
    const [tableData, setTableData] = useState<InterestedProduct[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCRMData(
                    "api/get-interestedproducts-by-leadid",
                    id
                );
                setTableData(response.data);
            } catch (error) {
                alert(error);
            }
        };
        fetchData();
    }, [id]);

    const handleCreateClick = () => {
        // Navigate to the create page with the lead ID as state
        navigate(`/interestedproducts/create/`, { 
            state: { leadId: id, leadidname:data.BrandName } 
        });
    };

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<Add />}
                    onClick={handleCreateClick}
                >
                    Yeni Ürün Ekle
                </Button>
            </Box>
            <Box sx={{ margin: 1, maxHeight: "400px", overflowY: "auto" }}>
                <MaterialReactTable<InterestedProduct>
                    columns={[
                        {
                            header: "Fırsat",
                            accessorKey: "OpportunityId.Name"
                        },
                        {
                            header: "Ürün Grubu",
                            accessorKey: "ProductGroupId.Name"
                        },
                        {
                            header: "Ana Ürün",
                            accessorKey: "MainProductId.Name"
                        },
                        {
                            header: "Ürün",
                            accessorKey: "ProductId.Name"
                        },
                        {
                            header: "Oluşturma Tarihi",
                            accessorKey: "CreatedOn"
                        }
                    ]}
                    data={tableData}
                />
            </Box>
        </React.Fragment>
    );
};


// Activity Info Component
const ActivityInfo = ({ data }: { data: Lead }) => {
    const { id } = useParams<{ id: string }>();
    const [tableData, setTableData] = useState<Activity[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCRMData(
                    "api/get-activities-by-leadid",
                    id
                );
                setTableData(response.data);
            } catch (error) {
                alert(error);
            }
        };
        fetchData();
    }, [id]);

    const handleCreateCall = () => {
        navigate(`/phones/create/`, { 
            state: { leadId: id, leadName: data.BrandName } 
        });
    };

    const handleCreateAppointment = () => {
        navigate(`/appointments/create/`, { 
            state: { leadId: id, leadName: data.BrandName } 
        });
    };

    const handleCreateEmail = () => {
        navigate(`/emails/create/`, { 
            state: { leadId: id, leadName: data.BrandName } 
        });
    };

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 1 }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<Phone />}
                    onClick={handleCreateCall}
                    size="small"
                >
                    Telefon Görüşmesi
                </Button>
                <Button 
                    variant="contained" 
                    color="secondary" 
                    startIcon={<CalendarMonth />}
                    onClick={handleCreateAppointment}
                    size="small"
                >
                    Randevu
                </Button>
                <Button 
                    variant="contained" 
                    color="info" 
                    startIcon={<Email />}
                    onClick={handleCreateEmail}
                    size="small"
                >
                    E-posta
                </Button>
            </Box>
            <Box sx={{ margin: 1, maxHeight: "400px", overflowY: "auto" }}>
                <MaterialReactTable<Activity>
                    columns={[
                        {
                            header: "Konu",
                            accessorKey: "Subject"
                        },
                        {
                            header: "Oluşturma Tarihi",
                            accessorKey: "CreatedOn"
                        },
                        {
                            header: "Etkinlik Türü",
                            accessorKey: "ActivityTypeCode",
                            Cell: ({ cell }) => {
                                const value = cell.getValue<string>();
                                const displayValue = {
                                    phonecall: "Telefon Görüşmesi",
                                    email: "E-posta",
                                    appointment: "Ziyaret"
                                }[value];
                                return displayValue || value;
                            }
                        },
                        {
                            header: "Etkinlik Durumu",
                            accessorKey: "StateCode",
                            Cell: ({ cell }) => {
                                const value = cell.getValue<number>();
                                const displayValue = {
                                    0: "Açık",
                                    1: "Tamamlandı",
                                    2: "İptal Edildi",
                                    3: "Zamanlanmış"
                                }[value];
                                return displayValue || value;
                            }
                        }
                    ]}
                    data={tableData}
                />
            </Box>
        </React.Fragment>
    );
};

export const LeadSubDetail = ({ data }: { data: Lead }) => {
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
                    <Typography sx={{ width: '33%', flexShrink: 0, color: 'GrayText' }}>Ürün Bilgileri</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <InterestedProductInfo data={data}/>
                </AccordionDetails>
            </Accordion>
            
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} sx={{ mb: 1, borderRadius: 3 }}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                >
                    <Typography sx={{ width: '33%', flexShrink: 0, color: 'GrayText' }}>Aktiviteler</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ActivityInfo data={data}/>
                </AccordionDetails>
            </Accordion>
        </>
    );
}