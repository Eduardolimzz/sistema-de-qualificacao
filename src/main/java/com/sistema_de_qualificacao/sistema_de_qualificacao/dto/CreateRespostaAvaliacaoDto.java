package com.sistema_de_qualificacao.sistema_de_qualificacao.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateRespostaAvaliacaoDto {

    @NotNull(message = "ID da avaliação é obrigatório")
    private UUID avaliacaoId;

    @NotNull(message = "ID do aluno é obrigatório")
    private UUID alunoId;

    @NotBlank(message = "Texto da resposta é obrigatório")
    private String textoResposta;
}