import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "../widgets/Spinner";

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Spinner type="hash" size={50} color="#d0052d" />;
  }

  if (!isAuthenticated) {
    // Kullanıcı giriş yapmak istediği sayfaya yönlendirilsin
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute; 