import AddTaskTwoToneIcon from "@mui/icons-material/AddTaskTwoTone";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Modal, ModalDialog, Stack, Typography as TypographyJoy } from "@mui/joy";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { BrandColors, BrandOptions } from "../../enums/Enums";

function createData(subject: string, owner: string, priority: number) {
  return {
    subject,
    owner,
    priority,
    task: [
      {
        date: "2020-01-05",
        customerId: "11091700",
        amount: 3,
      },
      {
        date: "2020-01-02",
        customerId: "Anonymous",
        amount: 1,
      },
    ],
  };
}

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.subject}
        </TableCell>
        <TableCell align="right">{row.owner}</TableCell>
        <TableCell align="right">{row.priority}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography
                        sx={{ fontFamily: "Segoe UI", fontWeight: "bold" }}
                      >
                        Durum
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{ fontFamily: "Segoe UI", fontWeight: "bold" }}
                      >
                        Planlanan Tarih
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{ fontFamily: "Segoe UI", fontWeight: "bold" }}
                      >
                        Gerçekleşen Tarih
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        sx={{ fontFamily: "Segoe UI", fontWeight: "bold" }}
                      >
                        Planlama Notu
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        sx={{ fontFamily: "Segoe UI", fontWeight: "bold" }}
                      >
                        Gerçekleşme Notu
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        sx={{ fontFamily: "Segoe UI", fontWeight: "bold" }}
                      >
                        Sonuç Not
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.task.map((taskRow) => (
                    <TableRow key={taskRow.date}>
                      <TableCell>{taskRow.customerId}</TableCell>
                      <TableCell component="th" scope="row">
                        {taskRow.date}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {taskRow.date}
                      </TableCell>
                      <TableCell align="right">{taskRow.amount}</TableCell>
                      <TableCell align="right">{taskRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(taskRow.amount * row.priority * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const taskUser = localStorage.getItem("username");

const rows = [
  createData("McLaren", taskUser || "", 1),
  createData("March", "Niki Lauda", 1),
  createData("Ferrari", "Michael Schumacher", 1),
  createData("Aston Martin", "Fernando Alonso", 3),
  createData("Mercedes", "Lewis Hamilton", 2),
  createData("Red Bull Racing", "Max Verstappen", 4),
];

export const Tasks = () => {
  const { selectedBrand } = useAppContext(); //Get selected brand
  const [open, setOpen] = useState<boolean>(false);

  // const dummy = ["Hello", "Привет", "Hallo", "Bonjour", "Merhaba", "مرحبًا", "Hola"]

  // useEffect(() => {
  //   updateTaskData(dummy)
  // }, [])

  const today: Date = new Date();

  const year: number = today.getFullYear();
  const month: number = today.getMonth() + 1; // Months are 0-based, so we add 1
  const day: number = today.getDate();

  console.log(`Today's date is: ${year}-${month}-${day}`);

  return (
    <>
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Button>
                  <AddTaskTwoToneIcon
                    onClick={() => setOpen(true)}
                    sx={{
                      color:
                        selectedBrand === BrandOptions.Budget
                          ? BrandColors.Budget
                          : BrandColors.Avis,
                    }}
                  />
                </Button>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontFamily: "Segoe UI", fontWeight: "bold" }}>
                  Konu
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography sx={{ fontFamily: "Segoe UI", fontWeight: "bold" }}>
                  Görev Sahibi
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography sx={{ fontFamily: "Segoe UI", fontWeight: "bold" }}>
                  Öncelik Durumu
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={row.subject} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MODAL */}
      <React.Fragment>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog
            aria-labelledby="basic-modal-dialog-title"
            aria-describedby="basic-modal-dialog-description"
            sx={{ maxWidth: 1200, maxHeight: 1000 }}
          >
            <TypographyJoy id="basic-modal-dialog-title" level="h2">
              Yeni görev oluştur
            </TypographyJoy>
            <TypographyJoy id="basic-modal-dialog-description">
              Lütfen ilgili alanları doldurunuz.
            </TypographyJoy>
            <form
              onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                setOpen(false);
              }}
            >
              <React.Fragment>
                <Stack>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6} sx={{ mb: 2 }}>
                      <TextField
                        required
                        id="cardName"
                        label="Konu"
                        fullWidth
                        autoComplete="cc-name"
                        variant="standard"
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ mb: 2 }}>
                      <FormControl fullWidth>
                        <InputLabel id="cardNumber-label">
                          Öncelik Durumu
                        </InputLabel>
                        <Select
                          labelId="cardNumber-label"
                          id="cardNumber"
                          label="Öncelik Durumu"
                          fullWidth
                          autoComplete="cc-number"
                          variant="standard"
                        >
                          <MenuItem value="low">Soğuk</MenuItem>
                          <MenuItem value="medium">Orta</MenuItem>
                          <MenuItem value="high">Sıcak</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ mb: 2 }}>
                      <TextField
                        disabled
                        required
                        id="expDate"
                        label="Görev Atanan Kişi"
                        fullWidth
                        autoComplete="cc-exp"
                        variant="standard"
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ mb: 2 }}>
                      <TextField
                        required
                        id="planDate"
                        label="Planlanan Tarih"
                        type="date"
                        fullWidth
                        autoComplete="cc-csc"
                        variant="standard"
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ mb: 2 }}>
                      <FormControl fullWidth>
                        <InputLabel id="cardNumber-label">
                          Görev Tipi
                        </InputLabel>
                        <Select
                          labelId="cardNumber-label"
                          id="cardNumber"
                          label="Öncelik Durumu"
                          fullWidth
                          autoComplete="cc-number"
                          variant="standard"
                        >
                          <MenuItem value="low">Ziyaret</MenuItem>
                          <MenuItem value="medium">Telefon Araması</MenuItem>
                          <MenuItem value="high">E-Posta</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sx={{ mb: 3 }}>
                      <TextField
                        required
                        id="planNote"
                        label="Planlama Notu"
                        helperText=""
                        fullWidth
                        autoComplete="cc-csc"
                        variant="standard"
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    sx={{
                      mt: 2,
                      color: "#000",
                      border: "1px solid #000",
                      backgroundColor: "transparent",
                      "&:hover": {
                        backgroundColor:
                          selectedBrand === BrandOptions.Budget
                            ? BrandColors.Budget
                            : BrandColors.Avis, // Background color on hover
                        border:
                          selectedBrand === BrandOptions.Budget
                            ? BrandColors.Budget
                            : BrandColors.Avis, // Background color on hover
                        color: "#fff",
                      },
                      padding: "8px 16px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Kaydet
                  </Button>
                </Stack>
              </React.Fragment>
            </form>
          </ModalDialog>
        </Modal>
      </React.Fragment>
      {/* MODAL */}
    </>
  );
};
