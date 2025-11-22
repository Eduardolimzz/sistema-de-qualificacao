import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../Services/authService';
import styles from './CardEntrar.module.css';

function CardEntrar() {
  const [credenciais, setCredenciais] = useState({
    email: '',
    senha: ''
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const response = await authService.login(credenciais);

      // ✅ USAR 'tipo' em vez de 'role'
      const usuarioTipo = response.tipo || 'aluno';

      // ✅ REDIRECIONAR BASEADO NO TIPO
      if (usuarioTipo === 'admin') {
        navigate('/admin/crud');
      } else if (usuarioTipo === 'professor') {
        navigate('/professor/dashboard');
      } else {
        navigate('/aluno/catalogo'); // ✅ Mudei para catalogo
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setErro(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
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