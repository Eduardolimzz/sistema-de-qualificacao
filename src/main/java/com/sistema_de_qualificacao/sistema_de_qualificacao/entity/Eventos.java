package com.sistema_de_qualificacao.sistema_de_qualificacao.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    // Propriedade Java: nomeEvento. Coluna DB: nome_evento
    @Column(name = "nome_evento")
    private String nomeEvento;

    // Propriedade Java: dataEvento. Coluna DB: data_evento
    @Column(name = "data_evento")
    private String dataEvento;

    @ManyToOne(fetch = FetchType.LAZY)
    // Usando 'curso_id' como nome da coluna no DB (boa prática para FK)
    @JoinColumn(name = "curso_id", referencedColumnName = "cursoId", nullable = false)
    private Curso curso;

   // @ManyToMany(fetch = FetchType.LAZY)
   // @JoinColumn(name = "patrocinadorId", referencedColumnName = "patrocinadorId",
   //         insertable = false, updatable = false)
    //private Patrocinador patrocinador;


}
