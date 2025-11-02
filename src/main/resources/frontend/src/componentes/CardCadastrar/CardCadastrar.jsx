import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlunoService from '../../Services/alunoService';
import styles from './CardCadastrar.module.css';

function CardCadastrar() {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    nivelExperiencia: '',
    senha: '',
    confirmarSenha: '',
    termos: false // Para o checkbox
  });

  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  // Função para atualizar o state
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    // --- Validações do Frontend ---
    if (formData.senha !== formData.confirmarSenha) {
      setErro('As senhas não coincidem!');
      return;
    }
    if (!formData.termos) {
      setErro('Você precisa aceitar os Termos de Uso.');
      return;
    }
    if (formData.nivelExperiencia === '') {
        setErro('Por favor, selecione seu nível de experiência.');
        return;
    }

    setCarregando(true);

try {

      const dadosParaEnviar = {
        nomealuno: formData.nomeCompleto,
        emailaluno: formData.email,
        senhaaluno: formData.senha
      };


      await AlunoService.cadastrar(dadosParaEnviar);

      navigate('/login');

    } catch (error) {
      setErro(error.response?.data?.mensagem || 'Erro ao tentar cadastrar. Tente outro e-mail.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.cardCadastro}>

      <h2>Cadastrar</h2>

      {erro && (
        <div className={styles.errorMessage}>
          {erro}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>

        {/* --- Nome Completo --- */}
        <div className={styles.inputGroup}>
          <label htmlFor="nomeCompleto">Nome Completo</label>
          <input
            type="text"
            id="nomeCompleto"
            name="nomeCompleto"
            value={formData.nomeCompleto}
            onChange={handleChange}
            disabled={carregando}
            required
          />
        </div>

        {/* --- E-mail --- */}
        <div className={styles.inputGroup}>
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={carregando}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="nivelExperiencia">Nível de Experiência</label>
          <select
            id="nivelExperiencia"
            name="nivelExperiencia"
            value={formData.nivelExperiencia}
            onChange={handleChange}
            disabled={carregando}
            required
          >
            <option value="" disabled>Selecione seu nível</option>
            <option value="iniciante">Iniciante</option>
            <option value="intermediario">Intermediário</option>
            <option value="avancado">Avançado</option>
          </select>
        </div>

        {/* --- Senha --- */}
        <div className={styles.inputGroup}>
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            disabled={carregando}
            required
          />
        </div>

        {/* --- Confirmar Senha --- */}
        <div className={styles.inputGroup}>
          <label htmlFor="confirmarSenha">Confirmar a Senha</label>
          <input
            type="password"
            id="confirmarSenha"
            name="confirmarSenha"
            value={formData.confirmarSenha}
            onChange={handleChange}
            disabled={carregando}
            required
          />
        </div>

        {/* --- Checkbox Termos --- */}
        <div className={styles.termsCheckbox}>
          <input
            type="checkbox"
            id="termos"
            name="termos"
            checked={formData.termos}
            onChange={handleChange}
            disabled={carregando}
          />
          <label htmlFor="termos">
            Eu concordo com os <span>Termos de Uso</span> e <span>Política de Privacidade</span>
          </label>
        </div>

        {/* --- Botão Criar Conta --- */}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={carregando}
        >
          {carregando ? 'Criando...' : 'Criar conta'}
        </button>

      </form>
    </div>
  );
}

export default CardCadastrar;