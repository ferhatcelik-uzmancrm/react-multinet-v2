import { Route, Routes } from "react-router-dom";
import OffersDetail from "./OffersDetail";
import OffersTable from "./OffersTable";

const Offers: React.FC = () => {
    return (
        <Routes>
            <Route path="/*" element={<OffersTable />} />
            <Route path="/detail/:id" element={<OffersDetail />} />
        </Routes>
    );
};

export default Offers;
