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
@Table(name = "tb_resposta_avaliacao")
public class RespostaAvaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "respostaAvaliacaoId", nullable = false)
    private UUID respostaAvaliacaoId;

    @Column(name = "avaliacaoId", nullable = false)
    private UUID avaliacaoId;

    @Column(name = "alunoId", nullable = false)
    private UUID alunoId;

    @Column(name = "texto_resposta", columnDefinition = "TEXT", nullable = false)
    private String textoResposta;

    @Column(name = "nota_obtida")
    private Double notaObtida;

    @Column(name = "status_resposta", nullable = false, length = 100)
    private String statusResposta;

    @CreationTimestamp
    @Column(name = "data_inicio", nullable = false, updatable = false)
    private LocalDateTime dataInicio;

    @Column(name = "data_conclusao")
    private LocalDateTime dataConclusao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "alunoId", referencedColumnName = "alunoId",
            insertable = false, updatable = false)
    private Aluno aluno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "avaliacaoId", referencedColumnName = "avaliacaoId",
            insertable = false, updatable = false)
    private Avaliacao avaliacao;
}