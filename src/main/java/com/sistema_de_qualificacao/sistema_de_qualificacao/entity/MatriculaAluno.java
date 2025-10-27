package com.sistema_de_qualificacao.sistema_de_qualificacao.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
@Table(name = "tb_matricula_aluno",
        uniqueConstraints = @UniqueConstraint(columnNames = {"id_aluno", "id_curso"}))
@IdClass(MatriculaAlunoId.class)
public class MatriculaAluno {


    private

}
