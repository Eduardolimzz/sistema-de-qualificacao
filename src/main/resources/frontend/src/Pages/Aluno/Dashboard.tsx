const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Aluno</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Nota Média</h3>
          <p className="text-3xl font-bold text-green-600">-</p>
          <p className="text-sm text-gray-600 mt-2">Sua média geral</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Materias Cursadas</h3>
          <p className="text-3xl font-bold text-blue-600">-</p>
          <p className="text-sm text-gray-600 mt-2">Total de matérias</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

