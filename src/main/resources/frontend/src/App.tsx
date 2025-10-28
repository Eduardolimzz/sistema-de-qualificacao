import { Routes, Route } from 'react-router-dom';
import Layout from './componentes/Layout/';
import PaginaHome from './Pages/Public/PaginaHome'
import AlunosPage from "./Pages/CRUD/AlunosPage/AlunosPage";


function App() {
  return (
  <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<PaginaHome />} />
            <Route path="*" element={<h2>Página não encontrada dentro do Layout</h2>} />
          </Route>
        </Routes>
    );
  }

export default App;