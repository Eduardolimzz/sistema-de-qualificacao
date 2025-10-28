package com.sistema_de_qualificacao.sistema_de_qualificacao.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tb_professor")
public class Professor {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "professorId")
    private UUID professorId;

    @Column(name = "nomeprofessor")
    private String nomeprofessor;

    @Column(name = "emailprofessor")
    private String emailprofessor;

    @Column(name = "senhaprofessor")
    private String senhaprofessor;

    //aqui é registrado o tempo em que é criado o aluno
    @CreationTimestamp
    private Instant creationTimestamp;

    //aqui é atualizado o tempo em que é criado o aluno
    @UpdateTimestamp
    private Instant updateTimestamp;
}
