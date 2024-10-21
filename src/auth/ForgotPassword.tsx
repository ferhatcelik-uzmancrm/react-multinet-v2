import { Alert, LinearProgress, useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useState } from "react";
import { ForgotPasswordRequestModel } from "../models/Login";
import { sendRequest } from "../requests/ApiCall";
import { useNavigate } from 'react-router-dom';
import AlertComponent from "../widgets/Alert";
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="" target="_blank">
        Uzman CRM
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}


const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#000",
    },
    secondary: {
      main: "#000",
    },
  },
});

const ForgotPassword = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
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

  const [formData, setFormData] = useState<ForgotPasswordRequestModel>({
    email: "",
    password: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  // const [alert, setAlert] = useState(String);
  const [loading, setLoading] = useState(Boolean);


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true)

    try {
      await sendRequest("api/user/forgot-password", formData)
        .then(response => {
          setAlertState({
            message: "Password updated successfully!",
            type: 'success',
            position: 'bottom-right',
            showProgress: true,
            isOpen: true,
          });
          setTimeout(() => {
            setAlertState((prevState) => ({ ...prevState, isOpen: false }));
            navigate('/*');
          }, 3000); // 3 saniye bekletme

        })
        .catch(error => {
          setAlertState({
            message: "User Not Found. Please try again.",
            type: 'danger',
            position: 'bottom-right',
            showProgress: true,
            isOpen: true,
          });
        });
    } catch (error) {
      console.error("Error:", error);
      setAlertState({
        message: "Error updating password. Please try again.",
        type: 'danger',
        position: 'bottom-right',
        showProgress: true,
        isOpen: true,
      });
    }
    finally {
      setLoading(false)
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
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              alt="Logo"
              src="https://multinet.com.tr/themes/custom/multinet/logo.svg"
              width={isMobile ? 340 : 400}
              m={4}
            />
            {showAlert && (
              <Box
                sx={{
                  width: "100%",
                  mt: 2,
                }}
              >
                <Alert severity="error" onClose={() => setShowAlert(false)}>
                  Kullanıcı adı veya şifre yanlış.
                </Alert>
              </Box>
            )}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleInputChange}
                variant="standard"
                sx={{
                  mt: 3,
                }}
              />
              <FormControl fullWidth required sx={{ mt: 3,}} variant="standard">
                <InputLabel htmlFor="password">New Password</InputLabel>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  border: "none",
                  textTransform: "capitalize",
                  color: "white",
                  backgroundColor: "#211d3c",
                  fontSize: "20px",
                  "&:hover": {
                    backgroundColor: "#f7a724",
                  },
                }}
                disabled={loading}
              >
                Gönder
              </Button>
              {loading && (
                <Box mb={4}>
                  <LinearProgress />
                </Box>
              )}
              <Grid container>
                <Grid item xs>
                  {/* <Link href="#" variant="body2">
                  Şifremi unuttum
                </Link> */}
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </Container>

  );
};

export default ForgotPassword;
