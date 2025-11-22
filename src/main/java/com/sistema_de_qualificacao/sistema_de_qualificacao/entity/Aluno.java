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

@AllArgsConstructor // aqui é criado todos os construtores da classe (por meio da importação lombok)
@NoArgsConstructor // criado um construtor vazio (por meio da importação lombok)
@Data // aqui é criado todos os getters end setters (por meio da importação lombok)
@Entity
@Table(name = "tb_aluno")
public class Aluno {

    @Id //identificar que o atributo da classe vai ser um ID no banco de dados
    @GeneratedValue(strategy = GenerationType.UUID)  //vai ser gerado de forma automática
    @Column(name = "alunoId")
    private UUID alunoId;

    //aqui é criado cada atributo do nosso UML
    @Column(name = "nomealuno")
    private String nomealuno;

    @Column(name = "emailaluno")
    private String emailaluno;

    @Column(name = "senhaaluno")
    private String senhaaluno;

    //aqui é registrado o tempo em que é criado o aluno
    @CreationTimestamp
    private Instant creationTimestamp;

    //aqui é atualizado o tempo em que é criado o aluno
    @UpdateTimestamp
    private Instant updateTimestamp;
}