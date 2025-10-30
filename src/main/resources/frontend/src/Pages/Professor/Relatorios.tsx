import React, { useEffect, useMemo, useState } from 'react';
import MatriculaService from '../../Services/matriculaService';

type Matricula = {
  alunoId: string;
  cursoId: string;
  status: string;
};

export default function Relatorios() {
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    MatriculaService.listarTodas()
      .then((data) => setMatriculas(data))
      .catch(() => setErro('Falha ao carregar dados'))
      .finally(() => setCarregando(false));
  }, []);

  const totalMatriculas = matriculas.length;
  const porStatus = useMemo(() => {
    const map = new Map<string, number>();
    matriculas.forEach(m => map.set(m.status, (map.get(m.status) || 0) + 1));
    return Array.from(map.entries()).map(([status, qtd]) => ({ status, qtd }));
  }, [matriculas]);

  return (
    <div style={{ color: '#e5e7eb' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Relatórios</h2>

      {carregando && <div>Carregando...</div>}
      {erro && <div style={{ color: '#fca5a5' }}>{erro}</div>}

      {!carregando && !erro && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
          <div style={{ background: '#1f2937', borderRadius: 8, padding: 16 }}>
            <div style={{ color: '#9ca3af' }}>Total de Matrículas</div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{totalMatriculas}</div>
          </div>
          <div style={{ background: '#1f2937', borderRadius: 8, padding: 16 }}>
            <div style={{ color: '#9ca3af', marginBottom: 8 }}>Por Status</div>
            {porStatus.map(item => (
              <div key={item.status} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #111827' }}>
                <span>{item.status}</span>
                <strong>{item.qtd}</strong>
              </div>
            ))}
            {porStatus.length === 0 && <div style={{ color: '#9ca3af' }}>Sem dados</div>}
          </div>
          <div style={{ background: '#1f2937', borderRadius: 8, padding: 16 }}>
            <div style={{ color: '#9ca3af' }}>Observações</div>
            <div style={{ marginTop: 8, color: '#cbd5e1' }}>Este relatório é baseado nas matrículas atuais retornadas pela API.</div>
          </div>
        </div>
      )}
    </div>
  );
}


