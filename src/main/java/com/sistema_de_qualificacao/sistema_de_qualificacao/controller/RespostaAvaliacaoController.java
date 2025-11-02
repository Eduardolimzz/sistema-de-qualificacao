package com.sistema_de_qualificacao.sistema_de_qualificacao.controller;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreateRespostaAvaliacaoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.LancarNotaDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.RespostaAvaliacaoResponseDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.UpdateRespostaAvaliacaoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.service.RespostaAvaliacaoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/v1/respostas-avaliacoes")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"})
public class RespostaAvaliacaoController {

    private final RespostaAvaliacaoService respostaAvaliacaoService;

    public RespostaAvaliacaoController(RespostaAvaliacaoService respostaAvaliacaoService) {
        this.respostaAvaliacaoService = respostaAvaliacaoService;
    }

    // Aluno cria/envia resposta da avaliação
    @PostMapping
    public ResponseEntity<Void> createResposta(@Valid @RequestBody CreateRespostaAvaliacaoDto createDto) {
        try {
            var respostaId = respostaAvaliacaoService.createRespostaAvaliacao(createDto);
            return ResponseEntity.created(URI.create("/v1/respostas-avaliacoes/" + respostaId)).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Busca resposta específica por ID
    @GetMapping("/{respostaId}")
    public ResponseEntity<RespostaAvaliacaoResponseDto> getRespostaById(
            @PathVariable("respostaId") String respostaId) {
        var resposta = respostaAvaliacaoService.getRespostaById(respostaId);
        return resposta.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Lista todas as respostas de uma avaliação (para professor)
    @GetMapping("/avaliacao/{avaliacaoId}")
    public ResponseEntity<List<RespostaAvaliacaoResponseDto>> listRespostasByAvaliacao(
            @PathVariable("avaliacaoId") String avaliacaoId) {
        var respostas = respostaAvaliacaoService.listRespostasByAvaliacao(avaliacaoId);
        return ResponseEntity.ok(respostas);
    }

    // Lista todas as respostas de um aluno
    @GetMapping("/aluno/{alunoId}")
    public ResponseEntity<List<RespostaAvaliacaoResponseDto>> listRespostasByAluno(
            @PathVariable("alunoId") String alunoId) {
        var respostas = respostaAvaliacaoService.listRespostasByAluno(alunoId);
        return ResponseEntity.ok(respostas);
    }

    // Lista respostas por status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<RespostaAvaliacaoResponseDto>> listRespostasByStatus(
            @PathVariable("status") String status) {
        var respostas = respostaAvaliacaoService.listRespostasByStatus(status);
        return ResponseEntity.ok(respostas);
    }

    // Lista respostas pendentes (para professor corrigir)
    @GetMapping("/pendentes")
    public ResponseEntity<List<RespostaAvaliacaoResponseDto>> listRespostasPendentes() {
        var respostas = respostaAvaliacaoService.listRespostasPendentes();
        return ResponseEntity.ok(respostas);
    }

    // Aluno edita sua resposta (antes de ser corrigida)
    @PutMapping("/{respostaId}")
    public ResponseEntity<Void> updateResposta(
            @PathVariable("respostaId") String respostaId,
            @Valid @RequestBody UpdateRespostaAvaliacaoDto updateDto) {
        try {
            respostaAvaliacaoService.updateResposta(respostaId, updateDto);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Professor lança nota
    @PutMapping("/{respostaId}/nota")
    public ResponseEntity<Void> lancarNota(
            @PathVariable("respostaId") String respostaId,
            @Valid @RequestBody LancarNotaDto dto) {
        try {
            respostaAvaliacaoService.lancarNota(respostaId, dto.getNotaObtida());
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Deleta resposta
    @DeleteMapping("/{respostaId}")
    public ResponseEntity<Void> deleteResposta(@PathVariable("respostaId") String respostaId) {
        try {
            respostaAvaliacaoService.deleteResposta(respostaId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Conta quantos alunos fizeram a avaliação
    @GetMapping("/avaliacao/{avaliacaoId}/count")
    public ResponseEntity<Long> countRespostas(@PathVariable("avaliacaoId") String avaliacaoId) {
        var count = respostaAvaliacaoService.countRespostasByAvaliacao(avaliacaoId);
        return ResponseEntity.ok(count);
    }

    // Calcula média de notas da avaliação
    @GetMapping("/avaliacao/{avaliacaoId}/media")
    public ResponseEntity<Double> calcularMediaAvaliacao(@PathVariable("avaliacaoId") String avaliacaoId) {
        var media = respostaAvaliacaoService.calcularMediaAvaliacao(avaliacaoId);
        return ResponseEntity.ok(media != null ? media : 0.0);
    }

    // Calcula média de notas do aluno
    @GetMapping("/aluno/{alunoId}/media")
    public ResponseEntity<Double> calcularMediaAluno(@PathVariable("alunoId") String alunoId) {
        var media = respostaAvaliacaoService.calcularMediaAluno(alunoId);
        return ResponseEntity.ok(media != null ? media : 0.0);
    }
}