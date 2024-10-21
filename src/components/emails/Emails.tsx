import React from "react";
import { Route, Routes } from "react-router-dom";
import EmailsCreate from "./EmailsCreate";
import EmailsDetail from "./EmailsDetail";
import EmailsTable from "./EmailsTable";
const Emails: React.FC = () => {
    return (
        <Routes>
            <Route path="/*" element={<EmailsTable />} />
            <Route path="/detail/:id" element={<EmailsDetail />} />
            <Route path="/create" element={<EmailsCreate />} />
        </Routes>
    );
};

export default Emails;
