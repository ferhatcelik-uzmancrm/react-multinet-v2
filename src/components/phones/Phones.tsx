import React from "react";
import { Route, Routes } from "react-router-dom";
import PhonesCreate from "./PhonesCreate";
import PhonesDetail from "./PhonesDetail";
import PhonesTable from "./PhonesTable";

const Phones: React.FC = () => {
    return (
        <Routes>
            <Route path="/*" element={<PhonesTable />} />
            <Route path="/detail/:id" element={<PhonesDetail />} />
            <Route path="/create" element={<PhonesCreate />} />
        </Routes>
    );
};

export default Phones;
