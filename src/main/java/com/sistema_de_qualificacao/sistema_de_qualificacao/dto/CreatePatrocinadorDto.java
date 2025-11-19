package com.sistema_de_qualificacao.sistema_de_qualificacao.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CreatePatrocinadorDto {

    private String nomePatrocinador;

    public CreatePatrocinadorDto(String nomePatrocinador) {
        this.nomePatrocinador = nomePatrocinador;
    }
}