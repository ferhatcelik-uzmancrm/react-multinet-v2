import React from "react";
import { Route, Routes } from "react-router-dom";
import OpportunitiesCreate from "./OpportunitiesCreate";
import OpportunitiesDetail from "./OpportunitiesDetail";
import OpportunitiesTable from "./OpportunitiesTable";

const Opportunities: React.FC = () => {
    return (
        <Routes>
            <Route path="/*" element={<OpportunitiesTable />} />
            <Route path="/detail/:id" element={<OpportunitiesDetail />} />
            <Route path="/create" element={<OpportunitiesCreate />} />
        </Routes>
    );
};

export default Opportunities;
