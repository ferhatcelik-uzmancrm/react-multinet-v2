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
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { BrandColors, BrandOptions } from "../../enums/Enums";
import { fakeCompanyData } from "../../fake/fakeCompanyData";
import { handleExport } from "../../helper/Export";
import { Phone, PhoneRequest } from "../../models/Phone";
import { fetchUserData, getCRMData } from "../../requests/ApiCall";

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

export default function PhonesTable() {

  const { selectedBrand, updateIsAccount } = useAppContext()  //Get selected brand

  const navigate = useNavigate();

  const handleArchiveClick = (companyId: string, companyType: string) => {
    if (companyType === 'Account')
      updateIsAccount(true);
    else
      updateIsAccount(false);
    // const matchedData = rows.filter(row => row.id === companyId);
    navigate(`/phones/detail/${companyId}`);
    /*, { state: { data: matchedData } });*/
  };
  const createClick = () => {
    navigate(`/phones/create/`);
  };

  const [order, setOrder] = useState<Order>("desc");
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [phones, setPhones] = useState<Phone[] | null>([]);
  const [loading, setLoading] = useState(false)

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
    console.log(searchQuery);
  };

  const phoneRequest = useMemo(() => ({
    UserId: localStorage.getItem("userid")?.toString() || "",
    CrmUserId: localStorage.getItem("crmuserid")?.toString() || "",
    UserCityId: localStorage.getItem("crmusercityid")?.toString() || "",
    Name: ""
  }), []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCRMData('api/get-phones', phoneRequest);
        setPhones(response.data);
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, [phoneRequest]);

  const handleApiSearch = async () => {
    try {
      setLoading(true)
      if (searchQuery !== null && searchQuery !== "") {
        console.log("Search query: ", searchQuery);
        setPhones([]);

        // Determine whether the searchQuery is a company name or tax number: if digit use taxnumber otherwise use name
        // const isTaxNumber = /^\d+$/.test(searchQuery);

        const searchParams: PhoneRequest = {
          ...phoneRequest,
          Name: searchQuery
        };

        const response = await getCRMData('api/search-leads', searchParams);
        setPhones(response.data);
      } else {
        const response = await fetchUserData('api/get-company', '');
        setPhones(response.data);
      }
    } catch (error) {
      alert(error);
    }
    finally {
      setLoading(false)
    }
  };

  const filteredRows = phones !== null && Array.isArray(phones)
    ? phones.filter((row) =>
      (row.Subject?.toString().includes(searchQuery)) ||
      row.PhoneNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

  const renderFilters = () => (
    <React.Fragment>
      <FormControl size="sm">
        <FormLabel>Durum</FormLabel>
        <Select
          size="md"
          placeholder="Filter by status"
          slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
        >
          <Option value="paid">Paid</Option>
          <Option value="pending">Pending</Option>
          <Option value="refunded">Refunded</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>
      </FormControl>

      <FormControl size="sm">
        <FormLabel>Kategori</FormLabel>
        <Select size="md" placeholder="All">
          <Option value="all">All</Option>
        </Select>
      </FormControl>

      <FormControl size="sm">
        <FormLabel>Müşteri</FormLabel>
        <Select size="md" placeholder="All">
          <Option value="all">All</Option>
        </Select>
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
            <Typography id="filter-modal" level="h2">
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {renderFilters()}
              <Button color="primary" onClick={() => setOpen(false)}>
                Submit
              </Button>
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
          <FormLabel>Telefon görüşmesi ara</FormLabel>
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
        <FormControl sx={{ flex: 0 }} size="sm">
          <FormLabel>Telefon görüşmesi oluştur</FormLabel>
          <MaterialButton
            variant="contained"
            sx={{
              border: "none",
              textTransform: "capitalize",
              color: "white",
              backgroundColor: "#211d3c",
              fontSize: "16px",
              "&:hover": {
                backgroundColor: "#f7a724",
              },
            }}
            disabled={loading}
            onClick={createClick}
          >
            Yeni Telefon
          </MaterialButton>
        </FormControl>

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
                    selected.length > 0 && selected.length !== rows.length
                  }
                  checked={selected.length === rows.length}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? rows.map((row) => row.id) : []
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === rows.length
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
                  Konu
                </Link>
              </th>
              <th style={{ width: 220, padding: 12 }}>Arayan Kişi</th>
              <th style={{ width: 220, padding: 12 }}>Arama Hedefi</th>
              <th style={{ width: 220, padding: 12 }}>İlgili Kişi</th>
              <th style={{ width: 120, padding: 12 }}>Telefon Numarası</th>
              <th style={{ width: 120, padding: 12 }}> </th>
            </tr>
          </thead>
          <tbody>
            {phones !== null && Array.isArray(phones) ? (
              stableSort(filteredRows, getComparator(order, "PhoneId")).map((row) => (
                <tr key={row.PhoneId}>
                  <td style={{ textAlign: "center" }}>
                    <Checkbox
                      checked={selected.includes(row.PhoneId)}
                      color={selected.includes(row.PhoneId) ? "primary" : undefined}
                      onChange={(event) => {
                        setSelected((ids) =>
                          event.target.checked
                            ? ids.concat(row.PhoneId)
                            : ids.filter((itemId) => itemId !== row.PhoneId)
                        );
                      }}
                      slotProps={{ checkbox: { sx: { textAlign: "left" } } }}
                      sx={{ verticalAlign: "text-bottom" }}
                    />
                  </td>
                  <td>
                    {row.Subject}
                  </td>
                  <td>{row.From?.Name}</td>
                  <td>{row.To?.Name}</td>
                  <td>{row.RegardingObjectId?.Name}</td>
                  <td>{row.PhoneNumber}</td>
                  <td style={{ textAlign: "right" }}>
                    <Link
                      fontWeight="lg"
                      component="button"
                      color="neutral"
                      onClick={() => handleArchiveClick(row.PhoneId, row.PhoneNumber)}
                    >
                      <EditNoteTwoTone sx={{ color: selectedBrand === BrandOptions.Budget ? BrandColors.BudgetDark : BrandColors.AvisDark }} />
                    </Link>
                    <Link
                      fontWeight="lg"
                      component="button"
                      color="primary"
                      sx={{ ml: 2 }}
                      onClick={() => handleExport([row], row.PhoneNumber, "xlsx")}
                    >
                      <BrowserUpdatedTwoTone />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: "center" }}>
                  {phones === null ? "Loading..." : "No matching contacts found."}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Sheet>
      <Box
        className="Pagination-mobile"
        sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}
      >
        <IconButton
          aria-label="previous page"
          variant="outlined"
          color="neutral"
          size="sm"
        >
          <i data-feather="arrow-left" />
        </IconButton>
        <Typography level="body-sm" mx="auto">
          Page 1 of 10
        </Typography>
        <IconButton
          aria-label="next page"
          variant="outlined"
          color="neutral"
          size="sm"
        >
          <i data-feather="arrow-right" />
        </IconButton>
      </Box>
      <Box
        className="Pagination-laptopUp"
        sx={{
          pt: 4,
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: "50%" },
          display: {
            xs: "none",
            md: "flex",
          },
        }}
      >
        <Button
          size="sm"
          variant="plain"
          color="neutral"
          startDecorator={<i data-feather="arrow-left" />}
        >
          Önceki
        </Button>

        <Box sx={{ flex: 1 }} />
        {["1", "2", "3", "…", "8", "9", "10"].map((page) => (
          <IconButton
            key={page}
            size="sm"
            variant={Number(page) ? "outlined" : "plain"}
            color="neutral"
          >
            {page}
          </IconButton>
        ))}
        <Box sx={{ flex: 1 }} />

        <Button
          size="sm"
          variant="plain"
          color="neutral"
          endDecorator={<i data-feather="arrow-right" />}
        >
          Sonraki
        </Button>
      </Box>
    </React.Fragment>
  );
}
