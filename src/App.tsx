import React, { useEffect } from "react";
import Auth from "./auth/Auth";
import { AppContextProvider } from "./contexts/AppContext";
import { useAuth } from "./contexts/AuthContext";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";

const App: React.FC = () => {
  const { isAuthenticated, checkAuthStatus} = useAuth();

  useEffect(() => {
    checkAuthStatus(); // Uygulama yüklendiğinde oturum durumu kontrol edilir
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