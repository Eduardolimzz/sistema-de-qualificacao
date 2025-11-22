package com.sistema_de_qualificacao.sistema_de_qualificacao.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class LoginResponseDto {

    // Os campos que o seu frontend espera receber
    private String token;
    private String role;
    private String nome;
    private UUID userId;
}