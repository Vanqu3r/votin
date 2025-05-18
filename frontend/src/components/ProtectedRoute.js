// components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  if (!user && !isLoading) {
    return <Navigate to="/" replace />;
  }

  if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.tipo)) {
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Acceso no autorizado</h4>
          <p>No tienes los permisos necesarios para acceder a esta página.</p>
          <hr />
          <button
            className="btn btn-primary"
            onClick={() => navigate("/dashboard")}
          >
            Ir a Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
