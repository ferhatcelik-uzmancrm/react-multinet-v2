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
import { loginRequest } from "../requests/ApiCall";
import Spinner from "../widgets/Spinner";

type AuthContextData = {
  isAuthenticated: boolean;
  login: (loginData: LoginRequestModel) => void;
  logout: () => void;
  currentUser: UserModel | undefined;
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>;
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
  const [currentUser, setCurrentUser] = useState<UserModel>();
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [loading, setLoading] = useState(true);

  const setAuthStatus = (status: boolean) => {
    localStorage.setItem("isAuthenticated", status.toString());
  };

  const checkAuthStatus = () => {
    const authStatus = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(authStatus === "true");
    setLoading(false);
  };

  const login = async (loginData: LoginRequestModel) => {
    try {
      const response = await loginRequest("api/user/login", loginData);
      if (response.data.Token) {
        setIsAuthenticated(true);
        setAuthStatus(true);
        setLastActivity(Date.now());
        setCurrentUser({
          brand: response.data.CRMUserName,
          brandid: "",
          user: response.data.UserName,
          userid: response.data.CRMUserId,
          cityid: response.data.CRMUserCityId,
          cityname: response.data.CRMUserCityName
        });
        localStorage.setItem("token", response.data.Token); // Store token
        localStorage.setItem("username", response.data.UserName);
        localStorage.setItem("crmusername", response.data.CRMUserName);
        localStorage.setItem("crmuserid", response.data.CRMUserId);
        localStorage.setItem("crmusercityid", response.data.CRMUserCityId);
        localStorage.setItem("portaluserid", response.data.PortalUserId);
        // localStorage.setItem("userid", ""); // Add if userId is returned
        // localStorage.setItem("brand", ""); // Add if brand is returned
        // localStorage.setItem("brandid", ""); // Add if brandId is returned
      }
    } catch (error) {
      setIsAuthenticated(false);
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setAuthStatus(false);
  };

  useEffect(() => {
    const clearAuthCredentials = () => {
      setIsAuthenticated(false);
      setAuthStatus(false);
    };

    const loggedout = () => {
      setIsAuthenticated(false);
      setAuthStatus(false);
    };

    checkAuthStatus();
    const timer = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - lastActivity;
      const halfHour = 30 * 60 * 1000;

      if (elapsedTime > halfHour) {
        loggedout();
        clearAuthCredentials();
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [lastActivity]);

  return loading ? (
    <Spinner type="hash" size={50} color="#d0052d" />
  ) : (
    <AuthContext.Provider
      value={{ isAuthenticated, setCurrentUser, currentUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
