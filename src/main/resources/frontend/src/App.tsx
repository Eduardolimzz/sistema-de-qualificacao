import { Routes, Route, Outlet } from 'react-router-dom';
import Layout from './componentes/Layout';
import PrivateRoute from './components/PrivateRoute';
import Login from './Pages/Login/Login';
import AlunosPage from './Pages/CRUD/AlunosPage/AlunosPage.jsx';
import PaginaHome from './Pages/Public/PaginaHome.jsx';
import Catalogo from './Pages/Public/Catalogo';
import AdminDashboard from './Pages/Admin/Dashboard';
import CRUDAdmin from './Pages/Admin/CRUDAdmin';
import ProfessorDetalhes from './Pages/Admin/ProfessorDetalhes';
import CursoDetalhes from './Pages/Admin/CursoDetalhes';
import ProfessorDashboard from './Pages/Professor/Dashboard';
import AlunoDashboard from './Pages/Aluno/Dashboard';

function App() {
  return (
    <Routes>
      {/* Rota pública de login */}
      <Route path="/login" element={<Login />} />
      
      {/* Rotas com layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<PaginaHome />} />
        <Route path="cursos" element={<Catalogo />} />
        <Route path="alunos" element={<AlunosPage />} />
        
        {/* Rotas admin */}
        <Route path="admin">
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="crud" element={<CRUDAdmin />} />
          <Route path="professor/:professorId" element={<ProfessorDetalhes />} />
          <Route path="curso/:cursoId" element={<CursoDetalhes />} />
        </Route>
        
        {/* Rotas privadas - Professor */}
        <Route
          path="professor"
          element={
            <PrivateRoute>
              <div><Outlet /></div>
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<ProfessorDashboard />} />
        </Route>
        
        {/* Rotas privadas - Aluno */}
        <Route
          path="aluno"
          element={
            <PrivateRoute>
              <div><Outlet /></div>
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<AlunoDashboard />} />
        </Route>
        
        {/* Rota catch-all */}
        <Route path="*" element={<h2>Página não encontrada</h2>} />
      </Route>
    </Routes>
  );
}

export default App;