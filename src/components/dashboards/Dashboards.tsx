import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardDetail from "./DashboardDetail";


const Dashboards: React.FC = () => {
  return (
    <Routes>
      <Route path="/*" element={<DashboardDetail />} />
    </Routes>
  );
};

export default Dashboards;