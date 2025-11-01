import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../Services/authService';
import styles from './CardEntrar.module.css';

function CardEntrar() {
  // --- Lógica de State  ---
  const [credenciais, setCredenciais] = useState({
    email: '',
    senha: ''
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  // --- Lógica de Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const response = await authService.login(credenciais);

      const usuarioRole = response.role || 'aluno';

      if (usuarioRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (usuarioRole === 'professor') {
        navigate('/professor/dashboard');
      } else {
        navigate('/aluno/dashboard');
      }
    } catch (error) {
      setErro(error.response?.data?.mensagem || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      // Garante que o carregando pare, mesmo se der erro
      setCarregando(false);
    }
  };

  return (
    <div className={styles.cardEntrar}>

      <h2>Entrar</h2>

      {erro && (
        <div className={styles.errorMessage}>
          {erro}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>

        {/* --- Grupo E-mail (conectado ao state) --- */}
        <div className={styles.inputGroup}>
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={credenciais.email}
            onChange={(e) => setCredenciais({ ...credenciais, email: e.target.value })}
            disabled={carregando}
          />
        </div>

        {/* --- Grupo Senha (conectado ao state) --- */}
        <div className={styles.inputGroup}>
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={credenciais.senha}
            onChange={(e) => setCredenciais({ ...credenciais, senha: e.target.value })}
            disabled={carregando}
          />
        </div>

        {/* --- Opções (Lembrar e Esqueceu) --- */}
        <div className={styles.options}>
          <div className={styles.rememberMe}>
            <input
              type="checkbox"
              id="remember"
              name="remember"
              disabled={carregando}
            />
            <label htmlFor="remember">Lembrar de mim</label>
          </div>
          <a href="#">Esqueceu a senha?</a>
        </div>

        {/* --- Botão Entrar (conectado ao state) --- */}
        <button
          type="submit"
          className={styles.loginButton}
          disabled={carregando}
        >
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>

         <div className={styles.cadastroLink}>
             <span>Não tem conta? </span>
             <a href="/cadastro">Faça seu cadastro!</a>
             </div>

      </form>
    </div>
  );
}

export default CardEntrar;