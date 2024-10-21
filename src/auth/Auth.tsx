import { Route, Routes } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import Login from "./Login";


const Auth: React.FC = () => {
  return (
    <Routes>
      {/* <Route path="/*" element={<Login />} /> */}
      <Route path="/*" element={<Login />} />
      <Route path="/forgotpassword/*" element={<ForgotPassword />} />
    </Routes>
  );
};

export default Auth;