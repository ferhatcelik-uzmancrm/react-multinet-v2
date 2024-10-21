import React from "react";
import { Route, Routes } from "react-router-dom";
import ContractsDetail from "./ContractsDetail";
import ContractsTable from "./ContractsTable";

const Contracts: React.FC = () => {

  return (
    <Routes>
      <Route path="/*" element={<ContractsTable />} />
      <Route path="/detail/:id" element={<ContractsDetail />} />
    </Routes>
  );
};

export default Contracts;
