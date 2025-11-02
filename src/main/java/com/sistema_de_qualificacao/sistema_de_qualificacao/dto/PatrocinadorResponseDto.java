package com.sistema_de_qualificacao.sistema_de_qualificacao.dto;

import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Patrocinador;
import java.util.UUID;

public record PatrocinadorResponseDto(
        UUID patrocinadorId,
        String nomePatrocinador
) {
    public static PatrocinadorResponseDto fromEntity(Patrocinador patrocinador) {
        return new PatrocinadorResponseDto(
                patrocinador.getPatrocinadorId(),
                patrocinador.getNomePatrocinador()
        );
    }
}