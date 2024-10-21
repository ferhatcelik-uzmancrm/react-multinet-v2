import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MaterialReactTable, { MaterialReactTableProps } from 'material-react-table';
import * as React from 'react';
import { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { BrandOptions } from '../../enums/Enums';

type Person = {
    firstName: string;
    lastName: string;
    address: string;
    state: string;
    phoneNumber: string;
};

type Invoice = {
    customercode: string;
    membershiptype: string;
    defaultaccountcode: string;
    companyname: string;
    invoicecity: string;
}

type Operation = {
    fleetcode: string,                  //Filo
    kddescription: string,              //Avis-Budget
    customergroupinfo: string,          //All
    udinvoicespecialstatus: string,     //Filo
    isudvip: string,                   //Filo
    udvipdescription: string,           //Filo
    isudhgsauto: string,               //Filo
    udsalesconsultant: string,          //Filo
    udlicense: string,                  //Filo
    isudautoinvoice: string,           //Filo
    kdsalesconsultant: string,          //Avis-Budget
    udpaymenttype: string,              //Filo
    udworktype: string,                 //Filo
    sector: string,                     //All

}

const initialData: Person[] = [
    {
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main St',
        state: 'California',
        phoneNumber: '555-1234',
    },
    {
        firstName: 'Jane',
        lastName: 'Smith',
        address: '456 Elm Ave',
        state: 'New York',
        phoneNumber: '555-5678',
    },
    {
        firstName: 'Michael',
        lastName: 'Johnson',
        address: '789 Oak Rd',
        state: 'Texas',
        phoneNumber: '555-9876',
    },
];

const invoiceInitData: Invoice[] = [
    {
        customercode: '001',
        membershiptype: 'Gold',
        defaultaccountcode: '120',
        companyname: 'ABC Inc.',
        invoicecity: 'Los Angeles',
    },
    {
        customercode: '002',
        membershiptype: 'Silver',
        defaultaccountcode: '320',
        companyname: 'XYZ Corp.',
        invoicecity: 'New York',
    },
    {
        customercode: '003',
        membershiptype: 'Bronze',
        defaultaccountcode: '120',
        companyname: '123 Industries',
        invoicecity: 'Dallas',
    },
];

const operationInitData: Operation[] = [
    {
        fleetcode: 'FLEET001',
        kddescription: 'Maintenance and Repairs',
        customergroupinfo: 'Corporate',
        udinvoicespecialstatus: 'Normal',
        isudvip: 'Evet',
        udvipdescription: 'VIP customer with special privileges',
        isudhgsauto: 'Hayır',
        udsalesconsultant: 'Alice Johnson',
        udlicense: 'ABC123',
        isudautoinvoice: 'Evet',
        kdsalesconsultant: 'Bob Smith',
        udpaymenttype: 'Credit Card',
        udworktype: 'General Maintenance',
        sector: 'Automotive',
    },
    {
        fleetcode: 'FLEET002',
        kddescription: 'Collision Repair',
        customergroupinfo: 'Individual',
        udinvoicespecialstatus: 'Urgent',
        isudvip: 'Hayır',
        udvipdescription: '',
        isudhgsauto: 'Evet',
        udsalesconsultant: 'David Miller',
        udlicense: 'XYZ789',
        isudautoinvoice: 'Hayır',
        kdsalesconsultant: 'Emily Davis',
        udpaymenttype: 'Insurance Claim',
        udworktype: 'Body Work',
        sector: 'Automotive',
    },
];

const InvoiceInfo = () => {
    const [tableData, setTableData] = useState<Invoice[]>(invoiceInitData);
    const handleSaveRow: MaterialReactTableProps<Invoice>['onEditingRowSave'] = ({ row, values }) => {
        const updatedData = [...tableData];
        updatedData[row.index] = values;
        setTableData(updatedData);
    };

    return (
        <React.Fragment>
            <Box sx={{ margin: 1, maxHeight: '400px', overflowY: 'auto' }}>
                <MaterialReactTable<Invoice>
                    columns={[
                        {
                            header: 'Müşteri Kodu',
                            accessorKey: 'customercode',
                        },
                        {
                            header: 'Üyelik Tipi',
                            accessorKey: 'membershiptype',
                            editVariant: 'select',
                            editSelectOptions: [
                                'Hiçbiri', 'Koç Topluluğu(Tüzel)', 'RAC Firma', 'Firmamız Personeli', 'Kamu', 'Koç Ailem(Gerçek)'
                            ],
                        },
                        {
                            header: 'Varsayılan Hesap Kodu',
                            accessorKey: 'defaultaccountcode',
                            editVariant: 'select',
                            editSelectOptions: [
                                '120', '320'
                            ],
                        },
                        {
                            header: 'Firma Unvanı',
                            accessorKey: 'companyname',
                        },
                        {
                            header: 'Fatura İl',
                            accessorKey: 'invoicecity',
                            editVariant: 'select',
                            editSelectOptions: [
                                'İstanbul', 'Ankara', 'İzmir'
                            ],
                        },
                    ]}
                    data={tableData}
                    enableRowActions
                    enableEditing
                    editingMode="row"
                    muiTableBodyCellEditTextFieldProps={{
                        variant: 'outlined',
                    }}
                    onEditingRowSave={handleSaveRow}
                />
            </Box>
        </React.Fragment>
    );
}

const SystemInfo = () => {
    const [tableData, setTableData] = useState<Person[]>(initialData);
    const handleSaveRow: MaterialReactTableProps<Person>['onEditingRowSave'] = ({ row, values }) => {
        const updatedData = [...tableData];
        updatedData[row.index] = values;
        setTableData(updatedData);
    };

    return (
        <React.Fragment>
            <Box sx={{ margin: 1, maxHeight: '400px', overflowY: 'auto' }}>
                <MaterialReactTable<Person>
                    columns={[
                        {
                            header: 'First Name',
                            accessorKey: 'firstName',
                        },
                        {
                            header: 'Last Name',
                            accessorKey: 'lastName',
                        },
                        {
                            header: 'Address',
                            accessorKey: 'address',
                        },
                        {
                            header: 'State',
                            accessorKey: 'state',
                            editVariant: 'select',
                            editSelectOptions: [
                                // Options for select input
                            ],
                        },
                        {
                            header: 'Phone Number',
                            accessorKey: 'phoneNumber',
                        }
                    ]}
                    data={tableData}
                    enableRowActions
                    enableEditing
                    editingMode="row"
                    muiTableBodyCellEditTextFieldProps={{
                        variant: 'outlined',
                    }}
                    onEditingRowSave={handleSaveRow}
                />
            </Box>
        </React.Fragment>
    );
}

const OperationInfo = () => {
    const { selectedBrand } = useAppContext();

    const [tableData, setTableData] = useState<Operation[]>(operationInitData);
    const handleSaveRow: MaterialReactTableProps<Operation>['onEditingRowSave'] = ({ row, values }) => {
        const updatedData = [...tableData];
        updatedData[row.index] = values;
        setTableData(updatedData);
        console.log(updatedData[row.index])
        alert(JSON.stringify(updatedData[row.index]))
    };

    return (
        <React.Fragment>
            <Box sx={{ margin: 1, maxHeight: '400px', overflowY: 'auto' }}>
                {selectedBrand === BrandOptions.Filo &&
                    <MaterialReactTable<Operation>
                        columns={[
                            {
                                header: 'Filo Kodu',
                                accessorKey: 'fleetcode',
                                editVariant: 'select',
                                editSelectOptions: [
                                    '1', '2', '3', '4', '5'
                                ],
                            },
                            {
                                header: 'Müşteri Grup Bilgisi',
                                accessorKey: 'customergroupinfo',
                                editVariant: 'select',
                                editSelectOptions: [
                                    'Corporate', 'Individual'
                                ],
                            },
                            {
                                header: 'UD Fatura Özel Durum',
                                accessorKey: 'udinvoicespecialstatus',
                            },
                            {
                                header: 'UD VIP mi?',
                                accessorKey: 'isudvip',
                                editVariant: 'select',
                                editSelectOptions: ['Evet', 'Hayır'],
                            },
                            {
                                header: 'UD VIP Açıklama',
                                accessorKey: 'udvipdescription',
                            },
                            {
                                header: 'UD HGS Otomatik mi?',
                                accessorKey: 'isudhgsauto',
                                editVariant: 'select',
                                editSelectOptions: ['Evet', 'Hayır'],
                            },
                            {
                                header: 'Uzun Dönem Satış Danışmanı',
                                accessorKey: 'udsalesconsultant',
                                editVariant: 'select',
                                editSelectOptions: [
                                    '1', '2', '3', '4', '5'
                                ],
                            },
                            {
                                header: 'UD Lisans',
                                accessorKey: 'udlicense',
                                editVariant: 'select',
                                editSelectOptions: [
                                    '1', '2', '3', '4', '5'
                                ],
                            },
                            {
                                header: 'UD Otomatik Fatura mı?',
                                accessorKey: 'isudautoinvoice',
                                editVariant: 'select',
                                editSelectOptions: ['Evet', 'Hayır'],
                            },
                            {
                                header: 'UD Ödeme Türü',
                                accessorKey: 'udpaymenttype',
                                editVariant: 'select',
                                editSelectOptions: [
                                    '1', '2', '3', '4', '5'
                                ],
                            },
                            {
                                header: 'UD Çalışma Şekli',
                                accessorKey: 'udworktype',
                                editVariant: 'select',
                                editSelectOptions: [
                                    '1', '2', '3', '4', '5'
                                ],
                            },
                            {
                                header: 'Sektör',
                                accessorKey: 'sector',
                                editVariant: 'select',
                                editSelectOptions: [
                                    '1', '2', '3', '4', '5'
                                ],
                            },
                        ]}
                        data={tableData}
                        enableRowActions
                        enableEditing
                        editingMode="row"
                        muiTableBodyCellEditTextFieldProps={{
                            variant: 'outlined',
                        }}
                        onEditingRowSave={handleSaveRow}
                    />
                }
                {selectedBrand !== BrandOptions.Filo &&
                    <MaterialReactTable<Operation>
                        columns={[
                            {
                                header: 'KD Açıklama',
                                accessorKey: 'kddescription',
                            },
                            {
                                header: 'Müşteri Grup Bilgisi',
                                accessorKey: 'customergroupinfo',
                                editVariant: 'select',
                                editSelectOptions: [
                                    'Corporate', 'Individual'
                                ],
                            },
                            {
                                header: 'Kısa Dönem Satış Danışmanı',
                                accessorKey: 'kdsalesconsultant',
                                editVariant: 'select',
                                editSelectOptions: [
                                    '1', '2', '3', '4', '5'
                                ],
                            },
                            {
                                header: 'Sektör',
                                accessorKey: 'sector',
                                editVariant: 'select',
                                editSelectOptions: [
                                    '1', '2', '3', '4', '5'
                                ],
                            },
                        ]}
                        data={tableData}
                        enableRowActions
                        enableEditing
                        editingMode="row"
                        muiTableBodyCellEditTextFieldProps={{
                            variant: 'outlined',
                        }}
                        onEditingRowSave={handleSaveRow}
                    />
                }
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
                    <Typography sx={{ width: '33%', flexShrink: 0, color: 'GrayText' }}>Telefon Bilgileri</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <InvoiceInfo />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} sx={{ mb: 1, borderRadius: 3 }}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography sx={{ width: '33%', flexShrink: 0, color: 'GrayText' }}>Email Bilgileri</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <InvoiceInfo />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} sx={{ mb: 1, borderRadius: 3 }}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography sx={{ width: '33%', flexShrink: 0, color: 'GrayText' }}>Ziyaret Bilgileri</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <InvoiceInfo />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')} sx={{ mb: 1, borderRadius: 3 }}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography sx={{ width: '33%', flexShrink: 0, color: 'GrayText' }}>Fatura Bilgileri</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <InvoiceInfo />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')} sx={{ mb: 1, borderRadius: 3 }}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                >
                    <Typography sx={{ width: '33%', flexShrink: 0, color: 'GrayText' }}>Sistem Bilgileri</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <SystemInfo />
                </AccordionDetails>
            </Accordion>

            {isAccount && (
                <>
                    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx={{ mb: 1, borderRadius: 3 }}>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel3bh-content"
                            id="panel3bh-header"
                        >
                            <Typography sx={{ width: '33%', flexShrink: 0, color: 'GrayText' }}>Operasyonel Müşteri Bilgileri</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <OperationInfo />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} sx={{ mb: 1, borderRadius: 3 }}>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel4bh-content"
                            id="panel4bh-header"
                        >
                            <Typography sx={{ width: '33%', flexShrink: 0, color: 'GrayText' }}>İlgili Kişi Bilgileri</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} sx={{ mb: 1, borderRadius: 3 }}>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel5bh-content"
                            id="panel5bh-header"
                        >
                            <Typography sx={{ width: '33%', flexShrink: 0, color: 'GrayText' }}>Ziyaret Bilgileri</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')} sx={{ mb: 1, borderRadius: 3 }}>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel6bh-content"
                            id="panel6bh-header"
                        >
                            <Typography sx={{ width: '33%', flexShrink: 0, color: 'GrayText' }}>Fırsat Bilgileri</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')} sx={{ mb: 1, borderRadius: 3 }}>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel7bh-content"
                            id="panel7bh-header"
                        >
                            <Typography sx={{ width: '33%', flexShrink: 0, color: 'GrayText' }}>Teklif Bilgileri</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')} sx={{ borderRadius: 2 }}>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel8bh-content"
                            id="panel8bh-header"
                        >
                            <Typography sx={{ width: '33%', flexShrink: 0, color: 'GrayText' }}>Görev Bilgileri</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        </AccordionDetails>
                    </Accordion>
                </>
            )
            }
        </>
    );
}