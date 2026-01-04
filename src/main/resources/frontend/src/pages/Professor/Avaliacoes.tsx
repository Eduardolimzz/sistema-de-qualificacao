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

type RespostaAvaliacao = {
  respostaAvaliacaoId: string;
  avaliacaoId: string;
  alunoId: string;
  nomeAluno?: string;
  emailAluno?: string;
  textoResposta: string;
  notaObtida?: number | null;
  statusResposta: string;
  dataInicio: string;
  dataConclusao?: string;
  tituloAvaliacao?: string;
  nomeCurso?: string;
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
  const [respostas, setRespostas] = useState<RespostaAvaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<'avaliacoes' | 'correcoes'>('avaliacoes');

  // Modal de criação/edição de avaliação
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Avaliacao | null>(null);
  const [cursoSelecionado, setCursoSelecionado] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [peso, setPeso] = useState('');

  // Modal de correção
  const [modalCorrecao, setModalCorrecao] = useState(false);
  const [respostaSelecionada, setRespostaSelecionada] = useState<RespostaAvaliacao | null>(null);
  const [nota, setNota] = useState('');
  const [corrigindo, setCorrigindo] = useState(false);

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

      // Busca avaliações
      const todasAvaliacoes = await AvaliacaoService.listarTodas();
      const cursoIds = cursosData.map(c => c.cursoId);
      const avaliacoesProf = todasAvaliacoes.filter(av => cursoIds.includes(av.cursoId));
      setAvaliacoes(avaliacoesProf);

      // ✅ Busca respostas pendentes
      const respostasResponse = await fetch('http://localhost:8080/v1/respostas-avaliacoes/pendentes', {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });

      if (respostasResponse.ok) {
        const todasRespostas = await respostasResponse.json();
        // Filtra apenas respostas das avaliações do professor
        const avaliacaoIds = avaliacoesProf.map(a => a.avaliacaoId);
        const respostasProf = todasRespostas.filter(r => avaliacaoIds.includes(r.avaliacaoId));
        setRespostas(respostasProf);
      }

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

  // ✅ Funções de correção
  const abrirModalCorrecao = (resposta: RespostaAvaliacao) => {
    setRespostaSelecionada(resposta);
    setNota(resposta.notaObtida?.toString() || '');
    setModalCorrecao(true);
  };

  const fecharModalCorrecao = () => {
    setModalCorrecao(false);
    setRespostaSelecionada(null);
    setNota('');
  };

  const lancarNota = async () => {
    if (!respostaSelecionada) return;

    const notaNum = parseFloat(nota);
    if (isNaN(notaNum) || notaNum < 0 || notaNum > 10) {
      alert('Nota deve ser um número entre 0 e 10!');
      return;
    }

    setCorrigindo(true);

    try {
      const response = await fetch(
        `http://localhost:8080/v1/respostas-avaliacoes/${respostaSelecionada.respostaAvaliacaoId}/nota`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authService.getToken()}`
          },
          body: JSON.stringify({ notaObtida: notaNum })
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao lançar nota');
      }

      alert('✅ Nota lançada com sucesso!');
      fecharModalCorrecao();
      carregarDados();

    } catch (err: any) {
      console.error('Erro ao lançar nota:', err);
      alert('Erro ao lançar nota: ' + err.message);
    } finally {
      setCorrigindo(false);
    }
  };

  const getCursoNome = (cursoId: string) => {
    const curso = cursos.find(c => c.cursoId === cursoId);
    return curso?.nomecurso || 'Curso não encontrado';
  };

  const getAvaliacaoTitulo = (avaliacaoId: string) => {
    const avaliacao = avaliacoes.find(a => a.avaliacaoId === avaliacaoId);
    return avaliacao?.tituloAvaliacao || 'Avaliação';
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
          <p style={{ color: '#9ca3af', marginTop: 4 }}>Gerencie avaliações e corrija respostas</p>
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

      {/* Abas */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, borderBottom: '2px solid #374151' }}>
        <button
          onClick={() => setAbaAtiva('avaliacoes')}
          style={{
            padding: '12px 24px',
            background: 'transparent',
            color: abaAtiva === 'avaliacoes' ? '#3b82f6' : '#9ca3af',
            border: 'none',
            borderBottom: abaAtiva === 'avaliacoes' ? '2px solid #3b82f6' : '2px solid transparent',
            cursor: 'pointer',
            fontWeight: 600,
            marginBottom: -2
          }}
        >
          Minhas Avaliações ({avaliacoes.length})
        </button>
        <button
          onClick={() => setAbaAtiva('correcoes')}
          style={{
            padding: '12px 24px',
            background: 'transparent',
            color: abaAtiva === 'correcoes' ? '#3b82f6' : '#9ca3af',
            border: 'none',
            borderBottom: abaAtiva === 'correcoes' ? '2px solid #3b82f6' : '2px solid transparent',
            cursor: 'pointer',
            fontWeight: 600,
            marginBottom: -2
          }}
        >
          Correções Pendentes ({respostas.length})
        </button>
      </div>

      {/* ===================== ABA AVALIAÇÕES ===================== */}
      {abaAtiva === 'avaliacoes' && (
        <>
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
        </>
      )}

      {/* ===================== ABA CORREÇÕES ===================== */}
      {abaAtiva === 'correcoes' && (
        <>
          {respostas.length === 0 ? (
            <div style={{ ...cardStyle, textAlign: 'center', padding: 60 }}>
              <p style={{ fontSize: 18, color: '#9ca3af', marginBottom: 12 }}>
                Nenhuma resposta pendente de correção
              </p>
              <p style={{ fontSize: 14, color: '#6b7280' }}>
                As respostas dos alunos aparecerão aqui para você corrigir
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 16 }}>
              {respostas.map(resp => (
                <div key={resp.respostaAvaliacaoId} style={cardStyle}>
                  <div style={{ marginBottom: 12 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
                      {getAvaliacaoTitulo(resp.avaliacaoId)}
                    </h3>
                    <div style={{ fontSize: 14, color: '#9ca3af' }}>
                      Aluno: <strong style={{ color: '#e5e7eb' }}>{resp.nomeAluno || 'Nome não disponível'}</strong>
                    </div>
                    {resp.emailAluno && (
                      <div style={{ fontSize: 14, color: '#9ca3af' }}>
                        Email: {resp.emailAluno}
                      </div>
                    )}
                    <div style={{ fontSize: 14, color: '#9ca3af', marginTop: 4 }}>
                      Enviado em: {new Date(resp.dataConclusao || resp.dataInicio).toLocaleString('pt-BR')}
                    </div>
                  </div>

                  <div style={{
                    background: '#111827',
                    padding: 16,
                    borderRadius: 8,
                    marginBottom: 12,
                    border: '1px solid #374151'
                  }}>
                    <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>Resposta do aluno:</div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {resp.textoResposta}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => abrirModalCorrecao(resp)}
                      style={{
                        padding: '10px 20px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      Lançar Nota
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ===================== MODAL CRIAR/EDITAR AVALIAÇÃO ===================== */}
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

      {/* ===================== MODAL LANÇAR NOTA ===================== */}
      {modalCorrecao && respostaSelecionada && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
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
              Lançar Nota
            </div>

            <div style={{ padding: 20 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, color: '#9ca3af' }}>Aluno:</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{respostaSelecionada.nomeAluno}</div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, color: '#9ca3af' }}>Avaliação:</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{getAvaliacaoTitulo(respostaSelecionada.avaliacaoId)}</div>
              </div>

              <div style={{
                background: '#111827',
                padding: 16,
                borderRadius: 8,
                marginBottom: 16,
                border: '1px solid #374151',
                maxHeight: 200,
                overflow: 'auto'
              }}>
                <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>Resposta:</div>
                <p style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {respostaSelecionada.textoResposta}
                </p>
              </div>

              <label style={{ display: 'block', fontSize: 14, marginBottom: 8, fontWeight: 600 }}>
                Nota (0 a 10) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                placeholder="Ex: 8.5"
                style={{ ...inputStyle, fontSize: 18, fontWeight: 600 }}
                autoFocus
              />

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button
                  onClick={fecharModalCorrecao}
                  disabled={corrigindo}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'transparent',
                    color: '#e5e7eb',
                    border: '1px solid #374151',
                    borderRadius: 8,
                    cursor: corrigindo ? 'not-allowed' : 'pointer',
                    opacity: corrigindo ? 0.5 : 1
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={lancarNota}
                  disabled={corrigindo || !nota}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: corrigindo || !nota ? '#374151' : '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: corrigindo || !nota ? 'not-allowed' : 'pointer',
                    fontWeight: 600
                  }}
                >
                  {corrigindo ? 'Salvando...' : 'Lançar Nota'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}