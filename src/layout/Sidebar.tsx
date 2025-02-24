import {
  AlternateEmailTwoTone,
  BookOnlineTwoTone,
  BusinessTwoTone,
  DashboardCustomizeTwoTone,
  DoubleArrowRounded,
  ExpandLess,
  ExpandMore,
  GroupAddTwoTone,
  Groups2TwoTone,
  InventoryTwoTone,
  LocalOfferTwoTone,
  MeetingRoomTwoTone,
  PhoneInTalkTwoTone,
  ProductionQuantityLimitsTwoTone,
  TipsAndUpdatesTwoTone,
  VolunteerActivismTwoTone
} from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Breadcrumbs, Chip, Link, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { CSSObject, styled, Theme, useTheme } from "@mui/material/styles";
import * as React from "react";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Appointments from "../components/appointments/Appointments";
import Companies from "../components/companies/Companies";
import Contacts from "../components/contacts/Contacts";
import Emails from "../components/emails/Emails";
import InterestedProducts from "../components/interestedproducts/InterestedProducts";
import Leads from "../components/leads/Leads";
import Offers from "../components/offers/Offers";
import Opportunities from "../components/opportunities/Opportunities";
import Phones from "../components/phones/Phones";
import { useAuth } from "../contexts/AuthContext";
import ScrollToTop from "../widgets/ScrollToTop";
import Content  from "./Content";
import QuoteDetails from "../components/quotedetails/QuoteDetails";
import Dashboards from "../components/dashboards/Dashboards";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  marginTop: theme.spacing(10),
  marginLeft: theme.spacing(10),
  marginBottom: theme.spacing(10),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginTop: `calc(${theme.spacing(10)} + 1px)`, // Add left padding when the drawer is closed
  marginLeft: `calc(${theme.spacing(1)} + 1px)`,
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const handleBreadcrumbClick = (
  event: React.MouseEvent<HTMLDivElement, MouseEvent>
) => {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
};

const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(!isMobile); // Hide sidebar on mobile
  const [selectedItem, setSelectedItem] = useState("/");
  const [selectedText, setSelectedText] = useState("");
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const storedItem = sessionStorage.getItem("selectedSidebarItem");
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleListItemClick = (path: string, text: string) => {
    setSelectedItem(path);
    setSelectedText(text);
    sessionStorage.setItem("selectedSidebarItem", JSON.stringify({ path, text }));
  };

  useEffect(() => {
    
    if (storedItem) {
      const { path, text } = JSON.parse(storedItem);
      setSelectedItem(path);
      setSelectedText(text);
    }
  }, [storedItem]);

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };


  const handleActivitiesToggle = () => {
    setActivitiesOpen(!activitiesOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open} transitionDuration={500}>
        <DrawerHeader>
          {open ? (
            <Chip
              label="Hoşgeldiniz"
              sx={{
                width: 200,
                fontSize: 20,
                color: "#5c5c5c",
                fontFamily: "Calibri",
              }}
            />
          ) : null}
          <IconButton onClick={open ? handleDrawerClose : handleDrawerOpen}>
            {open ? (
              theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            {
              text: "Anasayfa",
              path: "/dashboards",
              icon: <DashboardCustomizeTwoTone />,
              component: Dashboards,
            },
            {
              text: "Müşteri Adayı",
              path: "/leads",
              icon: <GroupAddTwoTone />,
              component: Leads,
            },
            {
              text: "Firma",
              path: "/companies",
              icon: <BusinessTwoTone />,
              component: Companies,
            },
            {
              text: "İlgili Kişi",
              path: "/contacts",
              icon: <Groups2TwoTone />,
              component: Contacts,
            },
            {
              text: "Aktiviteler",
              icon: <TipsAndUpdatesTwoTone />,
              nestedItems: [
                {
                  text: "Telefon",
                  path: "/phones",
                  icon: <PhoneInTalkTwoTone />,
                  component: Phones,
                },
                {
                  text: "E-posta",
                  path: "/emails",
                  icon: <AlternateEmailTwoTone />,
                  component: Emails,
                },
              ],
            },
            {
              text: "Ziyaret",
              path: "/appointments",
              icon: <BookOnlineTwoTone />,
              component: Appointments,
            },
            {
              text: "İlgilenilen Ürün",
              path: "/interestedproducts",
              icon: <ProductionQuantityLimitsTwoTone />,
              component: InterestedProducts,
            },
            {
              text: "Fırsatlar",
              path: "/opportunities",
              icon: <VolunteerActivismTwoTone />,
              component: Opportunities,
            },
            {
              text: "Teklif",
              path: "/offers",
              icon: <LocalOfferTwoTone />,
              component: Offers,
            },
            {
              text: "Teklif Ürünü",
              path: "/quotedetails",
              icon: <InventoryTwoTone   />,
              component: QuoteDetails,
            },
          ].map((item) => (
            <React.Fragment key={item.text}>
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  sx={{
                    maxHeight: 26,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    mt: 3,
                    mr: 2,
                    mb: 2,
                    borderRadius: 3,
                  }}
                  onClick={
                    item.nestedItems
                      ? handleActivitiesToggle
                      : () => handleListItemClick(item.path!, item.text)
                  }
                  component={item.nestedItems ? "div" : RouterLink}
                  to={item.nestedItems ? undefined : item.path}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{ fontSize: 5, opacity: open ? 1 : 0 }}
                  />
                  {item.nestedItems && (
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        ml: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                      onClick={handleActivitiesToggle}
                    >
                      {activitiesOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemIcon>
                  )}
                  {open && selectedItem === item.path && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        paddingRight: 1,
                      }}
                    >
                      <DoubleArrowRounded sx={{ color: "gray" }} />
                    </Box>
                  )}
                </ListItemButton>
              </ListItem>
              {item.nestedItems && activitiesOpen && (
                <List sx={{ pl: 4 }}>
                  {item.nestedItems.map((nestedItem) => (
                    <ListItem
                      key={nestedItem.text}
                      disablePadding
                      sx={{ display: "block" }}
                    >
                      <ListItemButton
                        sx={{
                          maxHeight: 26,
                          justifyContent: open ? "initial" : "center",
                          px: 2.5,
                          mt: 1,
                          mr: 2,
                          mb: 1,
                          borderRadius: 3,
                        }}
                        onClick={() =>
                          handleListItemClick(nestedItem.path, nestedItem.text)
                        }
                        component={RouterLink}
                        to={nestedItem.path}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                          }}
                        >
                          {nestedItem.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={nestedItem.text}
                          sx={{ fontSize: 5, opacity: open ? 1 : 0 }}
                        />
                        {open && selectedItem === nestedItem.path && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              bottom: 0,
                              display: "flex",
                              alignItems: "center",
                              paddingRight: 1,
                            }}
                          >
                            <DoubleArrowRounded sx={{ color: "gray" }} />
                          </Box>
                        )}
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </React.Fragment>
          ))}
        </List>
        <Divider />
        {/* <List>
          {[
            {
              text: "Hedeflerim",
              path: "/goals",
              icon: <FlagCircleTwoTone />,
              component: Goals,
            },
            {
              text: "Görevlerim",
              path: "/tasks",
              icon: <AddTaskTwoTone />,
              component: Tasks,
            },
          ].map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  maxHeight: 26,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  mt: 2,
                  mr: 2,
                  mb: 2,
                  borderRadius: 3,
                }}
                onClick={() => handleListItemClick(item.path, item.text)}
                component={RouterLink}
                to={item.path}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ fontSize: 5, opacity: open ? 1 : 0 }}
                />
                {open && selectedItem === item.path && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      alignItems: "center",
                      paddingRight: 1,
                    }}
                  >
                    <DoubleArrowRounded sx={{ color: "gray" }} />
                  </Box>
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List> */}
        {/* <Divider /> */}
        <List>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                maxHeight: 26,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                mt: 2,
                mr: 2,
                mb: 2,
                borderRadius: 3,
              }}
              onClick={handleLogout}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <MeetingRoomTwoTone />
              </ListItemIcon>
              <ListItemText
                primary="Çıkış"
                sx={{ fontSize: 5, opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: "hidden" }}>
        <Box
          role="presentation"
          onClick={handleBreadcrumbClick}
          sx={{ mt: 1, ml: 4, mb: -5 }}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/">
              Anasayfa
            </Link>
            <Typography color="text.primary">{selectedText}</Typography>
          </Breadcrumbs>
        </Box>
        <DrawerHeader />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            "& > :not(style)": {
              m: 1,
              width: 128,
              height: 128,
            },
          }}
        ></Box>
        {/* <AppRouter /> */}
        <Content />
      </Box>
      {/* <VerticalTabs /> */}
      <ScrollToTop />
    </Box>
  );
};

export default Sidebar;
