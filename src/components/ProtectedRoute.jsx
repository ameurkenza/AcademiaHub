import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  
  console.log("🔍 Vérification du token :", token); // ✅ Debug : voir si Redux a un token

  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
