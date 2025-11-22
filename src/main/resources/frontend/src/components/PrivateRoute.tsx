import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredTipo?: 'aluno' | 'professor';
}

/**
 * Componente que protege rotas privadas
 * Redireciona para /login se o usuário não estiver autenticado
 */
const PrivateRoute = ({ children, requiredTipo }: PrivateRouteProps) => {
  const isAuthenticated = () => {
    const hasToken = !!localStorage.getItem('authToken');

    // Bypass de desenvolvimento
    if (import.meta.env.DEV) {
      const params = new URLSearchParams(window.location.search);
      const devFlag = params.get('dev') === '1';
      const localBypass = localStorage.getItem('authBypass') === '1';
      if (devFlag || localBypass) return true;
    }

    return hasToken;
  };

  // ✅ VERIFICAR SE O TIPO DE USUÁRIO CORRESPONDE
  const hasCorrectRole = () => {
    if (!requiredTipo) return true; // Se não requer tipo específico, libera
    const userTipo = localStorage.getItem('userTipo');
    return userTipo === requiredTipo;
  };

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!hasCorrectRole()) {
    // Se for aluno tentando acessar rota de professor ou vice-versa
    const userTipo = localStorage.getItem('userTipo');
    const redirectTo = userTipo === 'aluno' ? '/aluno/catalogo' : '/professor/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;