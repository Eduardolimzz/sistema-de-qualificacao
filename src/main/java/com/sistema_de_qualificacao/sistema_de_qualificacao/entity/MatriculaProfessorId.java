package com.sistema_de_qualificacao.sistema_de_qualificacao.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode
public class MatriculaProfessorId implements Serializable {

    private static final long serialVersionUID = 1L;

    private UUID professorId;
    private UUID cursoId;

}
