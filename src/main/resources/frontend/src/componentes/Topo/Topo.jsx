import estilos from './Topo.module.css';

export default function Topo() {
  return (
    <div className={estilos.topo_container}>
      <div className={estilos.left_section}>
        <img src="/LogoICEAA.png" alt="Logo ICEAA" className={estilos.logo} />
      </div>
      <div className={estilos.right_section}>
        <button className={estilos.login_button}>Entrar</button>
        <button className={estilos.register_button}>Cadastrar</button>
      </div>
    </div>
  );
}