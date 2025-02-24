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
import { fakeCompanyData } from "../../fake/fakeCompanyData";
import { handleExport } from "../../helper/Export";
import { Offer, OfferRequest } from "../../models/Offers";
import { fetchUserData, getCRMData } from "../../requests/ApiCall";
import Pagination from '../../helper/Pagination';

type Order = "asc" | "desc";

const rows = fakeCompanyData

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

export default function SalesOrderDetail() {
    return (
        <React.Fragment >
            
        </React.Fragment>
    );
}