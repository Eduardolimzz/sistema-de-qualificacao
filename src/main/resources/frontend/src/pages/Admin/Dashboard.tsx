const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Professores</h3>
          <p className="text-3xl font-bold text-blue-600">-</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Alunos</h3>
          <p className="text-3xl font-bold text-green-600">-</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Matrículas</h3>
          <p className="text-3xl font-bold text-purple-600">-</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

