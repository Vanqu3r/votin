// components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.tipo)) {
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Acceso no autorizado</h4>
          <p>No tienes los permisos necesarios para acceder a esta página.</p>
          <hr />
          <p className="mb-0">
            Serás redirigido a la página principal en 5 segundos...
            <Navigate to="/dashboard" replace />
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;