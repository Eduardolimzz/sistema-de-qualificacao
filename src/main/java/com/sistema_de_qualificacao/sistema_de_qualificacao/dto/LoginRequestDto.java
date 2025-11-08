package com.sistema_de_qualificacao.sistema_de_qualificacao.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class LoginRequestDto {

    // Os nomes dos campos (email, senha) devem ser EXATAMENTE
    // os mesmos que o frontend está enviando no JSON
    private String email;
    private String senha;

}