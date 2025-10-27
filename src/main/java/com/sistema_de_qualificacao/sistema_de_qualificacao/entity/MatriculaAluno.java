package com.sistema_de_qualificacao.sistema_de_qualificacao.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
@Table(name = "tb_matricula_aluno",
        uniqueConstraints = @UniqueConstraint(columnNames = {"alunoId", "cursoId"}))
@IdClass(MatriculaAlunoId.class)
public class MatriculaAluno {

    @Id
    //@Column(name = "alunoId", nullable = false) // nome da coluna no banco
    private UUID alunoId; // nome do atributo

    @Id
   // @Column(name = "cursoId", nullable = false) // nome da coluna no banco
    private UUID cursoId; // nome do atributo

    @Column(name = "status", length = 100, nullable = false)
    private String status;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "alunoId", referencedColumnName = "alunoId",
                insertable = false, updatable = false)
    private Aluno aluno;

  //  @ManyToOne(fetch = FetchType.LAZY)
  //  @JoinColumn(name = "cursoId", referencedColumnName = "cursoId",
   //             insertable = false, updatable = false)
  //  private Curso curso;

}
