package com.sistema_de_qualificacao.sistema_de_qualificacao.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LancarNotaDto {

    @NotNull(message = "Nota é obrigatória")
    @Positive(message = "Nota deve ser positiva")
    private Double notaObtida;
}