import { Routes, Route } from 'react-router-dom';
import Layout from './componentes/Layout/';
import AlunosPage from "./Pages/AlunosPage/AlunosPage";


function App() {
  return (
  <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<AlunosPage />} />
            <Route path="*" element={<h2>Página não encontrada dentro do Layout</h2>} />
          </Route>
        </Routes>
    );
  }

export default App;