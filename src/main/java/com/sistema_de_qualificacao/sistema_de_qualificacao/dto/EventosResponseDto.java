package com.sistema_de_qualificacao.sistema_de_qualificacao.dto;

import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Eventos;

import java.util.UUID;

// DTO de resposta para evitar problemas de serialização
public record EventosResponseDto(
        UUID eventosId,
        String nomeEvento,
        String dataEvento,
        UUID cursoId // Retorna apenas o ID do curso, não o objeto completo
) {
    public static EventosResponseDto fromEntity(Eventos evento) {
        return new EventosResponseDto(
                evento.getEventosId(),
                evento.getNomeEvento(),
                evento.getDataEvento(),
                // Acessa o ID da entidade relacionada (o ID é carregado sem o lazy loading)
                evento.getCurso().getCursoId()
        );
    }
}