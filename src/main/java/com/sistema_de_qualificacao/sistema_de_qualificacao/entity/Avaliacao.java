package com.sistema_de_qualificacao.sistema_de_qualificacao.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tb_avaliacao")
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "avaliacaoId", nullable = false)
    private UUID avaliacaoId;

    @Column(name = "cursoId", nullable = false)
    private UUID cursoId;

    @Column(name = "titulo_avaliacao", nullable = false, length = 100)
    private String tituloAvaliacao;

    @Column(name = "descricao_avaliacao", length = 500)
    private String descricaoAvaliacao;

    @CreationTimestamp
    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @Column(name = "peso_avaliacao", nullable = false)
    private Double pesoAvaliacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cursoId", referencedColumnName = "cursoId",
            insertable = false, updatable = false)
    private Curso curso;
}