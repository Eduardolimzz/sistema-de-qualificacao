package com.sistema_de_qualificacao.sistema_de_qualificacao.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BoletimResponseDto {
    private UUID boletimId;
    private UUID cursoId;
    private UUID alunoId;
    private Integer frequenciaBoletim;
    private Double desempenhoBoletim;

    // Dados adicionais
    private String nomeAluno;
    private String emailAluno;
    private String nomeCurso;
    private String nivelCurso;
    private String statusAprovacao; // APROVADO, REPROVADO, RECUPERACAO
}