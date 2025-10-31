package com.sistema_de_qualificacao.sistema_de_qualificacao.controller;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.AvaliacaoResponseDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreateAvaliacaoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.UpdateAvaliacaoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.service.AvaliacaoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/v1/avaliacoes")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"})
public class AvaliacaoController {

    private final AvaliacaoService avaliacaoService;

    public AvaliacaoController(AvaliacaoService avaliacaoService) {
        this.avaliacaoService = avaliacaoService;
    }

    @PostMapping
    public ResponseEntity<Void> createAvaliacao(@Valid @RequestBody CreateAvaliacaoDto createAvaliacaoDto) {
        try {
            var avaliacaoId = avaliacaoService.createAvaliacao(createAvaliacaoDto);
            return ResponseEntity.created(URI.create("/v1/avaliacoes/" + avaliacaoId.toString())).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{avaliacaoId}")
    public ResponseEntity<AvaliacaoResponseDto> getAvaliacaoById(@PathVariable("avaliacaoId") String avaliacaoId) {
        var avaliacao = avaliacaoService.getAvaliacaoById(avaliacaoId);
        return avaliacao.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<AvaliacaoResponseDto>> listAllAvaliacoes() {
        var avaliacoes = avaliacaoService.listAllAvaliacoes();
        return ResponseEntity.ok(avaliacoes);
    }

    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<List<AvaliacaoResponseDto>> listAvaliacoesByCurso(@PathVariable("cursoId") String cursoId) {
        var avaliacoes = avaliacaoService.listAvaliacoesByCursoId(cursoId);
        return ResponseEntity.ok(avaliacoes);
    }

    @GetMapping("/curso/{cursoId}/recentes")
    public ResponseEntity<List<AvaliacaoResponseDto>> listAvaliacoesRecentesByCurso(
            @PathVariable("cursoId") String cursoId,
            @RequestParam(value = "limit", defaultValue = "5") int limit) {
        var avaliacoes = avaliacaoService.listAvaliacoesRecentesByCurso(cursoId, limit);
        return ResponseEntity.ok(avaliacoes);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<AvaliacaoResponseDto>> buscarPorTitulo(@RequestParam("titulo") String titulo) {
        var avaliacoes = avaliacaoService.listAvaliacoesByTitulo(titulo);
        return ResponseEntity.ok(avaliacoes);
    }

    @GetMapping("/peso/{peso}")
    public ResponseEntity<List<AvaliacaoResponseDto>> listAvaliacoesByPeso(@PathVariable("peso") Double peso) {
        var avaliacoes = avaliacaoService.listAvaliacoesByPeso(peso);
        return ResponseEntity.ok(avaliacoes);
    }

    @GetMapping("/recentes")
    public ResponseEntity<List<AvaliacaoResponseDto>> listAvaliacoesRecentes(
            @RequestParam(value = "dias", defaultValue = "30") int dias) {
        var avaliacoes = avaliacaoService.listAvaliacoesRecentes(dias);
        return ResponseEntity.ok(avaliacoes);
    }

    @GetMapping("/curso/{cursoId}/count")
    public ResponseEntity<Long> countAvaliacoesByCurso(@PathVariable("cursoId") String cursoId) {
        var count = avaliacaoService.countAvaliacoesByCurso(cursoId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/curso/{cursoId}/soma-pesos")
    public ResponseEntity<Double> calcularSomaPesosCurso(@PathVariable("cursoId") String cursoId) {
        var somaPesos = avaliacaoService.calcularSomaPesosCurso(cursoId);
        return ResponseEntity.ok(somaPesos);
    }

    @GetMapping("/curso/{cursoId}/peso-medio")
    public ResponseEntity<Double> calcularPesoMedioCurso(@PathVariable("cursoId") String cursoId) {
        var pesoMedio = avaliacaoService.calcularPesoMedioCurso(cursoId);
        return ResponseEntity.ok(pesoMedio);
    }

    @PutMapping("/{avaliacaoId}")
    public ResponseEntity<Void> updateAvaliacao(
            @PathVariable("avaliacaoId") String avaliacaoId,
            @Valid @RequestBody UpdateAvaliacaoDto updateDto) {
        try {
            avaliacaoService.updateAvaliacao(avaliacaoId, updateDto);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{avaliacaoId}")
    public ResponseEntity<Void> deleteAvaliacao(@PathVariable("avaliacaoId") String avaliacaoId) {
        try {
            avaliacaoService.deleteAvaliacao(avaliacaoId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}