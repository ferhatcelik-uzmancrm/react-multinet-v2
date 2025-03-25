import React from "react";
import { Route, Routes } from "react-router-dom";
import BranchInformationsDetail from "./BranchInformationsDetail";
import BranchInformationsTable from "./BranchInformationsTable";


const BranchInformations: React.FC = () => {
    return (
        <Routes>
             <Route path="/*" element={<BranchInformationsTable />} />
            <Route path="/detail/:id" element={<BranchInformationsDetail />} />  
        </Routes>
    );
};

export default BranchInformations;