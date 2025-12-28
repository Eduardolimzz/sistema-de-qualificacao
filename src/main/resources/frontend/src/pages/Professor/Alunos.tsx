import React, { useEffect, useMemo, useState } from 'react';

type AlunoResumo = {
  id: string;
  nome: string;
  email: string;
  mediaGeral: number;
  avaliacoes: number;
  progresso: number; // 0-100
  cursos: { nome: string; nota: number }[];
};

const alunosMock: AlunoResumo[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao@email.com',
    mediaGeral: 8.8,
    avaliacoes: 2,
    progresso: 75,
    cursos: [
      { nome: 'Desenvolvimento Web com React', nota: 8.5 },
      { nome: 'Typescript Avançado', nota: 9.1 }
    ]
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria@email.com',
    mediaGeral: 9.2,
    avaliacoes: 2,
    progresso: 90,
    cursos: [
      { nome: 'Node.js Avançado', nota: 9.4 },
      { nome: 'Typescript Avançado', nota: 9.0 }
    ]
  },
  // Gera mais 87 alunos para totalizar 89 (com nomes reais)
  ...(() => {
    const primeiros = ['Ana', 'Bruno', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda', 'Gabriel', 'Helena', 'Igor', 'Juliana', 'Kleber', 'Larissa', 'Marcos', 'Nathalia', 'Otávio', 'Patrícia', 'Rafael', 'Sabrina', 'Tiago', 'Úrsula', 'Vitor', 'Wesley', 'Xavier', 'Yasmin', 'Zilda'];
    const sobrenomes = ['Almeida', 'Barbosa', 'Cardoso', 'Dantas', 'Esteves', 'Ferraz', 'Gomes', 'Henrique', 'Ibrahim', 'Jesus', 'Klein', 'Lima', 'Macedo', 'Nascimento', 'Oliveira', 'Pereira', 'Queiroz', 'Ribeiro', 'Souza', 'Teixeira', 'Uchoa', 'Vasconcelos', 'Werneck', 'Ximenes', 'Yamada', 'Zanetti'];
    const poolCursos = ['Desenvolvimento Web com React', 'Typescript Avançado', 'Node.js Avançado', 'Banco de Dados', 'DevOps'];
    return Array.from({ length: 87 }, (_, idx) => {
      const n = idx + 3; // começa no id 3
      const nome = `${primeiros[idx % primeiros.length]} ${sobrenomes[idx % sobrenomes.length]}`;
      const numCursos = (n % 3) + 1; // entre 1 e 3 disciplinas
      const cursos = Array.from({ length: numCursos }, (_, i) => {
        const nomeCurso = poolCursos[(idx + i) % poolCursos.length];
        const nota = Number((6 + ((idx + i + n) % 40) / 10).toFixed(1)); // 6.0 a 10.0
        return { nome: nomeCurso, nota };
      });
      const media = Number((cursos.reduce((a, c) => a + c.nota, 0) / cursos.length).toFixed(1));
      return {
        id: String(n),
        nome,
        email: `${nome.toLowerCase().replace(/\s+/g, '.')}@email.com`,
        mediaGeral: media,
        avaliacoes: cursos.length,
        progresso: (n * 7) % 101,
        cursos
      } as AlunoResumo;
    });
  })()
];

const STORAGE_KEY = 'prof_alunos_v1';

export default function Alunos() {
  const [alunos, setAlunos] = useState<AlunoResumo[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return alunosMock;
  });
  const [modalAberto, setModalAberto] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState<AlunoResumo | null>(null);
  const [notasEditadas, setNotasEditadas] = useState<number[]>([]);
  const [mensagemAberta, setMensagemAberta] = useState(false);
  const [textoMensagem, setTextoMensagem] = useState('');

  const totalAlunos = alunos.length;
  const mediaGeral = useMemo(() => alunos.reduce((acc, a) => acc + a.mediaGeral, 0) / Math.max(totalAlunos, 1), [alunos, totalAlunos]);
  const cursosAtivos = 5; // conforme solicitado

  const cardContainer: React.CSSProperties = { background: '#1f2937', borderRadius: 10, padding: 16, border: '1px solid #111827' };
  const kpiCard: React.CSSProperties = { background: '#1f2937', borderRadius: 10, padding: 12, textAlign: 'center', color: '#e5e7eb', border: '1px solid #111827' };
  const kpiLabel: React.CSSProperties = { fontSize: 12, color: '#9ca3af' };
  const kpiValue: React.CSSProperties = { fontSize: 20, fontWeight: 800 };

  return (
    <div style={{ color: '#e5e7eb' }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center' }}>Meus Alunos</h2>
      <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: 4 }}>Gerencie e acompanhe o progresso dos seus alunos</p>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, marginTop: 16 }}>
        <div style={kpiCard}>
          <div style={kpiLabel}>Total de Alunos</div>
          <div style={kpiValue}>{totalAlunos}</div>
        </div>
        <div style={kpiCard}>
          <div style={kpiLabel}>Média Geral</div>
          <div style={kpiValue}>{mediaGeral.toFixed(1)}</div>
        </div>
        <div style={kpiCard}>
          <div style={kpiLabel}>Cursos Ativos</div>
          <div style={kpiValue}>{cursosAtivos}</div>
        </div>
      </div>

      {/* Cards de alunos */}
      <div style={{ display: 'grid', gap: 18, marginTop: 18 }}>
        {alunos.map((aluno) => (
          <div key={aluno.id} style={cardContainer}>
            <div style={{ fontWeight: 700 }}>{aluno.nome}</div>
            <div style={{ color: '#9ca3af', fontSize: 12 }}>{aluno.email}</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12 }}>
              <div>
                <div style={{ color: '#9ca3af', fontSize: 12, marginBottom: 6 }}>Desempenho</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  <div style={{ background: '#111827', borderRadius: 8, padding: 10, textAlign: 'center' }}>
                    <div style={{ color: '#9ca3af', fontSize: 12 }}>Média Geral</div>
                    <div style={{ fontWeight: 800 }}>{aluno.mediaGeral}</div>
                  </div>
                  <div style={{ background: '#111827', borderRadius: 8, padding: 10, textAlign: 'center' }}>
                    <div style={{ color: '#9ca3af', fontSize: 12 }}>Avaliações</div>
                    <div style={{ fontWeight: 800 }}>{aluno.avaliacoes}</div>
                  </div>
                  <div style={{ background: '#111827', borderRadius: 8, padding: 10, textAlign: 'center' }}>
                    <div style={{ color: '#9ca3af', fontSize: 12 }}>Progresso</div>
                    <div style={{ fontWeight: 800 }}>{aluno.progresso}%</div>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ color: '#9ca3af', fontSize: 12, marginBottom: 6 }}>Cursos Inscritos</div>
                <div style={{ background: '#111827', borderRadius: 8, padding: 10 }}>
                  {aluno.cursos.map((c) => (
                    <div key={c.nome} style={{ fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
                      <span>{c.nome}</span>
                      <strong>{c.nota.toFixed(1)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'flex-start' }}>
              <button
                onClick={() => { setAlunoSelecionado(aluno); setNotasEditadas(aluno.cursos.map(c => c.nota)); setModalAberto(true); }}
                style={{ padding: '6px 10px', borderRadius: 6, background: '#111827', color: '#e5e7eb', border: '1px solid #1f2937', cursor: 'pointer' }}
              >
                Notas
              </button>
              <button
                onClick={() => { setAlunoSelecionado(aluno); setTextoMensagem(''); setMensagemAberta(true); }}
                style={{ padding: '6px 10px', borderRadius: 6, background: '#111827', color: '#e5e7eb', border: '1px solid #1f2937', cursor: 'pointer' }}
              >
                Mensagem
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalAberto && alunoSelecionado && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 2000 }}>
          <div style={{ background: '#1f2937', borderRadius: 10, width: 520, maxWidth: '95%', border: '1px solid #111827' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #111827', color: '#e5e7eb', fontWeight: 700 }}>Editar Notas - {alunoSelecionado.nome}</div>
            <div style={{ padding: 16, color: '#e5e7eb' }}>
              <div style={{ display: 'grid', gap: 10 }}>
                {alunoSelecionado.cursos.map((c, idx) => (
                  <div key={c.nome} style={{ display: 'grid', gridTemplateColumns: '1fr 120px', alignItems: 'center', gap: 10 }}>
                    <div style={{ color: '#cbd5e1' }}>{c.nome}</div>
                    <input
                      value={String(notasEditadas[idx] ?? 0)}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        setNotasEditadas(prev => {
                          const arr = [...prev];
                          arr[idx] = isNaN(v) ? 0 : Math.max(0, Math.min(10, v));
                          return arr;
                        });
                      }}
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #374151', background: '#111827', color: '#e5e7eb' }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button
                  onClick={() => setModalAberto(false)}
                  style={{ flex: 1, padding: '10px 12px', borderRadius: 8, background: 'transparent', color: '#e5e7eb', border: '1px solid #374151', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (alunoSelecionado) {
                      const notasValidas = notasEditadas.map(n => Math.max(0, Math.min(10, n)));
                      const media = Number((notasValidas.reduce((a, n) => a + n, 0) / Math.max(notasValidas.length, 1)).toFixed(1));
                      setAlunos(prev => prev.map(a => a.id === alunoSelecionado.id ? {
                        ...a,
                        cursos: a.cursos.map((c, i) => ({ ...c, nota: notasValidas[i] ?? c.nota })),
                        mediaGeral: media,
                        avaliacoes: notasValidas.length
                      } : a));
                      setModalAberto(false);
                    }
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

      {mensagemAberta && alunoSelecionado && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 2000 }}>
          <div style={{ background: '#1f2937', borderRadius: 10, width: 520, maxWidth: '90%', border: '1px solid #111827' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #111827', color: '#e5e7eb', fontWeight: 700 }}>Mensagem para {alunoSelecionado.nome}</div>
            <div style={{ padding: 16, color: '#e5e7eb' }}>
              <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>Mensagem</label>
              <textarea
                value={textoMensagem}
                onChange={(e) => setTextoMensagem(e.target.value)}
                rows={6}
                placeholder="Escreva sua mensagem ao aluno..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #374151', background: '#111827', color: '#e5e7eb', resize: 'vertical' }}
              />
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button
                  onClick={() => setMensagemAberta(false)}
                  style={{ flex: 1, padding: '10px 12px', borderRadius: 8, background: 'transparent', color: '#e5e7eb', border: '1px solid #374151', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (textoMensagem.trim().length === 0) return;
                    console.log('Mensagem enviada para', alunoSelecionado?.nome, ':', textoMensagem);
                    setMensagemAberta(false);
                  }}
                  style={{ flex: 1, padding: '10px 12px', borderRadius: 8, background: '#10b981', color: '#ffffff', border: '1px solid #059669', cursor: 'pointer' }}
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Persistência */}
      <PersistOnChange value={alunos} storageKey={STORAGE_KEY} />
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


