import { Routes, Route, Outlet } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Layout from './componentes/Layout'; // Layout Público
import AlunoLayout from './Pages/Aluno/AlunoLayout';
import PrivateRoute from './components/PrivateRoute';
import Login from './Pages/Login/Login';
import Cadastro from './Pages/Cadastro/Cadastro';
import PaginaHome from './Pages/Public/PaginaHome.jsx';
import Catalogo from './Pages/Public/Catalogo';
import AdminDashboard from './Pages/Admin/Dashboard';
import CRUDAdmin from './Pages/Admin/CRUDAdmin';
import ProfessorDetalhes from './Pages/Admin/ProfessorDetalhes';
import CursoDetalhes from './Pages/Admin/CursoDetalhes';
import ProfessorDashboard from './Pages/Professor/Dashboard';
import ProfessorAlunos from './Pages/Professor/Alunos';
import ProfessorAvaliacoes from './Pages/Professor/Avaliacoes';
import ProfessorEventos from './Pages/Professor/Eventos';
import ProfessorRelatorios from './Pages/Professor/Relatorios';
import ProfessorLayout from './Pages/Professor/ProfessorLayout';
import AlunoDashboard from './Pages/Aluno/Dashboard';
import MenuLateral from './componentes/MenuLateral/MenuLateral';
import Topo from './componentes/Topo/Topo';
import styles from './App.module.css';
import AprendaComMelhores from "./componentes/AprendaComMelhores/AprendaComMelhores";
import AlunoCertificados from './Pages/Aluno/Certificados'
import AlunoEventos from './Pages/Aluno/Eventos'
import AlunoMeusCursos from './Pages/Aluno/MeusCursos'

function App() {
  return (
    <>
    <ScrollToTop />
    <Routes>
      {/* Rota 1: Login (página única, sem layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      {/* Rota 2: Layout Público (para visitantes) */}
      {/* Somente as páginas públicas ficam aninhadas aqui */}
      <Route path="/" element={<Layout />}>
        <Route index element={<PaginaHome />} />
        <Route path="catalogo" element={<Catalogo />} />
        <Route path="inicio" element={<PaginaHome />} />
      </Route>

      {/* Rota 3: Layout Privado - Aluno */}
      <Route
        path="/aluno"
        element={

            <AlunoLayout />

        }
      >
      <Route index element={<AlunoDashboard />} />
        <Route path="dashboard" element={<AlunoDashboard />} />
        <Route path="certificados" element={<AlunoCertificados />} />
        <Route path="eventos" element={<AlunoEventos />} />
        <Route path="meus_cursos" element={<AlunoMeusCursos />} />


      </Route>

      {/* Rota 4: Layout Privado - Professor */}
      <Route
        path="/professor"
        element={
          <PrivateRoute>
            <ProfessorLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<ProfessorDashboard />} />
        <Route path="alunos" element={<ProfessorAlunos />} />
        <Route path="avaliacoes" element={<ProfessorAvaliacoes />} />
        <Route path="eventos" element={<ProfessorEventos />} />
        <Route path="relatorios" element={<ProfessorRelatorios />} />
      </Route>

      {/* Rota 5: Layout Privado - Admin  */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <div><Outlet /></div>
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="crud" element={<CRUDAdmin />} />
        <Route path="professor/:professorId" element={<ProfessorDetalhes />} />
        <Route path="curso/:cursoId" element={<CursoDetalhes />} />
      </Route>

      {/* Rota catch-all (página não encontrada) */}
      <Route path="*" element={<h2>Página não encontrada</h2>} />
    </Routes>

    </>
  );
}

export default App;