package com.sistema_de_qualificacao.sistema_de_qualificacao.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AvaliacaoResponseDto {
    private UUID avaliacaoId;
    private UUID cursoId;
    private String tituloAvaliacao;
    private String descricaoAvaliacao;
    private LocalDateTime dataCriacao;
    private Double pesoAvaliacao;

    // Dados relacionados
    private String nomeCurso;
    private String nivelCurso;
    private String duracaoCurso;
}