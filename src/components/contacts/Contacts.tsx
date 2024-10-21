import { Route, Routes } from "react-router-dom";
import ContactsCreate from "./ContactsCreate";
import ContactsDetail from "./ContactsDetail";
import ContactsTable from "./ContactsTable";

const Contacts: React.FC = () => {
  return (
    <Routes>
      <Route path="/*" element={<ContactsTable />} />
      <Route path="/detail/:id" element={<ContactsDetail />} />
      <Route path="/create" element={<ContactsCreate />} />
    </Routes>
  );
};

export default Contacts;
