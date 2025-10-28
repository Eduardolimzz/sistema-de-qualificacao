import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../Services/authService';
import './Login.module.css';

const Login = () => {
  const [credenciais, setCredenciais] = useState({
    email: '',
    senha: ''
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const response = await authService.login(credenciais);
      
      // Verifica se o usuário é admin ou professor
      const usuarioRole = response.role || 'aluno';
      
      // Redireciona baseado no tipo de usuário
      if (usuarioRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (usuarioRole === 'professor') {
        navigate('/professor/dashboard');
      } else {
        navigate('/aluno/dashboard');
      }
    } catch (error: any) {
      setErro(error.response?.data?.mensagem || 'Erro ao fazer login. Verifique suas credenciais.');
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Entrar no Sistema
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {erro && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {erro}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={credenciais.email}
                onChange={(e) => setCredenciais({ ...credenciais, email: e.target.value })}
              />
            </div>
            
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="senha"
                name="senha"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={credenciais.senha}
                onChange={(e) => setCredenciais({ ...credenciais, senha: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={carregando}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

