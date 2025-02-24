import MenuIcon from "@mui/icons-material/Menu";
import PersonPinTwoToneIcon from "@mui/icons-material/PersonPinTwoTone";
import { ModalClose, Sheet, Typography as TypographyJoy } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import { useMediaQuery, useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";
import { BrandColors, BrandIcons, BrandOptions } from "../enums/Enums";
import { useNavigate } from 'react-router-dom';
import Maps from "../modules/Maps";

type BrandLogo = {
  src: string;
};

const latitude = 37.7749;
const longitude = -122.4194;

const pages = [""];
const settings = ["Profil", "Çıkış"];
const pageContentMapping = {
  Haritalar: <Maps lat={latitude} lng={longitude} />,
  FiyatListesi: "This is the Pricing page content.",
  Blog: "This is the Blog page content.",
};

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { selectedBrand } = useAppContext(); //Get selected brand
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };
  const handleProfile = () => {
    navigate("/profile");
  };


  var currentUser = sessionStorage.getItem("crmusername");

  const getNavbarStyle = (brand: BrandOptions): React.CSSProperties => {
    switch (brand) {
      default:
        return {
          backgroundColor: BrandColors.Multinet, // Default dark grey color for unknown brand
        };
    }
  };

  const changeButtonColorByBrand = (
    brand: BrandOptions
  ): React.CSSProperties => {
    switch (brand) {
      default:
        return {
          backgroundColor: BrandColors.MultinetButton, // Default dark grey color for unknown brand
        };
    }
  };

  const { backgroundColor: buttonBackgroundColor } =
    changeButtonColorByBrand(selectedBrand);

  const getBrandIcon = (brand: BrandOptions): BrandLogo => {
    switch (brand) {
      default:
        return {
          src: BrandIcons.Multinet,
        };
    }
  };

  const { src: brandLogoSrc } = getBrandIcon(selectedBrand);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuItemClick = (setting: string) => {
    switch (setting) {
      case "Profil":
        handleProfile();
        break;
      case "Çıkış":
        handleLogout();
        break;
      default:
        break;
    }
    handleCloseUserMenu(); // Close the menu after clicking any menu item
  };

  type Page = keyof typeof pageContentMapping;

  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  const handleNavbarButtonClick = (page: Page) => {
    setSelectedPage(page);
  };

  const handleCloseModal = () => {
    setSelectedPage(null);
  };

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 999 }}>
      <AppBar position="static" sx={{ ...getNavbarStyle(selectedBrand) }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ padding: { xs: 0, md: "0 110px" } }}>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <Box
                component="img"
                alt="Logo"
                src={brandLogoSrc} //"/media/avis-logo.svg"
                sx={{
                  height: 40,
                  width: 230,
                  marginRight: "20px",
                }}
              />
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="warning"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page}
                    onClick={() => handleNavbarButtonClick(page as Page)}
                  >
                    <Typography textAlign="center" style={{ color: "#32325d" }}>
                      {page}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <Box
                component="img"
                alt="Logo"
                src={brandLogoSrc} 
                sx={{ height: 40, width: 120, marginRight: "10px" }}
              />
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => handleNavbarButtonClick(page as Page)}
                  sx={{
                    /*my: 2,*/ color: "#32325d",
                    display: "block",
                    textTransform: "none",
                    fontFamily: "Segoe UI",
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>

              <Box sx={{ flexGrow: 0 }}>
                <Button
                  variant="contained"
                  endIcon={
                    <PersonPinTwoToneIcon
                      sx={{
                        color: "#32325d",
                        "&:hover": {
                          color: "white",
                        },
                      }}
                    />
                  }
                  onClick={handleOpenUserMenu}
                  sx={{
                    width: isMobile ? "120px" : { xs: "150px", sm: "180px", md: "180px" },
                    backgroundColor: buttonBackgroundColor,
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#211d3c",
                      color: "white",
                      "& .MuiTypography-root": {
                        color: "white",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "white",
                      },
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Calibri",
                      fontSize: isMobile ? "10px" : "18px",
                      textTransform: "capitalize",
                      color: "#32325d",
                      "&:hover": {
                        color: "white",
                      },
                    }}
                  >
                    {currentUser}
                  </Typography>
                </Button>
              </Box>

              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => handleMenuItemClick(setting)}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <React.Fragment>
        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          open={Boolean(selectedPage)}
          onClose={handleCloseModal}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Sheet
            variant="outlined"
            sx={{
              maxWidth: 1200,
              borderRadius: "md",
              p: 3,
              boxShadow: "lg",
              [theme.breakpoints.down("sm")]: {
                maxWidth: "90%", // Reduce width on small screens
              },
            }}
          >
            <ModalClose
              variant="outlined"
              sx={{
                top: "calc(-1/4 * var(--IconButton-size))",
                right: "calc(-1/4 * var(--IconButton-size))",
                boxShadow: "0 2px 12px 0 rgba(0 0 0 / 0.2)",
                borderRadius: "50%",
                bgcolor: "background.surface",
                [theme.breakpoints.down("sm")]: {
                  top: "1rem",
                  right: "1rem",
                },
              }}
            />
            <TypographyJoy
              component="h2"
              id="modal-title"
              // variant="h4"
              sx={{
                color: "inherit",
                fontWeight: "bold",
                mb: 1,
                [theme.breakpoints.down("sm")]: {
                  fontSize: "1.8rem",
                },
              }}
            >
              {selectedPage || ""}
            </TypographyJoy>
            {selectedPage !== null && (
              <>
                <Typography>
                  {pageContentMapping[selectedPage] || ""}
                </Typography>
              </>
            )}
            <TypographyJoy
              id="modal-desc"
              textColor="text.tertiary"
              sx={{
                color: "text.tertiary",
                [theme.breakpoints.down("sm")]: {
                  fontSize: "0.9rem",
                },
              }}
            >
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quisquam
              earum assumenda temporibus, voluptate ipsa.
            </TypographyJoy>
          </Sheet>
        </Modal>
      </React.Fragment>
    </div>
  );
};
export default Navbar;
