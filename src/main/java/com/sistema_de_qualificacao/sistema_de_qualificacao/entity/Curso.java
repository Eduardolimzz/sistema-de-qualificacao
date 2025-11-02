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
    @Id //identificar que o atributo da classe vai ser um ID no banco de dados
    @GeneratedValue(strategy = GenerationType.UUID)  //vai ser gerado de forma automática
    @Column(name = "cursoId")
    private UUID cursoId;

    @Column(name = "duracao_curso")
    private String duracao_curso;

    @Column(name = "nomecurso")
    private String nomecurso;

    @Column(name = "nivel_curso")
    private String nivel_curso;


    @CreationTimestamp
    private Instant creationTimestamp;

    @UpdateTimestamp
    private Instant updateTimestamp;

    //relações

    @OneToMany(mappedBy = "curso", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<MatriculaAluno> matriculaAluno;

    @OneToMany(mappedBy = "curso", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<MatriculaProfessor> matriculaProfessor;

    @OneToMany(mappedBy = "curso", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Eventos> eventos;

    @OneToOne(mappedBy = "curso", fetch = FetchType.LAZY)
    @JsonIgnore
    private Certificado certificado;

}
