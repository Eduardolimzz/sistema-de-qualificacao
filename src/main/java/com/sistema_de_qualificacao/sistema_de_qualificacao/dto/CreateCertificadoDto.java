package com.sistema_de_qualificacao.sistema_de_qualificacao.dto;

import lombok.Data;

@Data
public class CreateCertificadoDto {
    private String data_conclusao;
    private String alunoId; // O ID do Aluno
    private String cursoId; // O ID do Curso

    public CreateCertificadoDto(String data_conclusao, String alunoId, String cursoId) {
        this.data_conclusao = data_conclusao;
        this.alunoId = alunoId;
        this.cursoId = cursoId;
    }
}
