import { useState, useEffect } from 'react';
import estilos from './Certificados.module.css';

// Importando ícones (assumindo que você tem react-feather ou lucide-react)
import { Clock, Calendar, BarChart2 } from 'react-feather';

// --- (INÍCIO) Simulação de API ---
// No futuro, você vai apagar isso e fazer um fetch
const mockCertificados = [
  {
    id: 1,
    title: 'Introdução à Programação',
    level: 'Iniciante',
    duration: 40,
    emissionDate: '19/03/2024',
    description: 'Certificado de conclusão do curso de Introdução à Programação, cobrindo fundamentos de lógica de programação, algoritmos e estruturas de dados básicas.',
    skills: ['Lógica de Programação', 'Algoritmos', 'Estruturas de Dados', 'Python Básico'],
    finalGrade: 8.5,
    instructor: 'João Silva',
  },
  {
    id: 2,
    title: 'Desenvolvimento Web Avançado',
    level: 'Intermediário',
    duration: 60,
    emissionDate: '14/04/2024',
    description: 'Certificado de conclusão do curso de Desenvolvimento Web Avançado, incluindo React, Node.js, APIs REST e deploy em produção.',
    skills: ['React', 'Node.js', 'APIs REST', 'MongoDB', 'Deploy'],
    finalGrade: 9.2,
    instructor: 'Maria Clara',
  },
  {
    id: 3,
    title: 'Data Science e Machine Learning',
    level: 'Avançado',
    duration: 80,
    emissionDate: '03/05/2024',
    description: 'Certificado de conclusão do curso de Data Science e Machine Learning, abrangendo análise de dados, algoritmos de ML e deep learning.',
    skills: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'Análise de Dados'],
    finalGrade: 9.0,
    instructor: 'Carlos Pereira',
  },
];
// --- (FIM) Simulação de API ---


const Certificados = () => {
  // Estado para a lista de todos os certificados
  const [certificados, setCertificados] = useState([]);

  // Estado para guardar O CERTIFICADO SELECIONADO
  const [selectedCert, setSelectedCert] = useState(null);

  // Estado de loading
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para carregar os dados (simulação)
  useEffect(() => {
    // Simula a busca na API
    setTimeout(() => {
      setCertificados(mockCertificados);
      // Seleciona o primeiro certificado da lista por padrão
      if (mockCertificados.length > 0) {
        setSelectedCert(mockCertificados[0]);
      }
      setIsLoading(false);
    }, 1000); // 1 segundo de loading
  }, []);

  // Handler para trocar o certificado selecionado
  const handleSelectCertificate = (certificado) => {
    setSelectedCert(certificado);
  };

  if (isLoading) {
    return <div className={estilos.loadingMessage}>Carregando certificados...</div>;
  }

  return (
    <div className={estilos.pageContainer}>

      {/* Títulos */}
      <h1 className={estilos.pageTitle}>Meus Certificados</h1>
      <p className={estilos.pageSubtitle}>
        Visualize, baixe e gerencie todos os seus certificados de conclusão
      </p>

      {/* Layout Principal (Duas Colunas) */}
      <div className={estilos.mainLayout}>

        {/* Coluna da Esquerda: Lista de Certificados */}
        <section className={estilos.certificateList}>
          {certificados.map((cert) => (
            <div key={cert.id} className={estilos.certificateCard}>
              <h2 className={estilos.cardTitle}>{cert.title}</h2>

              <div className={estilos.metaData}>
                <span><BarChart2 size={14} /> {cert.level}</span>
                <span><Clock size={14} /> {cert.duration} horas</span>
                <span><Calendar size={14} /> Emitido em {cert.emissionDate}</span>
              </div>

              <p className={estilos.cardDescription}>{cert.description}</p>

              <div className={estilos.skillsSection}>
                <h3>Habilidades Desenvolvidas:</h3>
                <div className={estilos.skillsGrid}>
                  {cert.skills.map((skill) => (
                    <span key={skill} className={estilos.skillTag}>{skill}</span>
                  ))}
                </div>
              </div>

              <div className={estilos.cardButtons}>
                <button
                  className={estilos.visualizarButton}
                  onClick={() => handleSelectCertificate(cert)}
                >
                  Visualizar
                </button>
                <button className={estilos.baixarButton}>Baixar</button>
              </div>
            </div>
          ))}
        </section>

        {/* Coluna da Direita: Detalhes do Certificado Selecionado */}
        <aside className={estilos.detailsSidebar}>
          {selectedCert ? (
            <>
              <h2 className={estilos.detailsTitle}>Detalhes do Certificado</h2>

              <div className={estilos.detailsStatsGrid}>
                <div className={`${estilos.statCard} ${estilos.notaCard}`}>
                  <p>Nota Final</p>
                  <span>{selectedCert.finalGrade}</span>
                </div>
                <div className={`${estilos.statCard} ${estilos.duracaoCard}`}>
                  <p>Duração</p>
                  <span>{selectedCert.duration}h</span>
                </div>
              </div>

              <ul className={estilos.detailsList}>
                <li>
                  <span>Curso:</span>
                  <p>{selectedCert.title}</p>
                </li>
                <li>
                  <span>Instrutor:</span>
                  <p>{selectedCert.instructor}</p>
                </li>
                <li>
                  <span>Data de Emissão:</span>
                  <p>{selectedCert.emissionDate}</p>
                </li>
              </ul>
            </>
          ) : (
            <div className={estilos.noSelection}>
              <p>Selecione um certificado ao lado para ver os detalhes.</p>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
};

export default Certificados;