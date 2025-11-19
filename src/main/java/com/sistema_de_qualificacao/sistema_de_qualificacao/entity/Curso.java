package com.sistema_de_qualificacao.sistema_de_qualificacao.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "tb_curso")
public class Curso {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "cursoId")
    private UUID cursoId;

    @Column(name = "nomecurso")
    private String nomecurso;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "duracao_curso")
    private String duracao_curso;

    @Column(name = "nivel_curso")
    private String nivel_curso;

    @Column(name = "lessons")
    private Integer lessons; // número de aulas

    @Column(name = "enrolled")
    private Integer enrolled = 0; // quantos alunos matriculados

    @Column(name = "rating")
    private Double rating = 0.0;

    @Column(name = "tags")
    private String tags; // guardado como string separada por vírgula

    @Column(name = "image")
    private String image;

    @CreationTimestamp
    private Instant creationTimestamp;

    @UpdateTimestamp
    private Instant updateTimestamp;

    // relações (mantém como está)
    @OneToMany(mappedBy = "curso", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<MatriculaAluno> matriculaAluno;

    @OneToMany(mappedBy = "curso", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<MatriculaProfessor> matriculaProfessor;

    @OneToOne(mappedBy = "curso", fetch = FetchType.LAZY)
    @JsonIgnore
    private Certificado certificado;
}
