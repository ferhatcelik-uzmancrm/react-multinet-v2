import { Route, Routes } from "react-router-dom";
import LeadsCreate from "./LeadsCreate";
import LeadsDetail from "./LeadsDetail";
import LeadsTable from "./LeadsTable";

const Contacts: React.FC = () => {
  return (
    <Routes>
      <Route path="/*" element={<LeadsTable />} />
      <Route path="/detail/:id" element={<LeadsDetail />} />
      <Route path="/create" element={<LeadsCreate />} />
    </Routes>
  );
};

export default Contacts;
