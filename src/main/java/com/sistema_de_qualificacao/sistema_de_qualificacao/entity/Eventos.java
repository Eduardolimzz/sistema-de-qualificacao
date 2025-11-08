package com.sistema_de_qualificacao.sistema_de_qualificacao.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
@Table(name = "tb_eventos")
public class Eventos {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "eventosId", nullable = false)
    private UUID eventosId;

    @Column(name = "nome_evento")
    private String nomeEvento;

    @Column(name = "data_evento")
    private String dataEvento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curso_id", referencedColumnName = "cursoId", nullable = false)
    private Curso curso;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "tb_evento_patrocinador",
            joinColumns = @JoinColumn(name = "evento_id"),
            inverseJoinColumns = @JoinColumn(name = "patrocinador_id")
    )
    private List<Patrocinador> patrocinadores;
}