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
    const hasToken = !!localStorage.getItem('authToken');

    // Bypass de desenvolvimento: permite acesso se estiver em dev e
    // 1) URL contiver ?dev=1, ou 2) localStorage tiver authBypass=1
    if (import.meta.env.DEV) {
      const params = new URLSearchParams(window.location.search);
      const devFlag = params.get('dev') === '1';
      const localBypass = localStorage.getItem('authBypass') === '1';
      if (devFlag || localBypass) return true;
    }

    return hasToken;
  };

  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

