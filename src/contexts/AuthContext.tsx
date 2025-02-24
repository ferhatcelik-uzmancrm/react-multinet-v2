import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { LoginRequestModel, UserModel } from "../models/Login";
import { getCRMData, getData, loginRequest } from "../requests/ApiCall";
import Spinner from "../widgets/Spinner";
import TokenService from "../services/TokenService";

type AuthContextData = {
  isAuthenticated: boolean;
  login: (loginData: LoginRequestModel) => Promise<boolean>;
  logout: () => void;
  currentUser: UserModel | undefined;
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>;
  checkAuthStatus: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextData | null>(null);

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return authContext;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>();
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Token yenileme fonksiyonu
  const refreshToken = async () => {
    try {
      const response = await getData("api/user/refresh-token");
      if (response.data.Success) {
        sessionStorage.setItem("token", response.data.token);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Oturum kontrolü
  const checkAuthStatus = async () => {
    try {
      const token = TokenService.getToken();
      if (!token) {
        await logout();
        return;
      }

      const response = await getData("api/user/verify-token");
      if (!response.data.Success) {
        // Token geçersiz, yenilemeyi dene
        const refreshed = await refreshToken();
        if (!refreshed) {
          await logout();
          return;
        }
      }

      setIsAuthenticated(true);
      const userData: UserModel = {
        user: sessionStorage.getItem("username") || "",
        userid: sessionStorage.getItem("crmuserid") || "",
        brand: sessionStorage.getItem("brand") || "",
        brandid: sessionStorage.getItem("brandid") || "",
        cityid: sessionStorage.getItem("crmusercityid") || "",
        cityname: sessionStorage.getItem("cityname") || "",
      };
      setCurrentUser(userData);
    } catch (error) {
      console.error("Auth check error:", error);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  // İnaktivite kontrolü
  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
    };

    // Kullanıcı aktivitelerini dinle
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("scroll", handleActivity);

    // Periyodik kontroller
    const activityCheck = setInterval(() => {
      const inactiveTime = Date.now() - lastActivity;
      if (inactiveTime > 30 * 60 * 1000) { // 30 dakika
        logout();
      }
    }, 60000); // Her dakika kontrol et

    const tokenCheck = setInterval(checkAuthStatus, 5 * 60 * 1000); // 5 dakikada bir

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      clearInterval(activityCheck);
      clearInterval(tokenCheck);
    };
  }, [lastActivity]);

  // İlk yükleme kontrolü
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (loginData: LoginRequestModel): Promise<boolean> => {
    try {
      const response = await loginRequest(loginData);
      if (response.data.Success) {
        const { Token, ...userData } = response.data.Data;
        TokenService.setToken(Token);
        
        // Session storage'a değerleri kaydet
        sessionStorage.setItem("portaluserid",userData.portalUserId);
        sessionStorage.setItem("username", userData.UserName);
        sessionStorage.setItem("crmusername", userData.CRMUserName);
        sessionStorage.setItem("crmuserid", userData.CRMUserId);
        sessionStorage.setItem("crmusercityid", userData.CRMUserCityId);
        


        setCurrentUser(userData as UserModel);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const token = TokenService.getToken();
      if (token) {
        await getData("api/user/logout");
        TokenService.addToBlacklist(token);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      TokenService.removeToken();
      sessionStorage.clear();
      setIsAuthenticated(false);
      setCurrentUser(undefined);
    }
  };

  // Session timeout kontrolü
  useEffect(() => {
    const checkSession = () => {
      if (TokenService.checkSessionTimeout()) {
        logout();
        return;
      }
      TokenService.extendSession();
    };

    const sessionCheck = setInterval(checkSession, 60000); // Her dakika kontrol
    const blacklistCleanup = setInterval(() => TokenService.cleanBlacklist(), 3600000); // Her saat temizlik

    return () => {
      clearInterval(sessionCheck);
      clearInterval(blacklistCleanup);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        currentUser,
        setCurrentUser,
        login,
        logout,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
