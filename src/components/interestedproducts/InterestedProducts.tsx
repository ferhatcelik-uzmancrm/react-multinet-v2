import { Route, Routes } from "react-router-dom";
import InterestedProductsCreate from "./InterestedProductsCreate";
import InterestedProductsDetail from "./InterestedProductsDetail";
import InterestedProductsTable from "./InterestedProductsTable";
const InterestedProducts: React.FC = () => {
    return (
        <Routes>
            <Route path="/*" element={<InterestedProductsTable />} />
            <Route path="/detail/:id" element={<InterestedProductsDetail />} />
            <Route path="/create" element={<InterestedProductsCreate />} />
        </Routes>
    );
};

export default InterestedProducts;
