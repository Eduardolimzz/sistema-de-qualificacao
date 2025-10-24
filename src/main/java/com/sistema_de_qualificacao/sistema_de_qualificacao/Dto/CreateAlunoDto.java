package com.sistema_de_qualificacao.sistema_de_qualificacao.Dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateAlunoDto {
    private String nomeAluno;
    private String emailAluno;
    private String senhaAluno;
}