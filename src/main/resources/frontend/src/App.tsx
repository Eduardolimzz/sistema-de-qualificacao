import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';

import PaginaHome from './Pages/PaginaHome.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>


        <Route index element={<PaginaHome />} />



      </Route>
    </Routes>
  );
}

export default App;