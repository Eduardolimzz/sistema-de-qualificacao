package com.sistema_de_qualificacao.sistema_de_qualificacao.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RespostaAvaliacaoResponseDto {
    private UUID respostaAvaliacaoId;
    private UUID avaliacaoId;
    private UUID alunoId;
    private String textoResposta;
    private Double notaObtida;
    private String statusResposta;
    private LocalDateTime dataInicio;
    private LocalDateTime dataConclusao;

    // Dados adicionais para exibição
    private String nomeAluno;
    private String emailAluno;
    private String tituloAvaliacao;
    private String nomeCurso;
    private Double pesoAvaliacao;
}