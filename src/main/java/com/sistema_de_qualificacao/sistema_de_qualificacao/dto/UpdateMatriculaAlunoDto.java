package com.sistema_de_qualificacao.sistema_de_qualificacao.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateMatriculaAlunoDto {

    @NotBlank(message = "Status é obrigatório")
    private String status;
}
