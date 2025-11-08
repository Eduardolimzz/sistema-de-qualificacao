package com.sistema_de_qualificacao.sistema_de_qualificacao.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateBoletimDto {

    @NotNull(message = "ID do curso é obrigatório")
    private UUID cursoId;

    @NotNull(message = "ID do aluno é obrigatório")
    private UUID alunoId;

}