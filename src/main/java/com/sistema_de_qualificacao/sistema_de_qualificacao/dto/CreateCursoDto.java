package com.sistema_de_qualificacao.sistema_de_qualificacao.dto;
import lombok.Data;

@Data
public class CreateCursoDto {
    private String duracao_curso;
    private String nomecurso;
    private String nivel_curso;

    public CreateCursoDto(String duracao_curso, String nomecurso, String nivel_curso) {
        this.duracao_curso = duracao_curso;
        this.nomecurso = nomecurso;
        this.nivel_curso = nivel_curso;
    }
}
