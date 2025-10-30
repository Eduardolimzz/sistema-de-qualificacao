import React, { useEffect, useMemo, useState } from 'react';

type Situacao = 'Aprovado' | 'Reprovado' | 'Pendente';

type AvaliacaoItem = {
  id: string;
  aluno: string;
  email: string;
  curso: string;
  nota: number; // 0-10
  frequencia: number; // 0-100
  situacao: Situacao;
  observacoes?: string;
};

const TOTAL_ALUNOS = 89;
const avaliacoesMock: AvaliacaoItem[] = (() => {
  const primeiros = ['Ana', 'Bruno', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda', 'Gabriel', 'Helena', 'Igor', 'Juliana', 'Kleber', 'Larissa', 'Marcos', 'Nathalia', 'Otávio', 'Patrícia', 'Rafael', 'Sabrina', 'Tiago', 'Úrsula', 'Vitor', 'Wesley', 'Xavier', 'Yasmin', 'Zilda'];
  const sobrenomes = ['Almeida', 'Barbosa', 'Cardoso', 'Dantas', 'Esteves', 'Ferraz', 'Gomes', 'Henrique', 'Ibrahim', 'Jesus', 'Klein', 'Lima', 'Macedo', 'Nascimento', 'Oliveira', 'Pereira', 'Queiroz', 'Ribeiro', 'Souza', 'Teixeira', 'Uchoa', 'Vasconcelos', 'Werneck', 'Ximenes', 'Yamada', 'Zanetti'];
  const cursos = ['Desenvolvimento Web com React', 'TypeScript Avançado', 'Fundamentos de JavaScript', 'Banco de Dados', 'DevOps'];
  const situacoes: Situacao[] = ['Aprovado', 'Reprovado', 'Pendente'];
  const itens: AvaliacaoItem[] = [];
  for (let i = 0; i < TOTAL_ALUNOS; i++) {
    const nome = `${primeiros[i % primeiros.length]} ${sobrenomes[i % sobrenomes.length]}`;
    const situacao = situacoes[i % situacoes.length]; // balanceado ~ 30/30/29
    let nota = 0;
    if (situacao === 'Aprovado') nota = Number((6 + (i % 40) / 10).toFixed(1)); // 6.0 - 9.9
    if (situacao === 'Reprovado') nota = Number(((i % 50) / 10).toFixed(1)); // 0.0 - 4.9
    if (situacao === 'Pendente') nota = 0;
    const frequencia = 60 + (i * 3) % 41; // 60% a 100%
    const observacoes =
      situacao === 'Aprovado'
        ? 'Excelente desempenho no projeto final'
        : situacao === 'Reprovado'
          ? 'Precisa revisar os fundamentos básicos'
          : 'Avaliação pendente de aplicação';
    itens.push({
      id: String(i + 1),
      aluno: nome,
      email: `${nome.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      curso: cursos[(i + 1) % cursos.length],
      nota,
      frequencia,
      situacao,
      observacoes
    });
  }
  return itens;
})();

function getSituacaoColor(s: Situacao): string {
  if (s === 'Aprovado') return '#10b981';
  if (s === 'Reprovado') return '#ef4444';
  return '#f59e0b';
}

const STORAGE_KEY = 'prof_avaliacoes_v1';

export default function Avaliacoes() {
  const [itens, setItens] = useState<AvaliacaoItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return avaliacoesMock;
  });
  const [mostrarBoletim, setMostrarBoletim] = useState<AvaliacaoItem | null>(null);
  const [editando, setEditando] = useState<AvaliacaoItem | null>(null);
  const [novaNota, setNovaNota] = useState<string>('');
  const [novaFrequencia, setNovaFrequencia] = useState<string>('');
  const [novaObs, setNovaObs] = useState<string>('');

  const total = itens.length; // 89
  const aprovados = useMemo(() => itens.filter(a => a.situacao === 'Aprovado').length, [itens]);
  const reprovados = useMemo(() => itens.filter(a => a.situacao === 'Reprovado').length, [itens]);
  const pendentes = useMemo(() => itens.filter(a => a.situacao === 'Pendente').length, [itens]);
  const mediaGeral = useMemo(() => Number((itens.reduce((acc, a) => acc + a.nota, 0) / Math.max(total, 1)).toFixed(1)), [itens, total]);

  const kpiCard: React.CSSProperties = { background: '#1f2937', borderRadius: 10, padding: 12, textAlign: 'center', color: '#e5e7eb', border: '1px solid #111827' };
  const kpiLabel: React.CSSProperties = { fontSize: 12, color: '#9ca3af' };
  const kpiValue: React.CSSProperties = { fontSize: 18, fontWeight: 800 };
  const cardStyle: React.CSSProperties = { background: '#1f2937', borderRadius: 10, padding: 16, border: '1px solid #111827' };

  return (
    <div style={{ color: '#e5e7eb' }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center' }}>Avaliações</h2>
      <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: 4 }}>Gerencie as avaliações e notas dos seus alunos</p>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 16, marginTop: 16 }}>
        <div style={kpiCard}>
          <div style={kpiLabel}>Total de Alunos</div>
          <div style={kpiValue}>{total}</div>
        </div>
        <div style={kpiCard}>
          <div style={kpiLabel}>Aprovados</div>
          <div style={kpiValue}>{aprovados}</div>
        </div>
        <div style={kpiCard}>
          <div style={kpiLabel}>Reprovados</div>
          <div style={kpiValue}>{reprovados}</div>
        </div>
        <div style={kpiCard}>
          <div style={kpiLabel}>Pendentes</div>
          <div style={kpiValue}>{pendentes}</div>
        </div>
        <div style={kpiCard}>
          <div style={kpiLabel}>Média Geral</div>
          <div style={kpiValue}>{mediaGeral.toFixed(1)}</div>
        </div>
      </div>

      {/* Lista */}
      <div style={{ display: 'grid', gap: 18, marginTop: 18 }}>
        {itens.map((av) => (
          <div key={av.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700 }}>{av.aluno}</div>
              <div style={{ fontWeight: 800 }}>Nota: {av.nota}</div>
            </div>
            <div style={{ color: getSituacaoColor(av.situacao), fontSize: 12, marginTop: 2 }}>{av.situacao}</div>
            <div style={{ color: '#9ca3af', fontSize: 12 }}>{av.email}</div>
            <div style={{ marginTop: 8, color: '#cbd5e1' }}>{av.curso}</div>

            <div style={{ marginTop: 12 }}>
              <div style={{ color: '#9ca3af', fontSize: 12 }}>Observações</div>
              <div style={{ fontSize: 14 }}>{av.observacoes || '—'}</div>
            </div>

            <div style={{ marginTop: 12, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setMostrarBoletim(av)}
                style={{ padding: '8px 10px', borderRadius: 8, background: '#111827', color: '#e5e7eb', border: '1px solid #1f2937', cursor: 'pointer' }}
              >
                Boletim
              </button>
              <button
                onClick={() => { setEditando(av); setNovaNota(String(av.nota)); setNovaFrequencia(String(av.frequencia)); setNovaObs(av.observacoes || ''); }}
                style={{ padding: '8px 10px', borderRadius: 8, background: '#111827', color: '#e5e7eb', border: '1px solid #1f2937', cursor: 'pointer' }}
              >
                Avaliar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Boletim (somente leitura) */}
      {mostrarBoletim && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 2000 }}>
          <div style={{ background: '#1f2937', borderRadius: 10, width: 480, maxWidth: '90%', border: '1px solid #111827' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #111827', color: '#e5e7eb', fontWeight: 700 }}>Boletim - {mostrarBoletim.aluno}</div>
            <div style={{ padding: 16, color: '#e5e7eb' }}>
              <div style={{ display: 'grid', gap: 8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', color: '#9ca3af', fontSize: 12 }}>
                  <span>Disciplina</span>
                  <span style={{ textAlign: 'right' }}>Nota</span>
                  <span style={{ textAlign: 'right' }}>Frequência</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', alignItems: 'center', background: '#111827', padding: '10px 12px', borderRadius: 8, gap: 8 }}>
                  <span>{mostrarBoletim.curso}</span>
                  <strong style={{ textAlign: 'right' }}>{mostrarBoletim.nota.toFixed(1)}</strong>
                  <strong style={{ textAlign: 'right' }}>{mostrarBoletim.frequencia}%</strong>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                <button onClick={() => setMostrarBoletim(null)} style={{ padding: '8px 12px', borderRadius: 8, background: 'transparent', color: '#e5e7eb', border: '1px solid #374151', cursor: 'pointer' }}>Fechar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Avaliar (editar nota da disciplina) */}
      {editando && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 2000 }}>
          <div style={{ background: '#1f2937', borderRadius: 10, width: 520, maxWidth: '90%', border: '1px solid #111827' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #111827', color: '#e5e7eb', fontWeight: 700 }}>Avaliar - {editando.aluno}</div>
            <div style={{ padding: 16, color: '#e5e7eb' }}>
              <div style={{ marginBottom: 8, color: '#9ca3af' }}>{editando.curso}</div>
              <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>Nota (0 a 10)</label>
              <input
                value={novaNota}
                onChange={(e) => setNovaNota(e.target.value)}
                type="number"
                step="0.1"
                min="0"
                max="10"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #374151', background: '#111827', color: '#e5e7eb' }}
              />
              <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', margin: '12px 0 6px 0' }}>Frequência (%)</label>
              <input
                value={novaFrequencia}
                onChange={(e) => setNovaFrequencia(e.target.value)}
                type="number"
                step="1"
                min="0"
                max="100"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #374151', background: '#111827', color: '#e5e7eb' }}
              />
              <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', margin: '12px 0 6px 0' }}>Observações</label>
              <textarea
                value={novaObs}
                onChange={(e) => setNovaObs(e.target.value)}
                rows={4}
                placeholder="Observações sobre o desempenho do aluno"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #374151', background: '#111827', color: '#e5e7eb', resize: 'vertical' }}
              />
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button onClick={() => setEditando(null)} style={{ flex: 1, padding: '10px 12px', borderRadius: 8, background: 'transparent', color: '#e5e7eb', border: '1px solid #374151', cursor: 'pointer' }}>Cancelar</button>
                <button
                  onClick={() => {
                    const valor = Math.max(0, Math.min(10, parseFloat(novaNota)));
                    const freqVal = Math.max(0, Math.min(100, parseFloat(novaFrequencia)));
                    if (isNaN(valor) || isNaN(freqVal)) return;
                    setItens(prev => prev.map(item => item.id === editando.id ? {
                      ...item,
                      nota: Number(valor.toFixed(1)),
                      frequencia: Math.round(freqVal),
                      situacao: valor >= 6 ? 'Aprovado' : (valor > 0 ? 'Reprovado' : 'Pendente'),
                      observacoes: novaObs
                    } : item));
                    setEditando(null);
                  }}
                  style={{ flex: 1, padding: '10px 12px', borderRadius: 8, background: '#2563eb', color: '#ffffff', border: '1px solid #1d4ed8', cursor: 'pointer' }}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Persistência */}
      <PersistOnChange value={itens} storageKey={STORAGE_KEY} />
    </div>
  );
}

function PersistOnChange({ value, storageKey }: { value: unknown; storageKey: string }) {
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {}
  }, [value, storageKey]);
  return null;
}


