package com.sistema_de_qualificacao.sistema_de_qualificacao.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MatriculaProfessorResponseDto {
    private UUID professorId;
    private UUID cursoId;
    private String status_professor;
    private String nomeprofessor;
    private String nomecurso;
}

