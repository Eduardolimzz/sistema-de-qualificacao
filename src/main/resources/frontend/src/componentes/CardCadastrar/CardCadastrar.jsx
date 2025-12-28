import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlunoService from '../../Services/alunoService';
import ProfessorService from '../../Services/professorService';
import styles from './CardCadastrar.module.css';

// ============================================
// PROPS DO COMPONENTE
// ============================================
// MOTIVO: Permite usar o mesmo componente para aluno E professor
// PESQUISE: "react props tutorial"
// FONTE: https://react.dev/learn/passing-props-to-a-component

function CardCadastrar({ tipo = 'aluno' }) {
  // tipo pode ser 'aluno' ou 'professor'

  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    nivelExperiencia: '', // Só para aluno
    senha: '',
    confirmarSenha: '',
    termos: false,
  });

  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  // ============================================
  // MANIPULADOR DE MUDANÇAS
  // ============================================
  // MOTIVO: Atualiza o estado quando usuário digita
  // PESQUISE: "react controlled components"

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ============================================
  // VALIDAÇÕES
  // ============================================

  const validarFormulario = () => {
    // Senhas devem coincidir
    if (formData.senha !== formData.confirmarSenha) {
      setErro('As senhas não coincidem!');
      return false;
    }

    // Senha mínima de 6 caracteres
    if (formData.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }

    // Termos devem ser aceitos
    if (!formData.termos) {
      setErro('Você precisa aceitar os Termos de Uso.');
      return false;
    }

    // Validação específica para aluno
    if (tipo === 'aluno' && formData.nivelExperiencia === '') {
      setErro('Por favor, selecione seu nível de experiência.');
      return false;
    }

    return true;
  };

  // ============================================
  // SUBMIT DO FORMULÁRIO
  // ============================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    // Valida antes de enviar
    if (!validarFormulario()) {
      return;
    }

    setCarregando(true);

    try {
      // ============================================
      // CADASTRO DIFERENTE PARA ALUNO E PROFESSOR
      // ============================================
      // PESQUISE: "javascript conditional execution"

      if (tipo === 'aluno') {
        // Cadastra como aluno
        const dadosAluno = {
          nome: formData.nomeCompleto,
          email: formData.email,
          senha: formData.senha,
        };

        await AlunoService.criar(dadosAluno);
        alert('✅ Aluno cadastrado com sucesso!');

      } else {
        // Cadastra como professor
        const dadosProfessor = {
          nome: formData.nomeCompleto,
          email: formData.email,
          senha: formData.senha,
        };

        await ProfessorService.criar(dadosProfessor);
        alert('✅ Professor cadastrado com sucesso!');
      }

      // Redireciona para login
      navigate('/login');

    } catch (error) {
      console.error('Erro ao cadastrar:', error);

      // Trata mensagens de erro do backend
      const mensagemErro =
        error.response?.data?.mensagem ||
        error.response?.data?.message ||
        error.message ||
        'Erro ao tentar cadastrar. Tente outro e-mail.';

      setErro(mensagemErro);
    } finally {
      setCarregando(false);
    }
  };

  // ============================================
  // RENDERIZAÇÃO
  // ============================================

  return (
    <div className={styles.cardCadastro}>

      {/* Título muda baseado no tipo */}
      <h2>
        {tipo === 'aluno' ? '🧑‍🎓 Cadastro de Aluno' : '👨‍🏫 Cadastro de Professor'}
      </h2>

      {/* Mensagem de erro */}
      {erro && (
        <div className={styles.errorMessage}>
          ⚠️ {erro}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>

        {/* Nome Completo */}
        <div className={styles.inputGroup}>
          <label htmlFor="nomeCompleto">Nome Completo *</label>
          <input
            type="text"
            id="nomeCompleto"
            name="nomeCompleto"
            value={formData.nomeCompleto}
            onChange={handleChange}
            disabled={carregando}
            required
            placeholder={tipo === 'aluno' ? 'Seu nome completo' : 'Nome do professor'}
          />
        </div>

        {/* E-mail */}
        <div className={styles.inputGroup}>
          <label htmlFor="email">E-mail *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={carregando}
            required
            placeholder="seu@email.com"
          />
        </div>

        {/* ============================================ */}
        {/* CAMPO CONDICIONAL - SÓ PARA ALUNO */}
        {/* ============================================ */}
        {/* PESQUISE: "react conditional rendering" */}

        {tipo === 'aluno' && (
          <div className={styles.inputGroup}>
            <label htmlFor="nivelExperiencia">Nível de Experiência *</label>
            <select
              id="nivelExperiencia"
              name="nivelExperiencia"
              value={formData.nivelExperiencia}
              onChange={handleChange}
              disabled={carregando}
              required
            >
              <option value="">Selecione seu nível</option>
              <option value="iniciante">🌱 Iniciante</option>
              <option value="intermediario">📚 Intermediário</option>
              <option value="avancado">🚀 Avançado</option>
            </select>
          </div>
        )}

        {/* Senha */}
        <div className={styles.inputGroup}>
          <label htmlFor="senha">Senha *</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            disabled={carregando}
            required
            placeholder="Mínimo 6 caracteres"
            minLength={6}
          />
        </div>

        {/* Confirmar Senha */}
        <div className={styles.inputGroup}>
          <label htmlFor="confirmarSenha">Confirmar a Senha *</label>
          <input
            type="password"
            id="confirmarSenha"
            name="confirmarSenha"
            value={formData.confirmarSenha}
            onChange={handleChange}
            disabled={carregando}
            required
            placeholder="Digite a senha novamente"
          />
        </div>

        {/* Checkbox Termos */}
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

        {/* Botão Submit */}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={carregando}
        >
          {carregando ? 'Criando...' : 'Criar conta'}
        </button>

        {/* Link para trocar tipo */}
        <div className={styles.switchTypeLink} style={{ marginTop: '16px', textAlign: 'center' }}>
          {tipo === 'aluno' ? (
            <p>
              É professor? <a href="/cadastro/professor">Cadastre-se aqui</a>
            </p>
          ) : (
            <p>
              É aluno? <a href="/cadastro">Cadastre-se aqui</a>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default CardCadastrar;