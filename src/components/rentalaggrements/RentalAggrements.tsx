import React from "react";
import { Route, Routes } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { BrandOptions } from "../../enums/Enums";
import { Protocols } from "../protocols/Protocols";
import RentalAggrementsDetail from "./RentalAggrementsDetail";
import RentalAggrementsTable from "./RentalAggrementsTable";

const RentalAggrements: React.FC = () => {
  const { selectedBrand } = useAppContext(); //Get selected brand

  return (
    <Routes>
      <Route
        path="/*"
        element={
          selectedBrand === BrandOptions.Filo ? (
            <Protocols />
          ) : (
            <RentalAggrementsTable />
          )
        }
      />
      <Route path="/*" element={<RentalAggrementsTable />} />
      <Route path="/detail/:id" element={<RentalAggrementsDetail />} />
    </Routes>
  );
};

export default RentalAggrements;
