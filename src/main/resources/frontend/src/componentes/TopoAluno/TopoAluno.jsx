import React, { useState } from 'react'; // 1. Precisa do useState
import { useNavigate } from 'react-router-dom'; // 2. Precisa do navigate (pro logout)
import estilos from './TopoAluno.module.css';
import authService from '../../Services/authService';

export default function TopoAluno() {

  const navigate = useNavigate();


  const [nomeUsuario, setNomeUsuario] = useState(() => {

    const nomeSalvo = authService.getUserName();

    // Verifica se o nome é inválido (vazio, 'null' ou 'undefined')
    if (!nomeSalvo || nomeSalvo === 'null' || nomeSalvo === 'undefined') {
      return "Aluno";
    }
    return nomeSalvo;
  });

  // 4. Função de Logout (que funciona de verdade)
  const handleLogout = () => {
    authService.logout(); // Limpa o localStorage
    navigate('/login');    // Manda o usuário pro login
  };

  return (
    <header className={estilos.topoContainer}>

      <div className={estilos.logoContainer}>
        <img
          src="/LogoICEAA.png"
          alt="Logo Fundação ICEAA"
          className={estilos.logo}
        />
      </div>

      <div className={estilos.userInfo}>
             <div className={estilos.logoContainer}>
                  <img
                    src="/UserIcon.png"
                    alt="Icone de usuário"
                    className={estilos.userIcon}
                  />
                </div>

        {/* 5. MOSTRA O NOME DO ESTADO (que veio do localStorage) */}
        <span className={estilos.greeting}>{nomeUsuario}</span>

        <button onClick={handleLogout} className={estilos.logoutButton}>
          Sair
        </button>
      </div>
    </header>
  );
}