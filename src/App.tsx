import React, { useEffect } from "react";
import Auth from "./auth/Auth";
import { AppContextProvider } from "./contexts/AppContext";
import { useAuth } from "./contexts/AuthContext";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import { BrowserRouter } from 'react-router-dom';

const App: React.FC = () => {
  const { isAuthenticated, checkAuthStatus} = useAuth();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <>
    
      {isAuthenticated ? (
        <AppContextProvider>
          <Navbar />
          <Sidebar />
        </AppContextProvider>
      ) : (
        <Auth />
      )}

    </>
  );
};

export default App;