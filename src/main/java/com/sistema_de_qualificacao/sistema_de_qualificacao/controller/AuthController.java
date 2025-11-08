package com.sistema_de_qualificacao.sistema_de_qualificacao.controller;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.LoginRequestDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.LoginResponseDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"})
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginDto) {
        try {
            LoginResponseDto response = authService.autenticar(loginDto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(null);
        }
    }
}