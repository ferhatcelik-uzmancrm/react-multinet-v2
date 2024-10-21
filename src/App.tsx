import React from "react";
import Auth from "./auth/Auth";
import { AppContextProvider } from "./contexts/AppContext";
import { useAuth } from "./contexts/AuthContext";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
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
