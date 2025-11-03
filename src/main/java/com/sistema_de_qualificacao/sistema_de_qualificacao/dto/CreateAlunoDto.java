package com.sistema_de_qualificacao.sistema_de_qualificacao.dto;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAlunoDto {
    private String nomealuno;
    private String emailaluno;
    private String senhaaluno;
}
