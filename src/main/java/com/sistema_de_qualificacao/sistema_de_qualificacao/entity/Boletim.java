package com.sistema_de_qualificacao.sistema_de_qualificacao.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tb_boletim",
        uniqueConstraints = @UniqueConstraint(columnNames = {"alunoId", "cursoId"})) // ✅ 1 boletim por aluno por curso
public class Boletim {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "boletimId", nullable = false)
    private UUID boletimId;

    @Column(name = "cursoId", nullable = false)
    private UUID cursoId;

    @Column(name = "alunoId", nullable = false)
    private UUID alunoId;

    @Column(name = "frequencia_boletim", nullable = false)
    private Integer frequenciaBoletim;

    @Column(name = "desempenho_boletim", nullable = false)
    private Double desempenhoBoletim;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cursoId", referencedColumnName = "cursoId",
            insertable = false, updatable = false)
    private Curso curso;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "alunoId", referencedColumnName = "alunoId",
            insertable = false, updatable = false)
    private Aluno aluno;
}