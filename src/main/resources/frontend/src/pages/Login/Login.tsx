import React from 'react';
import styles from './Login.module.css';
import CardEntrar from '../../componentes/CardEntrar/CardEntrar';
import Topo from '../../componentes/Topo/Topo';
import MenuLateral from '../../componentes/MenuLateral/MenuLateral';

const Login = () => {
  return (
    <div className={styles.loginPage}>
      <Topo />
      <MenuLateral />
        <section className={styles.entrar}>

            <h2>Bem-vindo de volta!</h2>
            <p>Entre na sua conta para continuar aprendendo</p>

            <CardEntrar />
        </section>
    </div>
  );
};

export default Login;