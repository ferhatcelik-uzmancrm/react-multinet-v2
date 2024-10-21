import { Route, Routes } from "react-router-dom";
import CompaniesCreate from "./CompaniesCreate";
import CompaniesDetail from "./CompaniesDetail";
import CompaniesTable from "./CompaniesTable";

const Companies: React.FC = () => {
  return (
    <Routes>
      <Route path="/*" element={<CompaniesTable />} />
      <Route path="/detail/:id" element={<CompaniesDetail />} />
      <Route path="/create" element={<CompaniesCreate />} />
    </Routes>
  );
};

export default Companies;
