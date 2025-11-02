package com.sistema_de_qualificacao.sistema_de_qualificacao.dto;

import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Eventos;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Patrocinador; // Importar Patrocinador
import java.util.List; // Importar List
import java.util.UUID;

public record EventosResponseDto(
        UUID eventosId,
        String nomeEvento,
        String dataEvento,
        UUID cursoId,
        List<UUID> patrocinadorIds
) {
    public static EventosResponseDto fromEntity(Eventos evento) {
        return new EventosResponseDto(
                evento.getEventosId(),
                evento.getNomeEvento(),
                evento.getDataEvento(),


                evento.getCurso().getCursoId(),


                evento.getPatrocinadores().stream()
                        .map(Patrocinador::getPatrocinadorId)
                        .toList()
        );
    }
}