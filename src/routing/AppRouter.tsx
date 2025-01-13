import { Route, Routes } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import Appointments from "../components/appointments/Appointments";
import Companies from "../components/companies/Companies";
import Contacts from "../components/contacts/Contacts";
import Contracts from "../components/contracts/Contracts";
import Emails from "../components/emails/Emails";
import { Goals } from "../components/goals/Goals";
import InterestedProducts from "../components/interestedproducts/InterestedProducts";
import Leads from "../components/leads/Leads";
import Offers from "../components/offers/Offers";
import Opportunities from "../components/opportunities/Opportunities";
import Phones from "../components/phones/Phones";
import Profile from "../components/profile/Profile";
import { Tasks } from "../components/tasks/Tasks";
import Auth from "../auth/Auth";
import QuoteDetails from "../components/quotedetails/QuoteDetails";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/profile/*" element={<Profile />} />
      <Route path="/appointments/*" element={<Appointments />} />
      <Route path="/phones/*" element={<Phones />} />
      <Route path="/emails/*" element={<Emails />} />
      <Route path="/companies/*" element={<Companies />} />
      <Route path="/contacts/*" element={<Contacts />} />
      <Route path="/leads/*" element={<Leads />} />
      <Route path="/opportunities/*" element={<Opportunities />} />
      <Route path="/offers/*" element={<Offers />} />
      <Route path="/quotedetails/*" element={<QuoteDetails />} />
      {/* <Route path="/rentalaggrements/*" element={<RentalAggrements />} /> */}
      <Route path="/contracts/*" element={<Contracts />} />
      <Route path="/interestedproducts/*" element={<InterestedProducts />} />
      <Route path="/goals" element={<Goals />} />
      <Route path="/tasks" element={<Tasks />} />
    </Routes>
  );
};

export default AppRouter;
