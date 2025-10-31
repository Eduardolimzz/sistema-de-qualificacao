package com.sistema_de_qualificacao.sistema_de_qualificacao.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateAvaliacaoDto {

    @NotNull(message = "ID do curso é obrigatório")
    private UUID cursoId;

    @NotBlank(message = "Título da avaliação é obrigatório")
    private String tituloAvaliacao;

    private String descricaoAvaliacao;

    @NotNull(message = "Peso da avaliação é obrigatório")
    @Positive(message = "Peso deve ser maior que zero")
    private Double pesoAvaliacao;
}