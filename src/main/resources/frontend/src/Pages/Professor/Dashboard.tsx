import React from 'react';
import { useNavigate } from 'react-router-dom';

const cardStyle: React.CSSProperties = {
  backgroundColor: '#1f2937',
  borderRadius: 8,
  padding: 16,
  color: '#e5e7eb',
  boxShadow: '0 1px 2px rgba(0,0,0,0.4)'
};

const statNumberStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  textAlign: 'center'
};

const smallMuted: React.CSSProperties = {
  fontSize: 14,
  color: '#9ca3af',
  textAlign: 'center'
};

export default function Dashboard() {
  const navigate = useNavigate();
  return (
        <div style={{ padding: 20, color: '#e5e7eb' }}>
          <h2 style={{ textAlign: 'center', fontSize: 26, fontWeight: 800, margin: '8px 0 18px 0' }}>Olá, Professor!</h2>

          {/* KPIs */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 18 }}>
            {[{ label: 'Total de Cursos', value: 5 }, { label: 'Total de Alunos', value: 89 }, { label: 'Avaliações', value: 127 }, { label: 'Média de Notas', value: 8.7 }].map((kpi) => (
              <div key={kpi.label} style={cardStyle}>
                <div style={{ fontSize: 14, color: '#9ca3af', textAlign: 'center' }}>{kpi.label}</div>
                <div style={statNumberStyle}>{kpi.value}</div>
              </div>
            ))}
          </section>

          {/* Título cursos */}
          <h3 style={{ textAlign: 'center', fontSize: 24, fontWeight: 800, margin: '28px 0 14px 0' }}>Cursos Ministrados</h3>

          {/* Cards de cursos */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24 }}>
            {/* Curso 1 */}
            <div style={{ ...cardStyle, padding: 22 }}>
              <div style={{ fontWeight: 800, marginBottom: 8, fontSize: 18 }}>Desenvolvimento Web com React</div>
              <div style={{ fontSize: 14, color: '#9ca3af' }}>Intermediário</div>
              <div style={{ fontSize: 14, color: '#9ca3af', marginBottom: 10 }}>40 horas</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
                <div style={{ background: '#111827', borderRadius: 6, padding: 8 }}>
                  <div style={smallMuted}>Alunos</div>
                  <div style={statNumberStyle}>25</div>
                </div>
                <div style={{ background: '#111827', borderRadius: 6, padding: 8 }}>
                  <div style={smallMuted}>Avaliações</div>
                  <div style={statNumberStyle}>23</div>
                </div>
                <div style={{ background: '#111827', borderRadius: 6, padding: 8 }}>
                  <div style={smallMuted}>Média</div>
                  <div style={statNumberStyle}>8.5</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button onClick={() => navigate('/professor/relatorios')} style={{ flex: 1, padding: '10px 12px', borderRadius: 8, background: '#111827', color: '#e5e7eb', border: '1px solid #1f2937', fontSize: 15, cursor: 'pointer' }}>Relatórios</button>
                <button onClick={() => navigate('/professor/alunos')} style={{ flex: 1, padding: '10px 12px', borderRadius: 8, background: '#111827', color: '#e5e7eb', border: '1px solid #1f2937', fontSize: 15, cursor: 'pointer' }}>Alunos</button>
              </div>
            </div>

            {/* Curso 2 */}
            <div style={{ ...cardStyle, padding: 22 }}>
              <div style={{ fontWeight: 800, marginBottom: 8, fontSize: 18 }}>TypeScript Avançado</div>
              <div style={{ fontSize: 14, color: '#9ca3af' }}>Avançado</div>
              <div style={{ fontSize: 14, color: '#9ca3af', marginBottom: 10 }}>30 horas</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
                <div style={{ background: '#111827', borderRadius: 6, padding: 8 }}>
                  <div style={smallMuted}>Alunos</div>
                  <div style={statNumberStyle}>18</div>
                </div>
                <div style={{ background: '#111827', borderRadius: 6, padding: 8 }}>
                  <div style={smallMuted}>Avaliações</div>
                  <div style={statNumberStyle}>15</div>
                </div>
                <div style={{ background: '#111827', borderRadius: 6, padding: 8 }}>
                  <div style={smallMuted}>Média</div>
                  <div style={statNumberStyle}>9.2</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button onClick={() => navigate('/professor/relatorios')} style={{ flex: 1, padding: '10px 12px', borderRadius: 8, background: '#111827', color: '#e5e7eb', border: '1px solid #1f2937', fontSize: 15, cursor: 'pointer' }}>Relatórios</button>
                <button onClick={() => navigate('/professor/alunos')} style={{ flex: 1, padding: '10px 12px', borderRadius: 8, background: '#111827', color: '#e5e7eb', border: '1px solid #1f2937', fontSize: 15, cursor: 'pointer' }}>Alunos</button>
              </div>
            </div>
          </section>
        </div>
  );
}

