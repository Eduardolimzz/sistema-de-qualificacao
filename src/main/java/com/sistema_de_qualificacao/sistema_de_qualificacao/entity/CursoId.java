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
@EqualsAndHashCode
public class CursoId implements Serializable {
    // implements Serializable: a classe esta marcando seus objetos
    // como passiveis de serialização convertendo o objeto em um formato de bytes

    private static final long serialVersionUID = 1L;
    //esse identificador tem o objetivo de Serializar um objeto


    private UUID alunoId;
    private UUID professorId;
    private UUID cursoId;



}
