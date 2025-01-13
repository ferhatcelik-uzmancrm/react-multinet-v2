import { Route, Routes } from "react-router-dom";
import OffersDetail from "./OffersDetail";
import OffersTable from "./OffersTable";
import OffersCreate from "./OffersCreate";

const Offers: React.FC = () => {
    return (
        <Routes>
            <Route path="/*" element={<OffersTable />} />
            <Route path="/detail/:id" element={<OffersDetail />} />
            <Route path="/create/" element={<OffersCreate />} />
        </Routes>
    );
};

export default Offers;
