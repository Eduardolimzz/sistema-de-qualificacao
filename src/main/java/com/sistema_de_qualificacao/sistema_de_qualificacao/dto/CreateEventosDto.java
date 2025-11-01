package com.sistema_de_qualificacao.sistema_de_qualificacao.dto;

import lombok.Data;

@Data
public class CreateEventosDto {
    private String eventosId;
    private String cursoId;
    private String nomeEvento; // Corrigido
    private String dataEvento; // Corrigido

    // Construtor ajustado
    public CreateEventosDto(String dataEvento, String nomeEvento, String cursoId, String eventosId) {
        this.dataEvento = dataEvento;
        this.nomeEvento = nomeEvento;
        this.cursoId = cursoId;
        this.eventosId = eventosId;
    }
}