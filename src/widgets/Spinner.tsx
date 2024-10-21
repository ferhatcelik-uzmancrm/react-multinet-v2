import { CircularProgress } from "@mui/material";
import React from "react";
import { HashLoader, RingLoader } from "react-spinners";

interface SpinnerProps {
  type: "circular" | "ring" | "hash";
  size?: number;
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  type,
  size = 50,
  color = "#3f51b5",
}) => {
  const renderSpinner = () => {
    switch (type) {
      case "ring":
        return <RingLoader size={size} color={color} />;
      case "hash":
        return <HashLoader size={size} color={color} />;
      default:
        return <CircularProgress size={size} style={{ color }} />;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {renderSpinner()}
    </div>
  );
};

export default Spinner;
