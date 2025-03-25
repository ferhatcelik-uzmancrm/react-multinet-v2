import React from "react";
import { Route, Routes } from "react-router-dom";
import SalesOrderTable from "./SalesOrderTable";
import SalesOrderDetail from "./SalesOrderDetail";


const SalesOrder: React.FC = () => {
    return (
        <Routes>
             <Route path="/*" element={<SalesOrderTable />} />
            <Route path="/detail/:id" element={<SalesOrderDetail />} />  
        </Routes>
    );
};

export default SalesOrder;