package com.sistema_de_qualificacao.sistema_de_qualificacao.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tb_matricula_professor",
        uniqueConstraints = @UniqueConstraint(columnNames = {"professorId", "cursoId"}))
@IdClass(MatriculaProfessorId.class)
public class MatriculaProfessor {
    @Id
    @Column(name = "professorId", nullable = false) // nome da coluna no banco
    private UUID professorId; // nome do atributo

    @Id
    @Column(name = "cursoId", nullable = false) // nome da coluna no banco
    private UUID cursoId; // nome do atributo

    @Column(name = "status_professor", length = 100, nullable = false)
    private String status_professor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professorId", referencedColumnName = "professorId",
                insertable = false, updatable = false)
    private Professor professor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cursoId", referencedColumnName = "cursoId",
                insertable = false, updatable = false)
    private Curso curso;

}
