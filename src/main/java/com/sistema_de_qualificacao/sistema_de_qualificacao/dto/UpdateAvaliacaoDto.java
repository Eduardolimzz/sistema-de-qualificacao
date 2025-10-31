package com.sistema_de_qualificacao.sistema_de_qualificacao.dto;

import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateAvaliacaoDto {

    private String tituloAvaliacao;

    private String descricaoAvaliacao;

    @Positive(message = "Peso deve ser maior que zero")
    private Double pesoAvaliacao;
}