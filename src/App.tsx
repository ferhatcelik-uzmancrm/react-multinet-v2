import React from "react";
import Login from "./auth/Login";
import Auth from "./auth/Auth";
import { AppContextProvider } from "./contexts/AppContext";
import { useAuth } from "./contexts/AuthContext";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import ForgotPassword from "./auth/ForgotPassword";
// import Footer from './layout/Footer';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <AppContextProvider>
          <Navbar />
          <Sidebar />
          {/* <Footer /> */}
        </AppContextProvider>
      ) : (
        <Auth />
      )}
    </>
  );
};

export default App;
