import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * Componente que protege rotas privadas
 * Redireciona para /login se o usuário não estiver autenticado
 */
const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const isAuthenticated = () => {
    return !!localStorage.getItem('authToken');
  };

  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

