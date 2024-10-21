import { styled } from "@mui/material/styles";
import React from "react";
import { useAppContext } from "../contexts/AppContext";
import { BrandOptions } from "../enums/Enums";

interface CustomScrollbarProps {
  children: React.ReactNode;
}

const CustomScrollbar: React.FC<CustomScrollbarProps> = ({ children }) => {
  const { selectedBrand } = useAppContext();

  const getByBrand = () => {
    switch (selectedBrand) {
      case BrandOptions.Avis:
        return {
          backgroundColor: "#d0052d",
        };
      case BrandOptions.Filo:
        return {
          backgroundColor: "#d0052d",
        };
      case BrandOptions.Budget:
        return {
          backgroundColor: "#00285f",
        };

      default:
        return {
          backgroundColor: "#333333",
        };
    }
  };

  const ScrollStyle = styled("div")(({ theme }) => ({
    overflowY: "scroll",
    overflowX: "hidden",
    maxHeight: 350,
    scrollbarWidth: "thin",
    "&::-webkit-scrollbar": {
      width: 6,
      backgroundColor: theme.palette.background.default,
      opacity: 0.6,
    },
    "&::-webkit-scrollbar-thumb": {
      // backgroundColor: theme.palette.primary.main,
      backgroundColor,
      borderRadius: 8,
    },
    "&::-webkit-scrollbar-thumb:hover": {
      opacity: 0.8,
    },
  }));

  const { backgroundColor } = getByBrand();
  return <ScrollStyle>{children}</ScrollStyle>;
};

export default CustomScrollbar;
