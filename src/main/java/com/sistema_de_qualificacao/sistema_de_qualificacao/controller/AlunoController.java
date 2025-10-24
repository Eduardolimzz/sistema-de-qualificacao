package com.sistema_de_qualificacao.sistema_de_qualificacao.controller;

import com.sistema_de_qualificacao.sistema_de_qualificacao.Dto.CreateAlunoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Aluno;
import com.sistema_de_qualificacao.sistema_de_qualificacao.service.AlunoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/v1/alunos")
public class AlunoController {

    private AlunoService alunoService;

    public AlunoController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    @PostMapping
    public ResponseEntity<Aluno> createAluno(@RequestBody CreateAlunoDto createAlunoDto){
        UUID alunoId = alunoService.createAluno(createAlunoDto);
        return ResponseEntity.created(URI.create("/v1/alunos/" + alunoId.toString())).build();
    }

    @GetMapping("/{alunoId}")
    public ResponseEntity<Aluno> getAlunoById(@PathVariable("alunoId") String alunoId){
        // Implementar lógica aqui
        return null;
    }
}