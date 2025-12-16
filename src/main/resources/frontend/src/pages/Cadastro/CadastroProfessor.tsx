import React from 'react';
import styles from './Cadastro.module.css'; // Reutiliza o mesmo CSS
import Topo from '../../componentes/Topo/Topo';
import MenuLateral from '../../componentes/MenuLateral/MenuLateral';
import CardCadastrar from '../../componentes/CardCadastrar/CardCadastrar';

const CadastroProfessor = () => {
  return (
    <div className={styles.cadastroPage}>
      <Topo />
      <MenuLateral />

      <section className={styles.conteudo}>
        <h2>Cadastro de Professor</h2>
        <p>Compartilhe seu conhecimento com milhares de alunos</p>

        <CardCadastrar tipo="professor" />
      </section>
    </div>
  );
};

export default CadastroProfessor;