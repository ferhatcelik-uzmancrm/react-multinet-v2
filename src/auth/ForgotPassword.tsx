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
import { useState, useEffect } from "react";
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
import FormHelperText from '@mui/material/FormHelperText';

// Password validation interface
interface PasswordValidation {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Password validation state
  const [validation, setValidation] = useState<PasswordValidation>({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const [alertState, setAlertState] = useState({
    message: '',
    type: 'success' as 'success' | 'danger',
    position: 'bottom-right' as 'bottom-right' | 'center',
    showProgress: false,
    isOpen: false,
  });

  const [formData, setFormData] = useState<ForgotPasswordRequestModel>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Password validation function
  const validatePassword = (password: string) => {
    setValidation({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  // Check if all password requirements are met
  const isPasswordValid = () => {
    return Object.values(validation).every(value => value === true);
  };

  // Check if passwords match when either password or confirm password changes
  useEffect(() => {
    setPasswordsMatch(formData.password === confirmPassword);
  }, [formData.password, confirmPassword]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'password') {
      validatePassword(value);
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isPasswordValid()) {
      setAlertState({
        message: "Please ensure your password meets all requirements.",
        type: 'danger',
        position: 'bottom-right',
        showProgress: true,
        isOpen: true,
      });
      return;
    }

    if (!passwordsMatch) {
      setAlertState({
        message: "Passwords do not match.",
        type: 'danger',
        position: 'bottom-right',
        showProgress: true,
        isOpen: true,
      });
      return;
    }

    setLoading(true);

    try {
      await sendRequest("api/user/forgot-password", formData);
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
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      setAlertState({
        message: "Error updating password. Please try again.",
        type: 'danger',
        position: 'bottom-right',
        showProgress: true,
        isOpen: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
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
      <AlertComponent
        message={alertState.message}
        type={alertState.type}
        position={alertState.position}
        showProgress={alertState.showProgress}
        isOpen={alertState.isOpen}
        onClose={() => setAlertState(prev => ({ ...prev, isOpen: false }))}
      />
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
                sx={{ mt: 3 }}
              />
              
              <FormControl fullWidth required sx={{ mt: 3 }} variant="standard" error={!isPasswordValid()}>
                <InputLabel htmlFor="password">New Password</InputLabel>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePassword('password')}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText>
                  {!validation.hasMinLength && "• Minimum 8 characters"}
                  {!validation.hasUpperCase && <br />}
                  {!validation.hasUpperCase && "• At least one uppercase letter"}
                  {!validation.hasLowerCase && <br />}
                  {!validation.hasLowerCase && "• At least one lowercase letter"}
                  {!validation.hasNumber && <br />}
                  {!validation.hasNumber && "• At least one number"}
                  {!validation.hasSpecialChar && <br />}
                  {!validation.hasSpecialChar && "• At least one special character"}
                </FormHelperText>
              </FormControl>

              <FormControl fullWidth required sx={{ mt: 3 }} variant="standard" error={!passwordsMatch}>
                <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePassword('confirmPassword')}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {!passwordsMatch && (
                  <FormHelperText>Passwords do not match</FormHelperText>
                )}
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
                disabled={loading || !isPasswordValid() || !passwordsMatch}
              >
                Gönder
              </Button>
              {loading && (
                <Box mb={4}>
                  <LinearProgress />
                </Box>
              )}
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </Container>
  );
};

export default ForgotPassword;