import React, { useEffect, useState } from 'react';
import { MatriculaProfessorService } from '../../Services/matriculaService';
import AvaliacaoService from '../../Services/avaliacaoService';
import authService from '../../Services/authService';

type Curso = {
  cursoId: string;
  nomecurso: string;
};

type Avaliacao = {
  avaliacaoId: string;
  cursoId: string;
  tituloAvaliacao: string;
  descricaoAvaliacao?: string;
  pesoAvaliacao: number;
  dataCriacao: string;
  curso?: {
    nomecurso: string;
  };
};

const cardStyle: React.CSSProperties = {
  background: '#1f2937',
  borderRadius: 10,
  padding: 16,
  border: '1px solid #111827',
  color: '#e5e7eb'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #374151',
  background: '#111827',
  color: '#e5e7eb'
};

export default function Avaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal de criação/edição
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Avaliacao | null>(null);
  const [cursoSelecionado, setCursoSelecionado] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [peso, setPeso] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);

      const professorId = authService.getProfessorId();
      if (!professorId) {
        setError('Professor não autenticado');
        return;
      }

      // Busca cursos do professor
      const matriculas = await MatriculaProfessorService.listarCursosDoProfessor(professorId);
      const cursosData = matriculas.map(mat => ({
        cursoId: mat.cursoId,
        nomecurso: mat.nomecurso || 'Curso sem nome'
      }));
      setCursos(cursosData);

      // Busca todas as avaliações (filtraremos no frontend pelos cursos do professor)
      const todasAvaliacoes = await AvaliacaoService.listarTodas();
      const cursoIds = cursosData.map(c => c.cursoId);
      const avaliacoesProf = todasAvaliacoes.filter(av => cursoIds.includes(av.cursoId));
      setAvaliacoes(avaliacoesProf);

    } catch (err: any) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar avaliações');
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (avaliacao?: Avaliacao) => {
    if (avaliacao) {
      setEditando(avaliacao);
      setCursoSelecionado(avaliacao.cursoId);
      setTitulo(avaliacao.tituloAvaliacao);
      setDescricao(avaliacao.descricaoAvaliacao || '');
      setPeso(String(avaliacao.pesoAvaliacao));
    } else {
      setEditando(null);
      setCursoSelecionado('');
      setTitulo('');
      setDescricao('');
      setPeso('');
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setEditando(null);
  };

  const salvarAvaliacao = async () => {
    if (!cursoSelecionado || !titulo || !peso) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    const pesoNum = parseFloat(peso);
    if (isNaN(pesoNum) || pesoNum <= 0) {
      alert('Peso deve ser um número maior que zero!');
      return;
    }

    try {
      const dados = {
        cursoId: cursoSelecionado,
        tituloAvaliacao: titulo,
        descricaoAvaliacao: descricao || null,
        pesoAvaliacao: pesoNum
      };

      if (editando) {
        await AvaliacaoService.atualizar(editando.avaliacaoId, dados);
        alert('Avaliação atualizada com sucesso!');
      } else {
        await AvaliacaoService.criarAvaliacao(dados);
        alert('Avaliação criada com sucesso!');
      }

      fecharModal();
      carregarDados();
    } catch (err: any) {
      console.error('Erro ao salvar:', err);
      alert('Erro ao salvar avaliação: ' + (err.response?.data?.message || err.message));
    }
  };

  const deletarAvaliacao = async (avaliacaoId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta avaliação?')) return;

    try {
      await AvaliacaoService.deletar(avaliacaoId);
      alert('Avaliação excluída com sucesso!');
      carregarDados();
    } catch (err: any) {
      console.error('Erro ao deletar:', err);
      alert('Erro ao deletar avaliação');
    }
  };

  const getCursoNome = (cursoId: string) => {
    const curso = cursos.find(c => c.cursoId === cursoId);
    return curso?.nomecurso || 'Curso não encontrado';
  };

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#e5e7eb' }}>
        <p>Carregando avaliações...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#ef4444' }}>
        <p>{error}</p>
        <button onClick={carregarDados} style={{ marginTop: 10, padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div style={{ color: '#e5e7eb', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800 }}>Avaliações</h2>
          <p style={{ color: '#9ca3af', marginTop: 4 }}>Gerencie as avaliações dos seus cursos</p>
        </div>
        <button
          onClick={() => abrirModal()}
          style={{
            padding: '12px 20px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          + Nova Avaliação
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>Total de Avaliações</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{avaliacoes.length}</div>
        </div>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>Cursos com Avaliações</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>
            {new Set(avaliacoes.map(a => a.cursoId)).size}
          </div>
        </div>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>Peso Total</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>
            {avaliacoes.reduce((acc, a) => acc + a.pesoAvaliacao, 0).toFixed(1)}
          </div>
        </div>
      </div>

      {/* Lista de Avaliações */}
      {avaliacoes.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: 'center', padding: 40 }}>
          <p style={{ color: '#9ca3af' }}>Nenhuma avaliação criada ainda.</p>
          <button
            onClick={() => abrirModal()}
            style={{
              marginTop: 16,
              padding: '10px 20px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            Criar Primeira Avaliação
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {avaliacoes.map(av => (
            <div key={av.avaliacaoId} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
                    {av.tituloAvaliacao}
                  </h3>
                  <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 8 }}>
                    {getCursoNome(av.cursoId)}
                  </p>
                  {av.descricaoAvaliacao && (
                    <p style={{ fontSize: 14, color: '#cbd5e1', marginBottom: 8 }}>
                      {av.descricaoAvaliacao}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: 16, fontSize: 14, color: '#9ca3af' }}>
                    <span>Peso: <strong>{av.pesoAvaliacao}</strong></span>
                    <span>Criada em: {new Date(av.dataCriacao).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => abrirModal(av)}
                    style={{
                      padding: '8px 12px',
                      background: '#111827',
                      color: '#e5e7eb',
                      border: '1px solid #374151',
                      borderRadius: 8,
                      cursor: 'pointer'
                    }}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => deletarAvaliacao(av.avaliacaoId)}
                    style={{
                      padding: '8px 12px',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criar/Editar */}
      {modalAberto && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#1f2937',
            borderRadius: 10,
            width: 600,
            maxWidth: '90%',
            border: '1px solid #111827'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #111827',
              fontWeight: 700,
              fontSize: 18
            }}>
              {editando ? 'Editar Avaliação' : 'Nova Avaliação'}
            </div>

            <div style={{ padding: 20 }}>
              <label style={{ display: 'block', fontSize: 14, marginBottom: 6, color: '#9ca3af' }}>
                Curso *
              </label>
              <select
                value={cursoSelecionado}
                onChange={(e) => setCursoSelecionado(e.target.value)}
                style={inputStyle}
                disabled={!!editando}
              >
                <option value="">Selecione um curso</option>
                {cursos.map(c => (
                  <option key={c.cursoId} value={c.cursoId}>
                    {c.nomecurso}
                  </option>
                ))}
              </select>

              <label style={{ display: 'block', fontSize: 14, marginTop: 16, marginBottom: 6, color: '#9ca3af' }}>
                Título *
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Prova 1, Trabalho Final, etc."
                style={inputStyle}
              />

              <label style={{ display: 'block', fontSize: 14, marginTop: 16, marginBottom: 6, color: '#9ca3af' }}>
                Descrição
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descrição opcional da avaliação"
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />

              <label style={{ display: 'block', fontSize: 14, marginTop: 16, marginBottom: 6, color: '#9ca3af' }}>
                Peso *
              </label>
              <input
                type="number"
                step="0.1"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                placeholder="Ex: 1.0, 2.5, etc."
                style={inputStyle}
              />

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button
                  onClick={fecharModal}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'transparent',
                    color: '#e5e7eb',
                    border: '1px solid #374151',
                    borderRadius: 8,
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarAvaliacao}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  {editando ? 'Salvar Alterações' : 'Criar Avaliação'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}