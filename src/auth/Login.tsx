import { Alert, LinearProgress, useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LoginRequestModel } from "../models/Login";

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

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState<LoginRequestModel>({
    username: "",
    password: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  // const [alert, setAlert] = useState(String);
  const [loading, setLoading] = useState(Boolean);

  const { login, isAuthenticated } = useAuth();

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
      await login(formData);
      if (isAuthenticated === true) {
        setShowAlert(false);
      } else {
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Login failed: ", error);
      setShowAlert(true)
    }
    finally {
      setLoading(false)
    }
  };

  return (
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
              id="username"
              label="Kullanıcı Adı"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleInputChange}
              variant="standard"
              sx={{
                mt: 3,
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Şifre"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange}
              //   error
              //   helperText="Incorrect entry."
              variant="standard"
              sx={{
                mt: 3,
              }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="default" />}
              label="Beni Hatırla"
            />
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
              Giriş
            </Button>
            {loading && (
              <Box mb={4}>
                <LinearProgress />
              </Box>
            )}
            <Grid container>
              <Grid item xs>
                <Link href="/forgotpassword/*" variant="body2">
                  Şifremi unuttum
                </Link>
              </Grid>
              <Grid item>
                
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

export default Login;
