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
import Cookies from "js-cookie";

type AuthContextData = {
  isAuthenticated: boolean;
  login: (loginData: LoginRequestModel) => Promise<boolean>;
  logout: () => void;
  currentUser: UserModel | undefined;
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>;
  checkAuthStatus: () => Promise<void>; // checkAuthStatus metodu eklendi
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
    sessionStorage.setItem("isAuthenticated", status.toString());
  };

  // const checkAuthStatus = () => {
  //   const authStatus = sessionStorage.getItem("isAuthenticated");
  //   setIsAuthenticated(authStatus === "true");
  //   setLoading(false);
  // };
  const checkAuthStatus = async () => {
    try {
      const response = await getData("api/user/verify-token");
      if (response.data.Success){
        setIsAuthenticated(response.data.Success);
      }   
      setLoading(false);  
    } catch (error) {
      console.error("Authentication validation failed:", error);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const login = async (loginData: LoginRequestModel): Promise<boolean> => {
    try {
      const response = await loginRequest("api/user/login", loginData);
      if (response.data.Success) {
        setIsAuthenticated(true);
        setAuthStatus(true);
        setLastActivity(Date.now());

        const userInfo = Cookies.get("userInfo");
        if (userInfo) {
          const [portalUserId, username, crmUserId, crmUserName, crmCityId, crmUserCityName] =
            userInfo.split("|");

          setCurrentUser({
            brand: crmUserName,
            brandid: "",
            user: username,
            userid: crmUserId,
            cityid: crmCityId,
            cityname: crmUserCityName,
          });

          sessionStorage.setItem("username", username);
          sessionStorage.setItem("crmusername", crmUserName);
          sessionStorage.setItem("crmuserid", crmUserId);
          sessionStorage.setItem("crmusercityid",crmCityId);
          sessionStorage.setItem("portaluserid",portalUserId);
        }
        return true;
      }
    } catch (error) {
      setIsAuthenticated(false);
      console.log(error);
    }
    return false;
  };

  const logout = async () => {
    try {
      const response = await getCRMData("api/user/logout",null);
      if (response.data.Success) {
        sessionStorage.clear();
        setIsAuthenticated(false);
        setAuthStatus(false);
        // Redirect to login or home page
        window.location.href = "/login";
      } 
    } catch (error) {
      setIsAuthenticated(false);
      console.log(error);
    }
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
      value={{ isAuthenticated, setCurrentUser, currentUser, login, logout,checkAuthStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};
