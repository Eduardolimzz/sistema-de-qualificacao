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

  // ✅ CORRIGIDO: Agora busca 'userType' em vez de 'userTipo'
  const hasCorrectRole = () => {
    if (!requiredTipo) return true; // Se não requer tipo específico, libera

    const userType = localStorage.getItem('userType'); // ⭐ MUDOU AQUI

    console.log('🔍 PrivateRoute - Verificando acesso:');
    console.log('   Required:', requiredTipo);
    console.log('   User has:', userType);

    return userType === requiredTipo;
  };

  // Verifica autenticação
  if (!isAuthenticated()) {
    console.log('❌ Não autenticado, redirecionando para /login');
    return <Navigate to="/login" replace />;
  }

  // Verifica role/tipo
  if (!hasCorrectRole()) {
    const userType = localStorage.getItem('userType'); // ⭐ MUDOU AQUI

    console.log('❌ Role incorreto, redirecionando...');

    // Se for aluno tentando acessar rota de professor ou vice-versa
    const redirectTo = userType === 'aluno' ? '/aluno/catalogo' : '/professor/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  console.log('✅ Acesso autorizado!');
  return <>{children}</>;
};

export default PrivateRoute;