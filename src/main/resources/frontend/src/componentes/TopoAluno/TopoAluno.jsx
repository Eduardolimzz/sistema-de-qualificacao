import React from 'react';
import estilos from './TopoAluno.module.css';



export default function TopoAluno() {

  const nomeAluno = "Aluno X";

  const handleLogout = () => {
    console.log("Logout clicado!");
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
        <span className={estilos.greeting}>{nomeAluno}!</span>
        <button onClick={handleLogout} className={estilos.logoutButton}>
          Sair
        </button>
      </div>
    </header>
  );
}