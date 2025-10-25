package com.sistema_de_qualificacao.sistema_de_qualificacao.dto;

import lombok.Data;

@Data
public class CreateProfessorDto {
    private String nomeprofessor;
    private String emailprofessor;
    private String senhaprofessor;
    public CreateProfessorDto(String nomeprofessor, String emailprofessor, String senhaprofessor) {
        this.nomeprofessor = nomeprofessor;
        this.emailprofessor = emailprofessor;
        this.senhaprofessor = senhaprofessor;
    }

}

