import React, { useState } from 'react';
import styles from './CursosCatalogo.module.css';
import CardCurso from '../CardCurso/CardCurso';
import ModalDetalhes from '../ModalDetalhes/ModalDetalhes';
import FotoReact from '../../assets/FotoReact.png';
import FotoNode from '../../assets/FotoNode.png';
import FotoPython from '../../assets/Fotopython.png';
import FotoUxUi from '../../assets/FotoUxUi.png';
import FotoMarketing from '../../assets/FotoMarketing.png';
import FotoGestao from '../../assets/FotoGestao.png';
import FotoIngles from '../../assets/FotoIngles.png';
import FotoCyberseg from '../../assets/FotoCyberseg.png';
import FotoVendas from '../../assets/FotoVendas.png';


function CursosCatalogo() {
  const courses = [
    {
      image: FotoReact,
      title: 'Introdução ao React',
      description: 'Fundamentos do React para iniciantes',
      fullDescription: 'Este curso cobre todos os fundamentos do React, incluindo hooks, componentes, estado, props e como criar uma aplicação de página única (SPA). Perfeito para quem está começando no frontend.',
      duration: 20,
      lessons: 15,
      students: 1250,
      rating: 4.8,
      tags: ['React', 'Javascript', 'Frontend'],
      professor: 'Juliana Silva',
            modulos: [
              'Módulo 1: Introdução e Setup',
              'Módulo 2: Componentes e Props',
              'Módulo 3: Estado e Hooks (useState, useEffect)',
              'Módulo 4: Renderização Condicional e Listas'
            ]
    },
    {
      image: FotoNode,
      title: 'Node.js Avançado',
      description: 'Node.js para desenvolvedores experientes',
      fullDescription: 'Aprenda a construir APIs robustas e escaláveis com Node.js. Este curso foca em performance, microserviços, testes automatizados e deploy de aplicações backend complexas.',
      duration: 40,
      lessons: 25,
      students: 850,
      rating: 4.9,
      tags: ['Node.js', 'Javascript', 'Backend'],
      professor: 'Ricardo Oliveira',
            modulos: [
              'Módulo 1: Arquitetura de Microserviços',
              'Módulo 2: Testes Avançados (TDD, BDD)',
              'Módulo 3: Performance, Caching e Redis',
              'Módulo 4: Deploy (Docker, Kubernetes)'
            ]
    },
    {
      image: FotoPython,
      title: 'Python para Data Science',
      description: 'Análise de dados com Python e pandas',
      fullDescription: 'Mergulhe na análise de dados usando o poder do Python. Este curso cobre desde a manipulação de dados com Pandas até a visualização com Matplotlib e Seaborn, preparando você para extrair insights valiosos.',
      duration: 35,
      lessons: 22,
      students: 980,
      rating: 4.7,
      tags: ['Python', 'DataScience', 'Pandas'],
      professor: 'Carlos Mendes',
            modulos: [
              'Módulo 1: Introdução ao Ecossistema (Jupyter, Numpy)',
              'Módulo 2: Manipulação de Dados com Pandas',
              'Módulo 3: Limpeza e Tratamento de Dados (Data Wrangling)',
              'Módulo 4: Visualização de Dados (Matplotlib e Seaborn)'
            ]
    },
         {
           image: FotoUxUi,
           title: 'UI/UX Design Completo',
           description: 'Design de interfaces e experiência do usuário',
           fullDescription: 'Domine o processo de design de ponta a ponta, da pesquisa com usuários e wireframes até a criação de protótipos de alta fidelidade no Figma. Crie produtos digitais que sejam bonitos e fáceis de usar.',
           duration: 45,
           lessons: 30,
           students: 1200,
           rating: 4.9,
           tags: ['UI Design', 'UX Design', 'Figma'],
           professor: 'Juliana Costa',
                 modulos: [
                    'Módulo 1: Fundamentos de UX (User Experience)',
                    'Módulo 2: Pesquisa e Personas',
                    'Módulo 3: UI Design e Prototipação no Figma',
                    'Módulo 4: Testes de Usabilidade e Design Systems'
                 ]
         },
            {
              image: FotoMarketing,
              title: 'Marketing Digital Avançado',
              description: 'Estratégias avançadas de marketing digital',
              fullDescription: 'Vá além do básico e aprenda a otimizar campanhas, analisar métricas complexas e integrar estratégias de SEO, SEM e Google Ads para maximizar o ROI e o crescimento do negócio.',
              duration: 28,
              lessons: 18,
              students: 750,
              rating: 4.6,
              tags: ['SEO', 'SEM', 'Google Ads'],
              professor: 'Bruno Farias',
              modulos: [
                'Módulo 1: SEO Técnico e On-Page Avançado',
                'Módulo 2: Gestão de Campanhas (Google Ads e Meta Ads)',
                'Módulo 3: Web Analytics e Otimização de Conversão (CRO)',
                'Módulo 4: Automação de Marketing e Inbound'
              ]
            },
            {
              image: FotoGestao,
              title: 'Gestão de Projetos Ágeis',
              description: 'Metodologias ágeis e gestão de projetos',
              fullDescription: 'Lidere equipes de alta performance com as metodologias ágeis mais usadas no mercado. Aprenda a aplicar Scrum e Kanban para entregar valor de forma rápida, iterativa e adaptativa.',
              duration: 25,
              lessons: 16,
              students: 650,
              rating: 4.8,
              tags: ['Scrum', 'Kanban', 'Agile'],
              professor: 'Patrícia Lima',
              modulos: [
                'Módulo 1: Manifesto Ágil e Princípios',
                'Módulo 2: O Framework Scrum (Papéis, Cerimônias, Artefatos)',
                'Módulo 3: Kanban na Prática (Fluxo, WIP, Métricas)',
                'Módulo 4: Gerenciamento Ágil de Portfólio'
              ]
            },
            {
              image: FotoIngles,
              title: 'Inglês para Programadores',
              description: 'Inglês técnico para desenvolvedores',
              fullDescription: 'Destrave sua carreira global. Este curso foca no vocabulário técnico essencial para ler documentações, escrever código limpo, participar de code reviews e se comunicar em entrevistas de emprego.',
              duration: 30,
              lessons: 20,
              students: 1100,
              rating: 4.5,
              tags: ['Inglês', 'Técnico', 'Programação'],
              professor: 'David Johnson',
              modulos: [
                'Módulo 1: Vocabulário Essencial (Variáveis, Funções, Loopings)',
                'Módulo 2: Lendo e Escrevendo Documentação Técnica',
                'Módulo 3: Comunicação (Code Review, Git, Reuniões)',
                'Módulo 4: Preparação para Entrevistas Técnicas'
              ]
            },
            {
              image: FotoCyberseg,
              title: 'Cibersegurança Essencial',
              description: 'Fundamentos de segurança da informação',
              fullDescription: 'Proteja dados e sistemas contra ameaças digitais. Aprenda os conceitos fundamentais de cibersegurança, desde análise de vulnerabilidades e redes seguras até a conformidade com a LGPD.',
              duration: 32,
              lessons: 24,
              students: 420,
              rating: 4.9,
              tags: ['Segurança', 'Cibersegurança', 'LGPD'],
              professor: 'Rafael Souza',
              modulos: [
                'Módulo 1: Conceitos de Segurança e Ameaças',
                'Módulo 2: Segurança de Redes e Infraestrutura',
                'Módulo 3: Criptografia e Gestão de Identidade',
                'Módulo 4: Análise de Riscos e Conformidade (LGPD)'
              ]
            },
            {
              image: FotoVendas,
              title: 'Vendas e Negociação',
              description: 'Técnicas avançadas de vendas e negociação',
              fullDescription: 'Domine a arte de persuadir e fechar negócios. Este curso aborda técnicas de negociação complexas, funil de vendas, gestão de pipeline e o uso estratégico de ferramentas de CRM para alavancar resultados.',
              duration: 22,
              lessons: 14,
              students: 580,
              rating: 4.7,
              tags: ['Vendas', 'Negociação', 'CRM'],
              professor: 'Lucas Almeida',
              modulos: [
                'Módulo 1: Psicologia da Venda e Persuasão',
                'Módulo 2: Técnicas de Negociação (BATNA, ZOPA)',
                'Módulo 3: Gestão de Funil de Vendas e Pipeline',
                'Módulo 4: Uso Eficiente de CRM'
              ]
            }
  ];

  const [cursoSelecionado, setCursoSelecionado] = useState(null);

  const handleVerDetalhes = (curso) => {
    setCursoSelecionado(curso);
  };

  const handleCloseModal = () => {
    setCursoSelecionado(null);
  };

  return (
    <section className={styles.CursosCatalogo}>
      <h2>Catálogo de cursos</h2>
      <p>Encontre o curso perfeito para sua carreira!</p>
      <div className={styles['cursos-grid']}>
        {courses.map((course) => (
          <CardCurso
            key={course.title}
            image={course.image}
            title={course.title}
            description={course.description}
            duration={course.duration}
            lessons={course.lessons}
            students={course.students}
            rating={course.rating}
            tags={course.tags}
            onVerDetalhesClick={() => handleVerDetalhes(course)}
          />
        ))}
      </div>

      <ModalDetalhes
        curso={cursoSelecionado}
        onClose={handleCloseModal}
      />
    </section>
  );
}

export default CursosCatalogo;




