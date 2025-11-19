package com.sistema_de_qualificacao.sistema_de_qualificacao.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tb_patrocinador")
public class Patrocinador {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "patrocinadorId")
    private UUID patrocinadorId;

    @Column(name = "nome_patrocinador")
    private String nomePatrocinador;

    @ManyToMany(mappedBy = "patrocinadores", fetch = FetchType.LAZY)
    private List<Eventos> eventos;
}