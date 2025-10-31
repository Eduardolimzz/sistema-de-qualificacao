package com.sistema_de_qualificacao.sistema_de_qualificacao.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class AvaliacaoId implements Serializable {

    private static final long serialVersionUID = 1L;

    private UUID alunoId;
    private UUID cursoId;
    private UUID avaliacaoId;

}
