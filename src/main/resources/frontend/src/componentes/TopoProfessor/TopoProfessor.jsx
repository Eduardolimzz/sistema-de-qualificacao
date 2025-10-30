import React from 'react';
import estilos from './TopoProfessor.module.css';
import { useNavigate } from 'react-router-dom';
import authService from '../../Services/authService';

export default function TopoProfessor() {
  const navigate = useNavigate();

  return (
    <header className={estilos.topo}>
      <div className={estilos.logoContainer}>
        <img src="/LogoICEAA.png" alt="Logo Fundação ICEAA" className={estilos.logo} />
      </div>
      <div className={estilos.userInfo}>
        <div className={estilos.userLabel}>
          <img src="/UserIcon.png" alt="Usuário" className={estilos.userIcon} />
          <span className={estilos.greeting}>Professor</span>
        </div>
        <button
          onClick={() => {
            authService.logout();
            localStorage.removeItem('authBypass');
            navigate('/login');
          }}
          className={estilos.logoutButton}
        >
          Sair
        </button>
      </div>
    </header>
  );
}


