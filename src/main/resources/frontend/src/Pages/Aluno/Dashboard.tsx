import estilos from './Dashboard.module.css';

// --- Dados de Exemplo (Mocados) ---
// No futuro, você vai querer buscar esses dados de uma API
const statsData = [
  { title: 'Cursos Inscritos', value: 3 },
  { title: 'Concluídos', value: 0 },
  { title: 'Horas Estudadas', value: '23h' },
];

const coursesData = [
  {
    id: 1,
    title: 'Introdução ao React',
    progress: 72,
    image: 'https://miro.medium.com/v2/resize:fit:4800/format:webp/1*kci3fAxsO-1c9zmkB1tZJw.jpeg', // Imagem de exemplo
  },
  {
    id: 2,
    title: 'Node.js Avançado',
    progress: 52,
    image: 'https://www.driven.com.br/wp-content/uploads/2023/02/javascript-foreach-01-1024x768.jpg', // Imagem de exemplo
  },
  {
    id: 3,
    title: 'Python para Data Science',
    progress: 84,
    image: 'https://t.ctcdn.com.br/_BmTPdX4R5ocLpI-1OgpXBNGFuQ=/1024x576/smart/i522449.jpeg', // Imagem de exemplo
  },
];
// --- Fim dos Dados Mocados ---


const Dashboard = () => {
  return (
    // Container principal do dashboard
    // A classe 'p-6' que você tinha foi movida para este container
    <div className={`${estilos.dashboardContainer} p-6`}> 
      
      {/* 1. Cabeçalho de Boas-vindas */}
      <h1 className={estilos.welcomeHeader}>Olá, Aluno X!</h1>
      <p className={estilos.welcomeSubheader}>Continue sua jornada de aprendizado</p>

      {/* 2. Cartões de Estatísticas */}
      <div className={estilos.statsGrid}>
        {statsData.map((stat) => (
          <div key={stat.title} className={estilos.statCard}>
            <p className={estilos.statTitle}>{stat.title}</p>
            <p className={estilos.statValue}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 3. Seção "Cursos em Andamento" */}
      <h2 className={estilos.sectionTitle}>Cursos em Andamento</h2>
      
      <div className={estilos.coursesList}>
        {coursesData.map((course) => (
          <div key={course.id} className={estilos.courseCard}>
            
            {/* Imagem do Curso */}
            <img src={course.image} alt={course.title} className={estilos.courseImage} />
            
            {/* Informações do Curso (Título e Progresso) */}
            <div className={estilos.courseInfo}>
              <h3 className={estilos.courseTitle}>{course.title}</h3>
              <p className={estilos.progressLabel}>Progresso</p>
              
              <div className={estilos.progressContainer}>
                <div className={estilos.progressBarContainer}>
                  <div 
                    className={estilos.progressBarFill} 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <span className={estilos.progressPercent}>{course.progress}%</span>
              </div>
            </div>

            {/* Botão de Continuar */}
            <button className={estilos.continueButton}>Continuar</button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Dashboard;