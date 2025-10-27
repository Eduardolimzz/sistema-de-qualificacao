package com.sistema_de_qualificacao.sistema_de_qualificacao.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MatriculaAlunoResponseDto {

    private UUID alunoId;
    private UUID cursoId;
    private String status;
    private String nomealuno;
    private String nomecurso;
}
