import React from 'react';

type CursoDesempenho = {
  nome: string;
  alunos: number;
  avaliacoes: number;
  conclusao: number; // %
  media: number;
};

type TopAluno = { pos: number; nome: string; curso: string; nota: number };

const cursos: CursoDesempenho[] = [
  { nome: 'Desenvolvimento Web com React', alunos: 25, avaliacoes: 23, conclusao: 85, media: 8.5 },
  { nome: 'TypeScript Avançado', alunos: 18, avaliacoes: 15, conclusao: 92, media: 9.2 },
  { nome: 'Node.js e Express', alunos: 22, avaliacoes: 20, conclusao: 78, media: 8.8 },
  { nome: 'Fundamentos de JavaScript', alunos: 35, avaliacoes: 30, conclusao: 80, media: 7.9 },
];

const distribuicaoNotas: { faixa: string; pct: number }[] = [
  { faixa: '9.0 - 10', pct: 25 },
  { faixa: '8.0 - 8.9', pct: 20 },
  { faixa: '7.0 - 7.9', pct: 15 },
  { faixa: '6.0 - 6.9', pct: 40 },
  { faixa: '0 - 5.9', pct: 5 },
];

const topAlunos: TopAluno[] = [
  { pos: 1, nome: 'Maria Santos', curso: 'TypeScript Avançado', nota: 9.8 },
  { pos: 2, nome: 'João Silva', curso: 'Desenvolvimento Web com React', nota: 9.2 },
  { pos: 3, nome: 'Pedro Costa', curso: 'Node.js e Express', nota: 8.9 },
  { pos: 4, nome: 'Ana Oliveira', curso: 'Fundamentos de JavaScript', nota: 8.7 },
];

export default function Relatorios() {
  const kpiCard: React.CSSProperties = { background: '#1f2937', borderRadius: 10, padding: 12, textAlign: 'center', color: '#e5e7eb', border: '1px solid #111827' };
  const kpiLabel: React.CSSProperties = { fontSize: 12, color: '#9ca3af' };
  const kpiValue: React.CSSProperties = { fontSize: 18, fontWeight: 800 };
  const sectionCard: React.CSSProperties = { background: '#1f2937', borderRadius: 10, padding: 16, border: '1px solid #111827' };

  return (
    <div style={{ color: '#e5e7eb' }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center' }}>Relatórios</h2>
      <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: 4 }}>Análise detalhada do desempenho dos seus cursos e alunos</p>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16, marginTop: 16 }}>
        <div className="kpiCard" style={kpiCard}>
          <div style={kpiLabel}>Total de Cursos</div>
          <div style={kpiValue}>4</div>
        </div>
        <div className="kpiCard" style={kpiCard}>
          <div style={kpiLabel}>Total de Alunos</div>
          <div style={kpiValue}>89</div>
        </div>
        <div className="kpiCard" style={kpiCard}>
          <div style={kpiLabel}>Avaliações</div>
          <div style={kpiValue}>20</div>
        </div>
        <div className="kpiCard" style={kpiCard}>
          <div style={kpiLabel}>Média Geral</div>
          <div style={kpiValue}>8.2</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        {/* Esquerda - Desempenho por Curso */}
        <div style={{ ...sectionCard, padding: 12, alignSelf: 'start' }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Desempenho por Curso</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {cursos.map((c) => (
              <div key={c.nome} style={{ background: '#111827', borderRadius: 8, padding: 8, display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr 60px', gap: 8, alignItems: 'center' }}>
                <div style={{ color: '#cbd5e1' }}>{c.nome}</div>
                <div>
                  <div style={{ color: '#9ca3af', fontSize: 12 }}>Alunos</div>
                  <div style={{ fontWeight: 700 }}>{c.alunos}</div>
                </div>
                <div>
                  <div style={{ color: '#9ca3af', fontSize: 12 }}>Avaliações</div>
                  <div style={{ fontWeight: 700 }}>{c.avaliacoes}</div>
                </div>
                <div>
                  <div style={{ color: '#9ca3af', fontSize: 12 }}>Conclusão</div>
                  <div style={{ fontWeight: 700 }}>{c.conclusao}%</div>
                </div>
                <div style={{ textAlign: 'right', fontWeight: 800, color: '#22c55e' }}>{c.media}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Direita - Distribuição e Top Alunos */}
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={sectionCard}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>Distribuição de Notas</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {distribuicaoNotas.map((d) => (
                <div key={d.faixa} style={{ display: 'grid', gridTemplateColumns: '1fr 4fr 60px', alignItems: 'center', gap: 8 }}>
                  <div style={{ color: '#9ca3af', fontSize: 12 }}>{d.faixa}</div>
                  <div style={{ height: 6, background: '#0b1220', border: '1px solid #111827', borderRadius: 999 }}>
                    <div style={{ width: `${d.pct}%`, height: '100%', background: '#2563eb', borderRadius: 999 }}></div>
                  </div>
                  <div style={{ textAlign: 'right', color: '#9ca3af', fontSize: 12 }}>{d.pct}%</div>
                </div>
              ))}
            </div>
          </div>

          <div style={sectionCard}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>Top Alunos</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {topAlunos.map((t) => (
                <div key={t.pos} style={{ display: 'grid', gridTemplateColumns: '30px 1fr 60px', alignItems: 'center', background: '#111827', padding: 10, borderRadius: 8, gap: 8 }}>
                  <div style={{ color: '#9ca3af' }}>{t.pos}.</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{t.nome}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>{t.curso}</div>
                  </div>
                  <div style={{ textAlign: 'right', fontWeight: 800, color: '#22c55e' }}>{t.nota}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


