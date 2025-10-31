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
@Table(name = "tb_avaliacao",
        uniqueConstraints = @UniqueConstraint(columnNames = {"alunoId", "cursoId"}))
@IdClass(AvaliacaoId.class)
public class Avaliacao {

    @Id
    @Column(name = "avaliacaoId", nullable = false)
    private UUID avaliacaoId;//provavelmente irei ter que tirar pois eu vou criar essa avaliacao Id na controller

    @Id
    @Column(name = "alunoId", nullable = false)
    private UUID alunoId;

    @Id
    @Column(name = "cursoId", nullable = false)
    private UUID cursoId;

    @Column(name = "nota_avaliacao", nullable = false)
    private Integer nota_avaliacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cursoId", referencedColumnName = "cursoId",
            insertable = false, updatable = false)
    private Curso curso;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "alunoId", referencedColumnName = "alunoId",
            insertable = false, updatable = false)
    private Aluno aluno;
}