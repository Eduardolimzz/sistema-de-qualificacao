package com.sistema_de_qualificacao.sistema_de_qualificacao.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class CreateEventosDto {

    private String eventosId;
    private String cursoId;
    private String nomeEvento;
    private String dataEvento;

    private List<String> patrocinadorIds;


    public CreateEventosDto(String dataEvento, String nomeEvento, String cursoId, String eventosId, List<String> patrocinadorIds) {
        this.dataEvento = dataEvento;
        this.nomeEvento = nomeEvento;
        this.cursoId = cursoId;
        this.eventosId = eventosId;
        this.patrocinadorIds = patrocinadorIds;
    }
}