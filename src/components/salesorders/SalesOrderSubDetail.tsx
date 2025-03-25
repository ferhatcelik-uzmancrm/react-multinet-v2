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
import { SalesOrderDetail } from '../../models/SalesOrder';

const InterestedProductInfo = ({ salesdata }: { salesdata: SalesOrderDetail[] }) => {
    const { id } = useParams<{ id: string }>();
    const [tableData, setTableData] = useState<SalesOrderDetail[]>([]);

    useEffect(() => {
        setTableData(salesdata);
    }, [salesdata]);

    return (
        <React.Fragment>
            <Box sx={{ margin: 1, maxHeight: '400px', overflowY: 'auto' }}>
                <MaterialReactTable<SalesOrderDetail>
                    columns={[
                        {
                            header: 'Müşteri',
                            accessorKey: 'CustomerId.Name',
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
                            header: 'Ürün',
                            accessorKey: 'ProductId.Name',
                        },
                        {
                            header: 'Birim',
                            accessorKey: 'UomId.Name',
                        },
                        {
                            header: 'Kullanım Tipi',
                            accessorKey: 'UsageTypeCode.Value',
                        },
                        {
                            header: 'Dış Kaynak Kullanımı',
                            accessorKey: 'OutSourcing',
                            Cell: ({ cell }) => (cell.getValue() ? 'Evet' : 'Hayır'),
                        },
                        {
                            header: 'Bayrak Durumu',
                            accessorKey: 'IsFlag',
                            Cell: ({ cell }) => (cell.getValue() ? 'Aktif' : 'Pasif'),
                        },
                        {
                            header: 'Açıklama',
                            accessorKey: 'Description',
                        },
                    ]}
                    data={tableData}
                />
            </Box>
        </React.Fragment>
    );
};


export const SalesOrderSubDetail = ({ data }: { data: SalesOrderDetail[] }) => {

    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx={{ mb: 1, borderRadius: 3 }}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                >
                    <Typography sx={{ width: '33%', flexShrink: 0, color: 'GrayText' }}>Sözleşme Ürün Bilgileri</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <InterestedProductInfo salesdata={data}/>
                </AccordionDetails>
            </Accordion>
        </>
    );
}