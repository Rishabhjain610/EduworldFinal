"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SchoolIcon from "@mui/icons-material/School";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LaptopIcon from "@mui/icons-material/Laptop";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// Create a custom theme with purple primary color
const theme = createTheme({
  palette: {
    primary: {
      main: "#000000", // Purple
      light: "#b085f5",
      dark: "#4d2c91",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f5f5f5",
      light: "#ffffff",
      dark: "#c2c2c2",
      contrastText: "#000000",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    //fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          padding: "10px 24px",
        },
        contained: {
          boxShadow: "none",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: 16,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        },
      },
    },
  },
});

// Feature chip component
const FeatureChip = ({ icon, label }) => (
  <Paper
    elevation={0}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      px: 2,
      py: 1,
      borderRadius: 4,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(8px)",
    }}
  >
    {icon}
    <Typography variant="body2" color="white">
      {label}
    </Typography>
  </Paper>
);

const UserAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Login request
        const { data } = await axios.post(
          "http://localhost:8080/auth/login",
          { email, password },
          { withCredentials: true }
        );
        console.log("Login response:", data);
        if (data.success) {
          navigate("/dashboard");
        }
      } else {
        // Signup request (role is forced to 'student' on the backend)
        const { data } = await axios.post(
          "http://localhost:8080/auth/signup",
          { username, email, password },
          { withCredentials: true }
        );
        console.log("Signup response:", data);
        if (data.success) {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Left side - Campus imagery */}
        {!isMobile && (
          <Box
            sx={{
              position: "relative",
              width: { md: "60%", lg: "45%" },
              background: "linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                bgcolor: "rgba(0,0,0,0.2)",
                zIndex: 1,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage: "url('../src/assets/loginImg.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                p: 6,
                zIndex: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <img
                  src="../src/assets/eduWorldLogo.png"
                  alt=""
                  style={{ height: "80%", width: "14%" }}
                />
                {/* <SchoolIcon sx={{ color: "white", fontSize: 40 }} /> */}
                <Typography variant="h5" color="white">
                  EduWorld
                </Typography>
              </Box>
              <Box sx={{ maxWidth: 500 }}>
                <Typography variant="h3" color="white" gutterBottom>
                  Your complete digital campus experience
                </Typography>
                <Typography
                  variant="body1"
                  color="white"
                  sx={{ opacity: 0.9, mb: 4 }}
                >
                  Access all your campus resources, connect with peers, and stay
                  organized with our all-in-one platform.
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ gap: 2 }}
                >
                  <FeatureChip
                    icon={<CalendarMonthIcon sx={{ color: "white" }} />}
                    label="Class Schedules"
                  />
                  <FeatureChip
                    icon={<LaptopIcon sx={{ color: "white" }} />}
                    label="Online Learning"
                  />
                  <FeatureChip
                    icon={<LocalCafeIcon sx={{ color: "white" }} />}
                    label="Campus Events"
                  />
                </Stack>
              </Box>
            </Box>
          </Box>
        )}

        {/* Right side - Auth forms */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 2, sm: 4, md: 6 },
            bgcolor: "background.default",
          }}
        >
          <Container maxWidth="sm">
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                  {isLogin ? "Welcome back" : "Create your account"}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4 }}
                >
                  {isLogin
                    ? "Sign in to your account to access your campus dashboard"
                    : "Start your educational journey"}
                </Typography>

                <form onSubmit={handleSubmit}>
                  {!isLogin && (
                    <TextField
                      fullWidth
                      label="Full Name"
                      placeholder="John Doe"
                      variant="outlined"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}

                  <TextField
                    fullWidth
                    label="Email"
                    placeholder="name@example.com"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {isLogin && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mb: 3,
                      }}
                    ></Box>
                  )}

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    type="submit"
                    startIcon={isLogin ? <LoginIcon /> : <PersonAddIcon />}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ mt: 2, backgroundColor: "#FB923C" }}
                  >
                    {isLogin ? "Sign in" : "Sign up"}
                  </Button>
                </form>

                <Box sx={{ mt: 4 }}>
                  <Divider>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ px: 2 }}
                    >
                      {isLogin
                        ? "Don't have an account?"
                        : "Already have an account?"}
                    </Typography>
                  </Divider>

                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                  >
                    <Button variant="text" onClick={() => setIsLogin(!isLogin)}>
                      {isLogin ? "Sign up" : "Sign in"}
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default UserAuth;
