import React from "react";
import { Route, Routes } from "react-router-dom";
import QuoteDetailsTable from "./QuoteDetailsTable";
import QuoteDetailsDetail from "./QuoteDetailsDetail";
import QuoteDetailsCreate from "./QuoteDetailsCreate";


const QuoteDetails: React.FC = () => {
    return (
        <Routes>
            <Route path="/*" element={<QuoteDetailsTable />} />
            <Route path="/detail/:id" element={<QuoteDetailsDetail />} />
            <Route path="/create" element={<QuoteDetailsCreate />} />
        </Routes>
    );
};

export default QuoteDetails;