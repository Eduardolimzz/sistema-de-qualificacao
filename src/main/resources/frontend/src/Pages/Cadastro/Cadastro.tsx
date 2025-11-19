import React from 'react';
import styles from './Cadastro.module.css';
import Topo from '../../componentes/Topo/Topo';
import MenuLateral from '../../componentes/MenuLateral/MenuLateral';
import CardCadastrar from '../../componentes/CardCadastrar/CardCadastrar';

const Cadastro = () => {
  return (
    <div className={styles.cadastroPage}>
      <Topo />
      <MenuLateral />

      <section className={styles.conteudo}>
        <h2>Crie sua conta</h2>
        <p>Comece sua jornada de aprendizado hoje</p>

        <CardCadastrar />
        </section>
    </div>
  );
};

export default Cadastro;