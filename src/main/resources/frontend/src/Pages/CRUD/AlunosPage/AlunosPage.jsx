import { useEffect, useState } from "react";
import AlunoService from "../../../services/alunoService"; // Importa a camada de serviço

export default function AlunosPage() {
  const [alunos, setAlunos] = useState([]);
  const [novoAluno, setNovoAluno] = useState({
    nomealuno: "",
    emailaluno: "",
    senhaaluno: "",
  });

  useEffect(() => {
    carregarAlunos();
  }, []);

  const carregarAlunos = async () => {
    try {
      const dados = await AlunoService.carregarAlunos();
      setAlunos(dados);
    } catch (e) {
      console.error("Erro ao buscar alunos:", e);
    }
  };

  // --- LÓGICA DE CRIAÇÃO ---
  const criarAluno = async () => {
    try {
      await AlunoService.criarAluno(novoAluno);

      // Limpa o formulário e recarrega a lista
      setNovoAluno({ nomealuno: "", emailaluno: "", senhaaluno: "" });
      carregarAlunos();

    } catch (e) {
      console.error("Falha ao criar aluno:", e);
      alert("Erro ao criar aluno. Verifique o console ou o servidor Java.");
    }
  };

  // --- LÓGICA DE DELETAR ---
  const deletarAluno = async (id) => {
    try {
      await AlunoService.deletarAluno(id);
      carregarAlunos(); // recarrega lista

    } catch (e) {
      console.error("Falha ao deletar aluno:", e);
    }
  };

  // --- JSX (Interface) ---
  return (
    <div style={{ padding: "20px" }}>
      <h1>📚 Lista de Alunos</h1>

      <div style={{ marginBottom: "20px" }}>
        <input placeholder="Nome" value={novoAluno.nomealuno} onChange={(e) => setNovoAluno({ ...novoAluno, nomealuno: e.target.value })}/>

        <input placeholder="Email" value={novoAluno.emailaluno} onChange={(e) => setNovoAluno({ ...novoAluno, emailaluno: e.target.value })}/>

        <input placeholder="Senha" type="password" value={novoAluno.senhaaluno} onChange={(e) => setNovoAluno({ ...novoAluno, senhaaluno: e.target.value })}/>

        <button onClick={criarAluno}>Adicionar Aluno</button>
      </div>

      <ul>
        {alunos.length === 0 ? (
            <li>Nenhum aluno encontrado.</li>
        ) : (
            alunos.map((a) => (
              <li key={a.alunoId}>
                {a.nomealuno} — {a.emailaluno}
                <button
                  onClick={() => deletarAluno(a.alunoId)}
                  style={{ marginLeft: "10px", color: "red" }}
                >
                  Excluir
                </button>
              </li>
            ))
        )}
      </ul>
    </div>
  );
}