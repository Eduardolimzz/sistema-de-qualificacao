package com.sistema_de_qualificacao.sistema_de_qualificacao.dto;
import lombok.Data;

@Data
public class CreateAlunoDto {
    private String nomealuno;
    private String emailaluno;
    private String senhaaluno;

    public CreateAlunoDto(String nomealuno, String emailaluno, String senhaaluno) {
        this.nomealuno = nomealuno;
        this.emailaluno = emailaluno;
        this.senhaaluno = senhaaluno;
    }
}
