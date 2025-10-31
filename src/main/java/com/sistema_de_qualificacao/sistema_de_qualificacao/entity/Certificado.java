package com.sistema_de_qualificacao.sistema_de_qualificacao.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Entity
// Remova @Data e use os específicos:
@Getter
@Setter
@ToString(exclude = {"aluno", "curso"}) // <--- ESSENCIAL!
@EqualsAndHashCode(exclude = {"aluno", "curso"}) // BOA PRÁTICA!
@Table(name = "tb_certificado",
        uniqueConstraints = @UniqueConstraint(columnNames = {"alunoId", "cursoId"}))

public class Certificado implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "certificadoId")
    private UUID certificadoId;

    @Column(name = "data_conclusao")
    private String data_conclusao;


    //relações
    @OneToOne (fetch = FetchType.LAZY)
    @JoinColumn(name = "alunoId", nullable = false, unique = true)
    private Aluno  aluno;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cursoId", nullable = false, unique = true)
    private Curso curso;
}

