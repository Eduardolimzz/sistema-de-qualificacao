import React from 'react';
import estilos from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;        // true ou false, para mostrar ou esconder
  onClose: () => void;    // Função para fechar (clicando no 'X' ou 'Cancelar')
  onConfirm: () => void;  // Função para rodar quando clicar em 'Confirmar'
  title: string;          // O título do modal
  children: React.ReactNode; // O texto/conteúdo que vai no meio (ex: <p>Tem certeza?</p>)
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
  // Se não estiver aberto, não renderize nada (retorna null)
  if (!isOpen) {
    return null;
  }

  return (
    // 1. O "fundo" escuro que cobre a tela
    // Ao clicar nele, ele chama a função onClose
    <div className={estilos.modalOverlay} onClick={onClose}>

      {/* 2. O "card" branco do modal
          Usamos e.stopPropagation() para evitar que o clique nele
          seja propagado para o fundo e feche o modal */}
      <div className={estilos.modalContent} onClick={(e) => e.stopPropagation()}>

        {/* 3. Cabeçalho com Título e Botão de Fechar */}
        <div className={estilos.modalHeader}>
          <h2 className={estilos.modalTitle}>{title}</h2>
          <button className={estilos.closeButton} onClick={onClose}>
            &times; {/* Isso é um "X" bonitinho */}
          </button>
        </div>

        {/* 4. Corpo (Onde o 'children' é renderizado) */}
        <div className={estilos.modalBody}>
          {children}
        </div>

        {/* 5. Rodapé com os botões de ação */}
        <div className={estilos.modalFooter}>
          <button className={estilos.cancelButton} onClick={onClose}>
            Cancelar
          </button>
          <button className={estilos.confirmButton} onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;