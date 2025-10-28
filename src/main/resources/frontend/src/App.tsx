import { Routes, Route, Outlet } from 'react-router-dom';
import Layout from './componentes/Layout';
import PrivateRoute from './components/PrivateRoute';
import Login from './Pages/Login/Login';
import AlunosPage from './Pages/AlunosPage/AlunosPage.jsx';
import PaginaHome from './Pages/PaginaHome.jsx';
import AdminDashboard from './Pages/Admin/Dashboard';
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
        <Route path="cursos" element={<AlunosPage />} />
        
        {/* Rotas privadas - Admin */}
        <Route
          path="admin"
          element={
            <PrivateRoute>
              <div><Outlet /></div>
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
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