import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

type StatusEvento = 'Agendado' | 'Em Andamento' | 'Concluído';

type Evento = {
  id: string;
  titulo: string;
  trilha: string;
  dataHora: string; // ex: 24/01/2024 às 21:00
  local: string;
  participantes: number;
  status: StatusEvento;
  descricao: string;
};

const eventosSeed: Evento[] = [
  {
    id: '1',
    titulo: 'Aula Prática de React',
    trilha: 'Desenvolvimento Web com React',
    dataHora: '24/01/2024 às 21:00',
    local: 'Laboratório de Informática, Sala 101',
    participantes: 15,
    status: 'Agendado',
    descricao: 'Workshop prático de desenvolvimento com React'
  },
  {
    id: '2',
    titulo: 'Workshop de TypeScript',
    trilha: 'TypeScript Avançado',
    dataHora: '18/01/2024 às 21:00',
    local: 'Auditório Principal',
    participantes: 12,
    status: 'Concluído',
    descricao: 'Aprofundamento em TypeScript avançado'
  },
  {
    id: '3',
    titulo: 'Demonstração Node.js',
    trilha: 'Node.js e Express',
    dataHora: '20/01/2024 às 21:00',
    local: 'Laboratório de Desenvolvimento',
    participantes: 18,
    status: 'Em Andamento',
    descricao: 'Demonstração prática de APIs com Node.js'
  },
  {
    id: '4',
    titulo: 'Oficina de Banco de Dados',
    trilha: 'Banco de Dados',
    dataHora: '25/01/2024 às 19:30',
    local: 'Sala de Projetos 02',
    participantes: 20,
    status: 'Agendado',
    descricao: 'Modelagem relacional e consultas SQL'
  },
  {
    id: '5',
    titulo: 'Meetup de DevOps',
    trilha: 'DevOps',
    dataHora: '28/01/2024 às 18:00',
    local: 'Auditório Principal',
    participantes: 35,
    status: 'Concluído',
    descricao: 'Boas práticas de CI/CD e observabilidade'
  },
  {
    id: '6',
    titulo: 'Aula React Hooks',
    trilha: 'Desenvolvimento Web com React',
    dataHora: '30/01/2024 às 20:00',
    local: 'Laboratório de Informática, Sala 103',
    participantes: 22,
    status: 'Agendado',
    descricao: 'Uso avançado de hooks personalizados'
  },
  {
    id: '7',
    titulo: 'Seminário de Segurança',
    trilha: 'Segurança da Informação',
    dataHora: '02/02/2024 às 19:00',
    local: 'Sala 201',
    participantes: 28,
    status: 'Agendado',
    descricao: 'OWASP Top 10 e mitigação de vulnerabilidades'
  },
  {
    id: '8',
    titulo: 'Bootcamp Frontend',
    trilha: 'Frontend',
    dataHora: '05/02/2024 às 09:00',
    local: 'Centro de Treinamento',
    participantes: 40,
    status: 'Concluído',
    descricao: 'Intensivo de HTML, CSS e JavaScript'
  },
  {
    id: '9',
    titulo: 'Laboratório de APIs REST',
    trilha: 'Backend',
    dataHora: '08/02/2024 às 19:00',
    local: 'Laboratório 02',
    participantes: 16,
    status: 'Agendado',
    descricao: 'Construção de APIs RESTful com validações e testes'
  },
  {
    id: '10',
    titulo: 'Kata de Testes Automatizados',
    trilha: 'Qualidade de Software',
    dataHora: '10/02/2024 às 20:00',
    local: 'Sala 105',
    participantes: 14,
    status: 'Agendado',
    descricao: 'Prática guiada de TDD com Jest e Testing Library'
  },
  {
    id: '11',
    titulo: 'Hands-on Docker',
    trilha: 'DevOps',
    dataHora: '12/02/2024 às 18:30',
    local: 'Laboratório de Infra',
    participantes: 26,
    status: 'Em Andamento',
    descricao: 'Criação de imagens, redes e compose para microserviços'
  },
  {
    id: '12',
    titulo: 'Introdução a IA Generativa',
    trilha: 'IA/ML',
    dataHora: '15/02/2024 às 19:30',
    local: 'Auditório B',
    participantes: 52,
    status: 'Concluído',
    descricao: 'Prompt engineering e boas práticas de uso responsável'
  }
];

function corStatus(status: StatusEvento): string {
  if (status === 'Agendado') return '#60a5fa';
  if (status === 'Em Andamento') return '#f59e0b';
  return '#10b981';
}

function gerarParticipantes(ev: Evento): string[] {
  const primeiros = ['Ana', 'Bruno', 'Carla', 'Diego', 'Eduarda', 'Felipe', 'Giovanna', 'Hugo', 'Isabela', 'João', 'Karina', 'Lucas', 'Mariana', 'Nicolas', 'Otávio', 'Paula', 'Rafaela', 'Samuel', 'Talita', 'Ulisses', 'Valéria', 'Willian', 'Xavier', 'Yara', 'Zuleica'];
  const sobrenomes = ['Almeida', 'Barbosa', 'Castro', 'Duarte', 'Esteves', 'Fernandes', 'Gomes', 'Henrique', 'Iglesias', 'Jesus', 'Klein', 'Lima', 'Macedo', 'Nascimento', 'Oliveira', 'Pereira', 'Queiroz', 'Ribeiro', 'Souza', 'Teixeira', 'Uchoa', 'Vieira', 'Werneck', 'Ximenes', 'Yamada', 'Zanetti'];
  const arr: string[] = [];
  for (let i = 0; i < ev.participantes; i++) {
    const nome = `${primeiros[i % primeiros.length]} ${sobrenomes[(i + 3) % sobrenomes.length]}`;
    arr.push(nome);
  }
  return arr;
}

export default function Eventos() {
  const STORAGE_KEY = 'prof_eventos_v1';
  const [lista, setLista] = useState<Evento[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Evento[];
        // Garante pelo menos 8 eventos (se cache antigo tiver poucos)
        if (Array.isArray(parsed) && parsed.length >= 8) return parsed;
        return eventosSeed;
      }
    } catch {}
    return eventosSeed;
  });
  const [abrirNovo, setAbrirNovo] = useState(false);
  const [form, setForm] = useState<Partial<Evento>>({ status: 'Agendado', participantes: 0 });
  const [verParticipantes, setVerParticipantes] = useState<Evento | null>(null);

  const total = lista.length;
  const agendados = useMemo(() => lista.filter(e => e.status === 'Agendado').length, [lista]);
  const emAndamento = useMemo(() => lista.filter(e => e.status === 'Em Andamento').length, [lista]);
  const concluidos = useMemo(() => lista.filter(e => e.status === 'Concluído').length, [lista]);
  const participantes = useMemo(() => lista.reduce((acc, e) => acc + e.participantes, 0), [lista]);

  const kpiCard: React.CSSProperties = { background: '#1f2937', borderRadius: 10, padding: 12, textAlign: 'center', color: '#e5e7eb', border: '1px solid #111827' };
  const kpiLabel: React.CSSProperties = { fontSize: 12, color: '#9ca3af' };
  const kpiValue: React.CSSProperties = { fontSize: 18, fontWeight: 800 };
  const cardStyle: React.CSSProperties = { background: '#1f2937', borderRadius: 10, padding: 16, border: '1px solid #111827' };

  return (
    <div style={{ color: '#e5e7eb' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center' }}>Eventos</h2>
          <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: 4 }}>Gerencie eventos, workshops e aulas práticas</p>
        </div>
        <div style={{ minWidth: 180, textAlign: 'right' }}>
          <button onClick={() => { setForm({ status: 'Agendado', participantes: 0 }); setAbrirNovo(true); }} style={{ padding: '8px 12px', borderRadius: 8, background: '#2563eb', color: '#ffffff', border: '1px solid #1d4ed8', cursor: 'pointer' }}>Adicionar Evento</button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 16, marginTop: 16 }}>
        <div style={kpiCard}>
          <div style={kpiLabel}>Total</div>
          <div style={kpiValue}>{total}</div>
        </div>
        <div style={kpiCard}>
          <div style={kpiLabel}>Agendados</div>
          <div style={kpiValue}>{agendados}</div>
        </div>
        <div style={kpiCard}>
          <div style={kpiLabel}>Em Andamento</div>
          <div style={kpiValue}>{emAndamento}</div>
        </div>
        <div style={kpiCard}>
          <div style={kpiLabel}>Concluídos</div>
          <div style={kpiValue}>{concluidos}</div>
        </div>
        <div style={kpiCard}>
          <div style={kpiLabel}>Participantes</div>
          <div style={kpiValue}>{participantes}</div>
        </div>
      </div>

      {/* Lista de eventos */}
      <div style={{ display: 'grid', gap: 18, marginTop: 18 }}>
        {lista.map(ev => (
          <div key={ev.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700 }}>{ev.titulo}</div>
              <div style={{ color: corStatus(ev.status), fontWeight: 700 }}>{ev.status}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 12, marginTop: 8, color: '#9ca3af', fontSize: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>🧩 <span>{ev.trilha}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>🗓️ <span>{ev.dataHora}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>📍 <span>{ev.local}</span></div>
            </div>

            <div style={{ marginTop: 10, color: '#cbd5e1' }}>{ev.descricao}</div>
            <div style={{ marginTop: 8, fontSize: 12, color: '#9ca3af' }}>{ev.participantes} participantes</div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
              {ev.status !== 'Concluído' && (
                ev.status === 'Em Andamento' ? (
                  <button
                    onClick={() => {
                      setLista(prev => prev.map(e => e.id === ev.id ? { ...e, status: 'Concluído' } : e));
                    }}
                    style={{ padding: '8px 10px', borderRadius: 8, background: '#10b981', color: '#ffffff', border: '1px solid #059669', cursor: 'pointer' }}
                  >
                    Finalizar
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setLista(prev => prev.map(e => e.id === ev.id ? { ...e, status: 'Em Andamento' } : e));
                    }}
                    style={{ padding: '8px 10px', borderRadius: 8, background: '#111827', color: '#e5e7eb', border: '1px solid #1f2937', cursor: 'pointer' }}
                  >
                    Iniciar
                  </button>
                )
              )}
              <button onClick={() => setVerParticipantes(ev)} style={{ padding: '8px 10px', borderRadius: 8, background: '#111827', color: '#e5e7eb', border: '1px solid #1f2937', cursor: 'pointer' }}>Participantes</button>
              <button onClick={() => {
                if (confirm('Deseja apagar este evento?')) {
                  setLista(prev => prev.filter(e => e.id !== ev.id));
                }
              }} style={{ padding: '8px 10px', borderRadius: 8, background: '#ef4444', color: '#ffffff', border: '1px solid #b91c1c', cursor: 'pointer' }}>Apagar</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Adicionar Evento */}
      {abrirNovo && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 2000 }}>
          <div style={{ background: '#1f2937', borderRadius: 10, width: 620, maxWidth: '95%', border: '1px solid #111827' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #111827', color: '#e5e7eb', fontWeight: 700 }}>Adicionar Evento</div>
            <div style={{ padding: 16, color: '#e5e7eb', display: 'grid', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Título</label>
                  <input value={form.titulo || ''} onChange={(e) => setForm({ ...form, titulo: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #374151', background: '#111827', color: '#e5e7eb' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Trilha</label>
                  <input value={form.trilha || ''} onChange={(e) => setForm({ ...form, trilha: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #374151', background: '#111827', color: '#e5e7eb' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Data e Hora</label>
                  <input value={form.dataHora || ''} onChange={(e) => setForm({ ...form, dataHora: e.target.value })} placeholder="dd/mm/aaaa às hh:mm" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #374151', background: '#111827', color: '#e5e7eb' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Local</label>
                  <input value={form.local || ''} onChange={(e) => setForm({ ...form, local: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #374151', background: '#111827', color: '#e5e7eb' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Participantes</label>
                  <input type="number" value={form.participantes ?? 0} onChange={(e) => setForm({ ...form, participantes: Math.max(0, parseInt(e.target.value || '0')) })} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #374151', background: '#111827', color: '#e5e7eb' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Status</label>
                  <select value={form.status as StatusEvento} onChange={(e) => setForm({ ...form, status: e.target.value as StatusEvento })} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #374151', background: '#111827', color: '#e5e7eb' }}>
                    <option value="Agendado">Agendado</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Concluído">Concluído</option>
                  </select>
                </div>
                <div></div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Descrição</label>
                <textarea value={form.descricao || ''} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={4} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #374151', background: '#111827', color: '#e5e7eb', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button onClick={() => setAbrirNovo(false)} style={{ padding: '10px 12px', borderRadius: 8, background: 'transparent', color: '#e5e7eb', border: '1px solid #374151', cursor: 'pointer' }}>Cancelar</button>
                <button
                  onClick={() => {
                    if (!form.titulo || !form.trilha || !form.dataHora || !form.local || !form.status) return;
                    const novo: Evento = {
                      id: String(Date.now()),
                      titulo: form.titulo,
                      trilha: form.trilha,
                      dataHora: form.dataHora,
                      local: form.local,
                      participantes: form.participantes ?? 0,
                      status: form.status as StatusEvento,
                      descricao: form.descricao || ''
                    } as Evento;
                    setLista(prev => [novo, ...prev]);
                    setAbrirNovo(false);
                  }}
                  style={{ padding: '10px 12px', borderRadius: 8, background: '#10b981', color: '#ffffff', border: '1px solid #059669', cursor: 'pointer' }}
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal Participantes */}
      {verParticipantes && createPortal(
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 9999 }}>
          <div style={{ background: '#1f2937', borderRadius: 10, width: 520, maxWidth: '95%', border: '1px solid #111827', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #111827', color: '#e5e7eb', fontWeight: 700 }}>Participantes – {verParticipantes.titulo}</div>
            <div style={{ padding: 16, color: '#e5e7eb' }}>
              <ul style={{ margin: 0, paddingLeft: 18, maxHeight: 360, overflowY: 'auto', listStyle: 'none' }}>
                {gerarParticipantes(verParticipantes).map((nome, idx) => (
                  <li key={idx} style={{ padding: '6px 0', borderBottom: '1px solid #111827' }}>{`${idx + 1}. ${nome}`}</li>
                ))}
              </ul>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                <button onClick={() => setVerParticipantes(null)} style={{ padding: '8px 12px', borderRadius: 8, background: 'transparent', color: '#e5e7eb', border: '1px solid #374151', cursor: 'pointer' }}>Fechar</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
      {/* Persistência automática */}
      <PersistOnChange value={lista} storageKey={STORAGE_KEY} />
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


