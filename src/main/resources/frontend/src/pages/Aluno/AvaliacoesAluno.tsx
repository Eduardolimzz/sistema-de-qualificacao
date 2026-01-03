import { useState, useEffect } from 'react';
import authService from '../../Services/authService';
import AvaliacaoService from '../../Services/avaliacaoService';
import MatriculaService from '../../Services/matriculaService';

type Avaliacao = {
  avaliacaoId: string;
  cursoId: string;
  tituloAvaliacao: string;
  descricaoAvaliacao?: string;
  pesoAvaliacao: number;
  nomeCurso?: string;
  jaRespondeu?: boolean;
  nota?: number | null;
  status?: string;
  respostaId?: string;
};

const cardStyle: React.CSSProperties = {
  background: '#1f2937',
  borderRadius: 10,
  padding: 20,
  border: '1px solid #111827',
  color: '#e5e7eb'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: 8,
  border: '1px solid #374151',
  background: '#111827',
  color: '#e5e7eb',
  fontSize: 14
};

export default function AvaliacoesAluno() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState<Avaliacao | null>(null);
  const [resposta, setResposta] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    carregarAvaliacoes();
  }, []);

  const carregarAvaliacoes = async () => {
    try {
      setLoading(true);
      setError(null);

      const alunoId = authService.getAlunoId();
      console.log('🔍 Aluno ID:', alunoId);

      if (!alunoId) {
        setError('Aluno não autenticado');
        return;
      }

      // 1. Busca cursos do aluno
      const matriculas = await MatriculaService.listarCursosDoAluno(alunoId);
      const cursoIds = matriculas.map(m => m.cursoId);

      if (cursoIds.length === 0) {
        setAvaliacoes([]);
        setLoading(false);
        return;
      }

      // 2. Busca todas as avaliações
      const todasAvaliacoes = await AvaliacaoService.listarTodas();

      // 3. Filtra apenas dos cursos do aluno
      const avaliacoesDoAluno = todasAvaliacoes.filter(av =>
        cursoIds.includes(av.cursoId)
      );

      // 4. ✅ Busca respostas do aluno
      const respostasResponse = await fetch(`http://localhost:8080/v1/respostas-avaliacoes/aluno/${alunoId}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });

      let respostasDoAluno = [];
      if (respostasResponse.ok) {
        respostasDoAluno = await respostasResponse.json();
      }

      console.log('📝 Respostas do aluno:', respostasDoAluno);

      // 5. ✅ Combina avaliações com respostas
      const avaliacoesComStatus = avaliacoesDoAluno.map(av => {
        const matricula = matriculas.find(m => m.cursoId === av.cursoId);
        const resposta = respostasDoAluno.find(r => r.avaliacaoId === av.avaliacaoId);

        return {
          ...av,
          nomeCurso: matricula?.nomecurso || 'Curso não encontrado',
          jaRespondeu: !!resposta,
          nota: resposta?.notaObtida || null,
          status: resposta?.statusResposta || 'PENDENTE',
          respostaId: resposta?.respostaAvaliacaoId
        };
      });

      console.log('✅ Avaliações processadas:', avaliacoesComStatus);
      setAvaliacoes(avaliacoesComStatus);

    } catch (err: any) {
      console.error('❌ Erro ao carregar avaliações:', err);
      setError('Erro ao carregar avaliações');
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (avaliacao: Avaliacao) => {
    if (avaliacao.jaRespondeu) {
      alert('Você já respondeu esta avaliação!');
      return;
    }
    setAvaliacaoSelecionada(avaliacao);
    setResposta('');
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setAvaliacaoSelecionada(null);
    setResposta('');
  };

  const enviarResposta = async () => {
    if (!avaliacaoSelecionada || !resposta.trim()) {
      alert('Por favor, escreva sua resposta!');
      return;
    }

    const alunoId = authService.getAlunoId();
    if (!alunoId) {
      alert('Erro: Aluno não identificado');
      return;
    }

    setEnviando(true);

    try {
      const dados = {
        avaliacaoId: avaliacaoSelecionada.avaliacaoId,
        alunoId: alunoId,
        textoResposta: resposta
      };

      console.log('📤 Enviando resposta:', dados);

      const response = await fetch('http://localhost:8080/v1/respostas-avaliacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify(dados)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro do servidor:', errorText);
        throw new Error('Erro ao enviar resposta');
      }

      alert('✅ Resposta enviada com sucesso! Aguarde a correção do professor.');
      fecharModal();

      // ✅ Recarrega as avaliações para atualizar o status
      await carregarAvaliacoes();

    } catch (err: any) {
      console.error('❌ Erro ao enviar:', err);
      alert('Erro: ' + (err.message || 'Não foi possível enviar a resposta'));
    } finally {
      setEnviando(false);
    }
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
        <button
          onClick={carregarAvaliacoes}
          style={{
            marginTop: 10,
            padding: '8px 16px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  const avaliacoesPendentes = avaliacoes.filter(a => !a.jaRespondeu);
  const avaliacoesRealizadas = avaliacoes.filter(a => a.jaRespondeu);

  return (
    <div style={{ color: '#e5e7eb', padding: 20 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Minhas Avaliações</h2>
      <p style={{ color: '#9ca3af', marginBottom: 24 }}>
        Realize as avaliações dos seus cursos
      </p>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        <div style={{ ...cardStyle, textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>Total</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{avaliacoes.length}</div>
        </div>
        <div style={{ ...cardStyle, textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>Pendentes</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#f59e0b' }}>
            {avaliacoesPendentes.length}
          </div>
        </div>
        <div style={{ ...cardStyle, textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>Realizadas</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#10b981' }}>
            {avaliacoesRealizadas.length}
          </div>
        </div>
      </div>

      {/* Avaliações Pendentes */}
      {avaliacoesPendentes.length > 0 && (
        <>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
            📝 Avaliações Pendentes
          </h3>
          <div style={{ display: 'grid', gap: 16, marginBottom: 32 }}>
            {avaliacoesPendentes.map(av => (
              <div key={av.avaliacaoId} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
                      {av.tituloAvaliacao}
                    </h4>
                    <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 8 }}>
                      {av.nomeCurso}
                    </p>
                    {av.descricaoAvaliacao && (
                      <p style={{ fontSize: 14, color: '#cbd5e1', marginBottom: 8 }}>
                        {av.descricaoAvaliacao}
                      </p>
                    )}
                    <div style={{ fontSize: 14, color: '#9ca3af' }}>
                      Peso: <strong>{av.pesoAvaliacao}</strong>
                    </div>
                  </div>
                  <button
                    onClick={() => abrirModal(av)}
                    style={{
                      padding: '10px 20px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Responder
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Avaliações Realizadas */}
      {avaliacoesRealizadas.length > 0 && (
        <>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
            ✅ Avaliações Realizadas
          </h3>
          <div style={{ display: 'grid', gap: 16 }}>
            {avaliacoesRealizadas.map(av => (
              <div key={av.avaliacaoId} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
                      {av.tituloAvaliacao}
                    </h4>
                    <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 8 }}>
                      {av.nomeCurso}
                    </p>
                    <div style={{ fontSize: 14, display: 'flex', gap: 16, alignItems: 'center' }}>
                      <span>
                        Status: <span style={{
                          color: av.status === 'CONCLUIDA' ? '#10b981' : '#f59e0b',
                          fontWeight: 600
                        }}>
                          {av.status === 'CONCLUIDA' ? 'Corrigida' : 'Aguardando Correção'}
                        </span>
                      </span>
                      {av.nota !== null && av.nota !== undefined && (
                        <span>
                          Nota: <strong style={{ fontSize: 18, color: '#60a5fa' }}>{av.nota.toFixed(1)}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Mensagem vazia */}
      {avaliacoes.length === 0 && (
        <div style={{ ...cardStyle, textAlign: 'center', padding: 60 }}>
          <p style={{ fontSize: 18, color: '#9ca3af', marginBottom: 12 }}>
            Nenhuma avaliação disponível no momento
          </p>
          <p style={{ fontSize: 14, color: '#6b7280' }}>
            Aguarde seu professor criar avaliações para seus cursos
          </p>
        </div>
      )}

      {/* Modal de Responder */}
      {modalAberto && avaliacaoSelecionada && (
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
            width: 700,
            maxWidth: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            border: '1px solid #111827'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #111827',
              position: 'sticky',
              top: 0,
              background: '#1f2937',
              zIndex: 1
            }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
                {avaliacaoSelecionada.tituloAvaliacao}
              </h3>
              <p style={{ fontSize: 14, color: '#9ca3af' }}>
                {avaliacaoSelecionada.nomeCurso}
              </p>
            </div>

            <div style={{ padding: 20 }}>
              {avaliacaoSelecionada.descricaoAvaliacao && (
                <div style={{
                  background: '#111827',
                  padding: 16,
                  borderRadius: 8,
                  marginBottom: 20,
                  border: '1px solid #374151'
                }}>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>
                    Instruções:
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.6 }}>
                    {avaliacaoSelecionada.descricaoAvaliacao}
                  </p>
                </div>
              )}

              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                Sua Resposta *
              </label>
              <textarea
                value={resposta}
                onChange={(e) => setResposta(e.target.value)}
                placeholder="Digite sua resposta aqui..."
                rows={12}
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
              />

              <div style={{
                display: 'flex',
                gap: 12,
                marginTop: 20,
                paddingTop: 20,
                borderTop: '1px solid #111827'
              }}>
                <button
                  onClick={fecharModal}
                  disabled={enviando}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'transparent',
                    color: '#e5e7eb',
                    border: '1px solid #374151',
                    borderRadius: 8,
                    cursor: enviando ? 'not-allowed' : 'pointer',
                    opacity: enviando ? 0.5 : 1
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={enviarResposta}
                  disabled={enviando || !resposta.trim()}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: enviando || !resposta.trim() ? '#374151' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: enviando || !resposta.trim() ? 'not-allowed' : 'pointer',
                    fontWeight: 600
                  }}
                >
                  {enviando ? 'Enviando...' : 'Enviar Resposta'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}