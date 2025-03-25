/* eslint-disable jsx-a11y/anchor-is-valid */
import { BrowserUpdatedTwoTone, EditNoteTwoTone, TravelExploreTwoTone } from '@mui/icons-material/';
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
import { useMediaQuery, useTheme } from "@mui/material";
import MaterialButton from "@mui/material/Button";
import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { BrandColors, BrandOptions } from "../../enums/Enums";
import { handleExport } from "../../helper/Export";
import { fetchUserData, getCRMData } from "../../requests/ApiCall";
import Pagination from '../../helper/Pagination';
import { BranchInformation } from '../../models/BranchInformation';
import { OfferRequest } from '../../models/Offers';

type Order = "asc" | "desc";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string }
) => number {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
    array: readonly T[],
    comparator: (a: T, b: T) => number
) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export default function BranchInformationTable() {

    const { selectedBrand } = useAppContext()  //Get selected brand

    const navigate = useNavigate();

    const handleArchiveClick = (companyId: string) => {
        navigate(`/branchinformation/detail/${companyId}`);
    };
    

    const [order, setOrder] = useState<Order>("desc");
    const [selected, setSelected] = useState<readonly string[]>([]);
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [branchInformation, setBranchInformation] = useState<BranchInformation[] | null>([]);
    const [loading, setLoading] = useState(false)
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [paginatedData, setPaginatedData] = useState<BranchInformation[] | null>([]);
    const [itemsPerPage] = useState<number>(10);
    const totalPages = branchInformation ? Math.ceil(branchInformation.length / itemsPerPage) : 0;

    const handleSearchInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const branchInformationRequest = React.useMemo(() => ({
        UserId: sessionStorage.getItem("userid")?.toString() || "",
        CrmUserId: sessionStorage.getItem("crmuserid")?.toString() || "",
        UserCityId: sessionStorage.getItem("crmusercityid")?.toString() || "",
        Name: ""
    }), []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCRMData('api/get-branchinformationlist', branchInformationRequest);
                setBranchInformation(response.data);
            } catch (error) {
                alert(error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const currentData = branchInformation?.slice(startIndex, startIndex + itemsPerPage) || [];
        setPaginatedData(currentData);
    }, [currentPage, branchInformation, itemsPerPage]);

    const handleApiSearch = async () => {
        try {
            setLoading(true)
            if (searchQuery !== null && searchQuery !== "") {
                console.log("Search query: ", searchQuery);
                setBranchInformation([]);

                const searchParams = {
                    ...branchInformationRequest,
                    Name: searchQuery
                };

                const response = await getCRMData('api/search-salesorder', searchParams);
                setBranchInformation(response.data);
            } else {
                const response = await fetchUserData('api/get-salesorder', '');
                setBranchInformation(response.data);
            }
        } catch (error) {
            alert(error);
        }
        finally {
            setLoading(false)
        }
    };

    const filteredRows = branchInformation !== null && Array.isArray(branchInformation)
        ? branchInformation.filter((row) =>
            (row.BranchName?.toString().includes(searchQuery)) ||
            (row.AccountNumber?.toString().includes(searchQuery)) ||
            (row.ReferenceBranchCode?.toString().includes(searchQuery)) ||
            (row.BranchId?.toString().includes(searchQuery)) 
        ) : [];

    // 2. Arama sonuçlarını sayfalara böl
    const paginatedRows = filteredRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const renderFilters = () => (
        <React.Fragment>
            <FormControl sx={{ flex: 0 }} size="sm">
            </FormControl>
        </React.Fragment>
    );

    return (
        <React.Fragment >
            <Sheet
                className="SearchAndFilters-mobile"
                sx={{
                    display: {
                        xs: "flex",
                        sm: "none",
                    },
                    my: 1,
                    gap: 1,
                }}
            >
                <Input
                    size="md"
                    placeholder="Ara"
                    startDecorator={<i data-feather="search" />}
                    endDecorator={
                        <TravelExploreTwoTone
                            onClick={handleApiSearch}
                            sx={{
                                "&:hover": {
                                    color: "primary.main",
                                    cursor: "pointer",
                                },
                                "&:active": {
                                    color: "primary.dark",
                                },
                            }}
                        />
                    }
                    sx={{ flexGrow: 1 }}
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                />
                <IconButton
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    onClick={() => setOpen(true)}
                >
                    <i data-feather="filter" />
                </IconButton>
                <Modal open={open} onClose={() => setOpen(false)}>
                    <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
                        <ModalClose />

                        <Divider sx={{ my: 3 }} />
                        <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {renderFilters()}

                        </Sheet>
                    </ModalDialog>
                </Modal>
            </Sheet>
            <Box
                className="SearchAndFilters-tabletUp"
                sx={{
                    borderRadius: "sm",
                    py: 2,
                    display: {
                        xs: "none",
                        sm: "flex",
                    },
                    flexWrap: "wrap",
                    gap: 1.5,
                    "& > *": {
                        minWidth: {
                            xs: "120px",
                            md: "160px",
                        },
                    },
                }}
            >
                <FormControl sx={{ flex: 1 }} size="sm">
                    <FormLabel>Şube ara</FormLabel>
                    <Input
                        size="md"
                        placeholder="Ara"
                        startDecorator={<i data-feather="search" />}
                        endDecorator={
                            loading ?
                                (<CircularProgress color="danger" sx={{ '--CircularProgress-size': '30px' }} thickness={1}>
                                    <TravelExploreTwoTone
                                        onClick={handleApiSearch}
                                        sx={{
                                            "&:hover": {
                                                color: "primary.main",
                                                cursor: "pointer",
                                            },
                                            "&:active": {
                                                color: "primary.dark",
                                            },
                                        }}
                                    />
                                </CircularProgress>) : (<TravelExploreTwoTone
                                    onClick={handleApiSearch}
                                    sx={{
                                        "&:hover": {
                                            color: "primary.main",
                                            cursor: "pointer",
                                        },
                                        "&:active": {
                                            color: "primary.dark",
                                        },
                                    }}
                                />)
                        }
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                    />
                </FormControl>

                {renderFilters()}


            </Box>
            <Sheet
                className="OrderTableContainer"
                variant="outlined"
                sx={{
                    width: "100%",
                    maxHeight: "400px",
                    borderRadius: "md",
                    flex: 1,
                    overflow: isMobile ? "auto" : "hidden",
                    "&:hover": {
                        overflowX: isMobile ? "hidden" : "auto",
                        overflowY: isMobile ? "hidden" : "auto",
                        scrollbarWidth: "thin",
                        border: "1px solid #ddd",
                        "&::-webkit-scrollbar": {
                            width: "8px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            background: "#888",
                            borderRadius: "5px",
                        },
                        "&::-webkit-scrollbar-thumb:hover": {
                            background: "#555",
                        },
                        "&::-webkit-scrollbar-track": {
                            background: "#f1f1f1",
                            borderRadius: "5px",
                        },
                    },
                }}
            >
                <Table
                    aria-labelledby="tableTitle"
                    stickyHeader
                    hoverRow
                    sx={{
                        "--TableCell-headBackground": (theme) =>
                            theme.vars.palette.background.level1,
                        "--Table-headerUnderlineThickness": "1px",
                        "--TableRow-hoverBackground": (theme) =>
                            theme.vars.palette.background.level1,
                        "--TableCell-paddingY": "12px",
                    }}
                >
                    <thead>
                        <tr>
                            <th style={{ width: 48, textAlign: "center", padding: 12 }}>
                                <Checkbox
                                    indeterminate={
                                        selected.length > 0 && selected.length !== paginatedRows.length
                                    }
                                    checked={selected.length === paginatedRows.length}
                                    onChange={(event) => {
                                        setSelected(
                                            event.target.checked ? paginatedRows.map((row) => row.BranchInformationId) : []
                                        );
                                    }}
                                    color={
                                        selected.length > 0 || selected.length === paginatedRows.length
                                            ? "primary"
                                            : undefined
                                    }
                                    sx={{ verticalAlign: "text-bottom" }}
                                />
                            </th>
                            <th style={{ width: 220, padding: 12 }}>
                                <Link
                                    underline="none"
                                    color="neutral"
                                    component="button"
                                    onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                                    fontWeight="lg"
                                    endDecorator={<i data-feather="arrow-down" />}
                                    sx={{
                                        "& svg": {
                                            transition: "0.2s",
                                            transform:
                                                order === "desc" ? "rotate(0deg)" : "rotate(180deg)",
                                        },
                                    }}
                                >
                                    Ad
                                </Link>
                            </th>
                            <th style={{ width: 220, padding: 12 }}>Firma Numarası</th>
                            <th style={{ width: 220, padding: 12 }}>Şube No</th>
                            <th style={{ width: 220, padding: 12 }}>Şube</th>
                            <th style={{ width: 220, padding: 12 }}>ERP Kodu</th>
                            <th style={{ width: 220, padding: 12 }}>Şube Tipi</th>
                            <th style={{ width: 120, padding: 12 }}> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedRows !== null && Array.isArray(paginatedRows) ? (
                            stableSort(paginatedRows, getComparator(order, "BranchInformationId")).map((row) => (
                                <tr key={row.BranchInformationId}>
                                    <td style={{ textAlign: "center" }}>
                                        <Checkbox
                                            checked={selected.includes(row.BranchInformationId)}
                                            color={selected.includes(row.BranchInformationId) ? "primary" : undefined}
                                            onChange={(event) => {
                                                setSelected((ids) =>
                                                    event.target.checked
                                                        ? ids.concat(row.BranchInformationId)
                                                        : ids.filter((itemId) => itemId !== row.BranchInformationId)
                                                );
                                            }}
                                            slotProps={{ checkbox: { sx: { textAlign: "left" } } }}
                                            sx={{ verticalAlign: "text-bottom" }}
                                        />
                                    </td>
                                    <td>
                                        {row.BranchName}
                                    </td>
                                    <td>{row.AccountNumber}</td>
                                    <td>{row.BranchId}</td>
                                    <td>{row.AccountId?.Name}</td>
                                    <td>{row.ErpCode?.Name}</td>
                                    <td>{row.BranchType?.Label}</td>
                                    <td style={{ textAlign: "right" }}>
                                        <Link
                                            fontWeight="lg"
                                            component="button"
                                            color="neutral"
                                            onClick={() => handleArchiveClick(row.BranchInformationId)}
                                        >
                                            <EditNoteTwoTone sx={{ color: selectedBrand === BrandOptions.Budget ? BrandColors.BudgetDark : BrandColors.AvisDark }} />
                                        </Link>
                                        <Link
                                            fontWeight="lg"
                                            component="button"
                                            color="primary"
                                            sx={{ ml: 2 }}
                                            onClick={() => handleExport([row], row.BranchName, "xlsx")}
                                        >
                                            <BrowserUpdatedTwoTone />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} style={{ textAlign: "center" }}>
                                    {branchInformation === null ? "Loading..." : "No matching contacts found."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Sheet>
            {/* Sayfalama */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </React.Fragment>
    );
}
