import React, { useEffect, useState } from 'react';
import MatriculaService from '../../Services/matriculaService';

type Matricula = {
  alunoId: string;
  cursoId: string;
  status: string;
};

export default function Alunos() {
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    MatriculaService.listarTodas()
      .then((data) => setMatriculas(data))
      .catch((e) => setErro('Falha ao carregar matrículas'))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div style={{ color: '#e5e7eb' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Alunos Matriculados</h2>
      {carregando && <div>Carregando...</div>}
      {erro && <div style={{ color: '#fca5a5' }}>{erro}</div>}

      {!carregando && !erro && (
        <div style={{ background: '#0D1723', border: '1px solid #373E47', borderRadius: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: '#9ca3af', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid #373E47' }}>Aluno ID</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid #373E47' }}>Curso ID</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid #373E47' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {matriculas.map((m) => (
                <tr key={`${m.alunoId}-${m.cursoId}`}>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid #1f2937' }}>{m.alunoId}</td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid #1f2937' }}>{m.cursoId}</td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid #1f2937' }}>{m.status}</td>
                </tr>
              ))}
              {matriculas.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ padding: 16, color: '#9ca3af' }}>Nenhuma matrícula encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


