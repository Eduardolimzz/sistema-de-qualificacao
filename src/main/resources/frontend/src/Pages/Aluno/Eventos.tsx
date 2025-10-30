import { useState, useEffect } from 'react';
import estilos from './Eventos.module.css';
import { Calendar, MapPin, Users } from 'react-feather';

// --- (INÍCIO) Simulação de API ATUALIZADA ---
const mockApiData = {
  allEvents: [
    {
      id: 1,
      title: 'Workshop de Programação Python',
      date: '16/04/2024',
      time: '14:00',
      location: 'Auditório Principal - Campus Central',
      currentParticipants: 32,
      maxParticipants: 50,
      description: 'Aprenda os fundamentos da programação Python...',
      instructor: 'Dr. João Silva',
      relatedCourse: 'Curso: Introdução à Programação',
    },
    {
      id: 2,
      title: 'Conferência de Desenvolvimento Web',
      date: '18/04/2024',
      time: '08:00',
      location: 'Online - Plataforma Zoom',
      currentParticipants: 156,
      maxParticipants: 200,
      description: 'Evento online com palestras sobre as últimas tendências...',
      instructor: 'Dra. Maria Santos',
      relatedCourse: 'Curso: Desenvolvimento Web Avançado',
    },
    {
      id: 3,
      title: 'Aula Especial: Machine Learning',
      date: '24/04/2024',
      time: '19:00',
      location: 'Laboratório de Computação - Bloco B',
      currentParticipants: 28,
      maxParticipants: 30,
      description: 'Aula especial sobre fundamentos de Machine Learning...',
      instructor: 'Prof. Carlos Lima',
      relatedCourse: 'Curso: Data Science e Machine Learning',
    },
    {
      id: 4,
      title: 'Networking Tech 2024',
      date: '04/05/2024',
      time: '18:00',
      location: 'Centro de Convenções - Centro da Cidade',
      currentParticipants: 67,
      maxParticipants: 100,
      description: 'Evento de networking para profissionais da área...',
      instructor: 'Equipe de Eventos',
      relatedCourse: null,
    },
  ],
  // A API agora também nos diz em quais eventos o aluno está inscrito
  myInscriptions: [2, 4], // Ex: Inscrito no evento 2 e 4
};

// Simulação de chamada de API
const fetchEventosData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockApiData);
    }, 1000); // 1 segundo de loading
  });
};
// --- (FIM) Simulação de API ---


const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- NOVOS ESTADOS ---
  // Estado para guardar os IDs dos eventos inscritos
  const [inscricoes, setInscricoes] = useState<number[]>([]);
  // Estado para controlar a visualização (tabs)
  const [view, setView] = useState<'todos' | 'inscritos'>('todos');

  // --- USEEFFECT ATUALIZADO ---
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchEventosData();
        setEventos(data.allEvents);
        setInscricoes(data.myInscriptions); // Guarda as inscrições do aluno
      } catch (err) {
        setError('Falha ao carregar eventos.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // --- NOVA FUNÇÃO ---
  // Simula a inscrição/desinscrição em um evento
  const handleToggleInscricao = (eventoId: number) => {
    // No app real, aqui você faria uma chamada POST/DELETE para sua API
    setInscricoes((prevInscricoes) => {
      if (prevInscricoes.includes(eventoId)) {
        // Desinscrever
        return prevInscricoes.filter((id) => id !== eventoId);
      } else {
        // Inscrever
        return [...prevInscricoes, eventoId];
      }
    });
  };

  // --- NOVA LÓGICA DE FILTRO ---
  // Filtra os eventos com base na 'view' selecionada
  const eventosParaExibir = view === 'todos'
    ? eventos
    : eventos.filter((evento) => inscricoes.includes(evento.id));


  if (isLoading) {
    return <div className={estilos.loadingMessage}>Carregando eventos...</div>;
  }

  if (error) {
    return <div className={estilos.errorMessage}>{error}</div>;
  }

  return (
    <div className={estilos.pageContainer}>

      <h1 className={estilos.pageTitle}>Eventos</h1>
      <p className={estilos.pageSubtitle}>
        Participe de workshops, conferências, aulas especiais e eventos de networking
      </p>

      {/* --- NOVOS BOTÕES (TABS) --- */}
      <div className={estilos.viewToggle}>
        <button
          className={view === 'todos' ? estilos.activeToggle : estilos.toggleButton}
          onClick={() => setView('todos')}
        >
          Todos os Eventos
        </button>
        <button
          className={view === 'inscritos' ? estilos.activeToggle : estilos.toggleButton}
          onClick={() => setView('inscritos')}
        >
          Meus Eventos ({inscricoes.length})
        </button>
      </div>

      {/* Grid de Eventos (AGORA USA 'eventosParaExibir') */}
      <div className={estilos.eventosGrid}>

        {/* Lógica para quando não há eventos */}
        {eventosParaExibir.length === 0 ? (
          <div className={estilos.emptyMessage}>
            {view === 'inscritos'
              ? 'Você ainda não se inscreveu em nenhum evento.'
              : 'Nenhum evento disponível no momento.'
            }
          </div>
        ) : (
          // Mapeia os eventos filtrados
          eventosParaExibir.map((evento) => {
            // Verifica se o aluno está inscrito neste evento
            const isIncrito = inscricoes.includes(evento.id);

            return (
              <div key={evento.id} className={estilos.eventoCard}>

                <h2 className={estilos.cardTitle}>{evento.title}</h2>

                <div className={estilos.metaDataGrid}>
                  <div className={estilos.metaItem}>
                    <Calendar size={14} />
                    <span>{evento.date} às {evento.time}</span>
                  </div>
                  <div className={estilos.metaItem}>
                    <MapPin size={14} />
                    <span>{evento.location}</span>
                  </div>
                  <div className={estilos.metaItem}>
                    <Users size={14} />
                    <span>{evento.currentParticipants}/{evento.maxParticipants} participantes</span>
                  </div>
                </div>

                <p className={estilos.cardDescription}>{evento.description}</p>

                <div className={estilos.cardInfo}>
                  <p><strong>Instrutor:</strong> {evento.instructor}</p>
                  {evento.relatedCourse && (
                    <p>{evento.relatedCourse}</p>
                  )}
                </div>

                {/* --- BOTÃO ATUALIZADO --- */}
                <button
                  className={`${estilos.registerButton} ${isIncrito ? estilos.inscrito : ''}`}
                  onClick={() => handleToggleInscricao(evento.id)}
                >
                  {isIncrito ? 'Inscrito' : 'Inscrever-se'}
                </button>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Eventos;