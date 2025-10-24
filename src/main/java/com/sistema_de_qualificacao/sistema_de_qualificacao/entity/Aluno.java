package com.sistema_de_qualificacao.sistema_de_qualificacao.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "tb_aluno")
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID alunoId;

    @Column(name = "nomealuno")
    private String nomeAluno;

    @Column(name = "emailaluno")
    private String emailAluno;

    @Column(name = "senhaaluno")
    private String senhaAluno;

    @CreationTimestamp
    private Instant creationTimestamp;

    @CreationTimestamp
    private Instant updateTimestamp;
}