import React from "react";
import { Route, Routes } from "react-router-dom";
import AppointmentsCreate from "./AppointmentsCreate";
import AppointmentsDetail from "./AppointmentsDetail";
import AppointmentTable from "./AppointmentsTable";

const Appointments: React.FC = () => {
  return (
    <Routes>
      <Route path="/*" element={<AppointmentTable />} />
      <Route path="/detail/:id" element={<AppointmentsDetail />} />
      <Route path="/create" element={<AppointmentsCreate />} />
    </Routes>
  );
};

export default Appointments;
