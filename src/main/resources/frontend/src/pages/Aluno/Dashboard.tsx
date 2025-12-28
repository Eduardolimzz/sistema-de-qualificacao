import { useState } from 'react'; // <-- 1. IMPORTEI O useState
import authService from '../../Services/authService'; // <-- 2. IMPORTEI O authService
import estilos from './Dashboard.module.css';

// --- Dados de Exemplo (Mocados) ---
// (O resto do seu código de dados mocados continua o mesmo)
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
    image: 'https://miro.medium.com/v2/resize:fit:4800/format:webp/1*kci3fAxsO-1c9zmkB1tZJw.jpeg',
  },
  {
    id: 2,
    title: 'Node.js Avançado',
    progress: 52,
    image: 'https://www.driven.com.br/wp-content/uploads/2023/02/javascript-foreach-01-1024x768.jpg',
  },
  {
    id: 3,
    title: 'Python para Data Science',
    progress: 84,
    image: 'https://t.ctcdn.com.br/_BmTPdX4R5ocLpI-1OgpXBNGFuQ=/1024x576/smart/i522449.jpeg',
  },
];
// --- Fim dos Dados Mocados ---


const Dashboard = () => {

  // 3. ADICIONEI O ESTADO QUE LÊ O NOME DO USUÁRIO
  const [nomeUsuario, setNomeUsuario] = useState(() => {
    const nomeSalvo = authService.getUserName(); // Pega "ian" do localStorage
    // Verifica se o nome é inválido (vazio, 'null' ou 'undefined')
    if (!nomeSalvo || nomeSalvo === 'null' || nomeSalvo === 'undefined') {
      return "Aluno"; // Se for, usa "Aluno"
    }
    return nomeSalvo; // Senão, usa o nome salvo ("ian")
  });

  return (
    <div className={`${estilos.dashboardContainer} p-6`}>

      {/* 4. A MUDANÇA É AQUI 👇 */}
      <h1 className={estilos.welcomeHeader}>Olá, {nomeUsuario}!</h1>

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

            <img src={course.image} alt={course.title} className={estilos.courseImage} />

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

            <button className={estilos.continueButton}>Continuar</button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Dashboard;