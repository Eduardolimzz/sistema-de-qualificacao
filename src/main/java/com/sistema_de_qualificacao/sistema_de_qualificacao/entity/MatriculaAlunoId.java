package com.sistema_de_qualificacao.sistema_de_qualificacao.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode // é uma funcionalidade que habilita automaticamente os métodos equals e hashCode
//equals(): determina a igualdade lógica entre dois objetos,
// comparando os valores dos seus atributos de acordo com a logica
//hashCode(): Gera um codigo para um objeto, esse numero é usado para otimizar a busca e o armazenamento
// agrupando os em buckets
public class MatriculaAlunoId implements Serializable {
    // implements Serializable: a classe esta marcando seus objetos
    // como passiveis de serialização convertendo o objeto em um formato de bytes

    private static final long serialVersionUID = 1L;
    //esse identificador tem o objetivo de Serializar um objeto


    private UUID idAluno;
    private UUID idCurso;
}
