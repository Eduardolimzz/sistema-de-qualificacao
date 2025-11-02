package com.sistema_de_qualificacao.sistema_de_qualificacao.controller;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.BoletimResponseDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreateBoletimDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.service.BoletimService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/v1/boletins")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"})
public class BoletimController {

    private final BoletimService boletimService;

    public BoletimController(BoletimService boletimService) {
        this.boletimService = boletimService;
    }

    // ========== CRIAR BOLETIM (normalmente chamado automaticamente ao criar matrícula) ==========
    @PostMapping
    public ResponseEntity<Void> createBoletim(@Valid @RequestBody CreateBoletimDto createDto) {
        try {
            var boletimId = boletimService.createBoletim(createDto);
            return ResponseEntity.created(URI.create("/v1/boletins/" + boletimId)).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ========== BUSCAR BOLETIM ESPECÍFICO ==========

    // Busca boletim por ID
    @GetMapping("/{boletimId}")
    public ResponseEntity<BoletimResponseDto> getBoletimById(@PathVariable("boletimId") String boletimId) {
        var boletim = boletimService.getBoletimById(boletimId);
        return boletim.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Busca boletim de um aluno em um curso específico
    @GetMapping("/aluno/{alunoId}/curso/{cursoId}")
    public ResponseEntity<BoletimResponseDto> getBoletimByAlunoAndCurso(
            @PathVariable("alunoId") String alunoId,
            @PathVariable("cursoId") String cursoId) {
        var boletim = boletimService.getBoletimByAlunoAndCurso(alunoId, cursoId);
        return boletim.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ========== LISTAR BOLETINS ==========

    // Lista todos os boletins de um aluno (todos os cursos que ele cursou)
    @GetMapping("/aluno/{alunoId}")
    public ResponseEntity<List<BoletimResponseDto>> listBoletinsByAluno(
            @PathVariable("alunoId") String alunoId) {
        var boletins = boletimService.listBoletinsByAluno(alunoId);
        return ResponseEntity.ok(boletins);
    }

    // Lista todos os boletins de um curso (todos os alunos)
    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<List<BoletimResponseDto>> listBoletinsByCurso(
            @PathVariable("cursoId") String cursoId) {
        var boletins = boletimService.listBoletinsByCurso(cursoId);
        return ResponseEntity.ok(boletins);
    }

    // Lista alunos aprovados em um curso
    @GetMapping("/curso/{cursoId}/aprovados")
    public ResponseEntity<List<BoletimResponseDto>> listAprovadosByCurso(
            @PathVariable("cursoId") String cursoId) {
        var boletins = boletimService.listAprovadosByCurso(cursoId);
        return ResponseEntity.ok(boletins);
    }

    // Lista alunos reprovados em um curso
    @GetMapping("/curso/{cursoId}/reprovados")
    public ResponseEntity<List<BoletimResponseDto>> listReprovadosByCurso(
            @PathVariable("cursoId") String cursoId) {
        var boletins = boletimService.listReprovadosByCurso(cursoId);
        return ResponseEntity.ok(boletins);
    }

    // ========== ATUALIZAR BOLETIM (normalmente chamado automaticamente ao lançar nota) ==========

    // Força atualização manual do boletim
    @PutMapping("/aluno/{alunoId}/curso/{cursoId}/atualizar")
    public ResponseEntity<Void> atualizarBoletim(
            @PathVariable("alunoId") String alunoId,
            @PathVariable("cursoId") String cursoId) {
        try {
            var idAluno = java.util.UUID.fromString(alunoId);
            var idCurso = java.util.UUID.fromString(cursoId);
            boletimService.atualizarBoletim(idAluno, idCurso);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ========== ESTATÍSTICAS DO CURSO ==========

    // Conta quantos alunos estão matriculados no curso
    @GetMapping("/curso/{cursoId}/count")
    public ResponseEntity<Long> countBoletinsByCurso(@PathVariable("cursoId") String cursoId) {
        var count = boletimService.countBoletinsByCurso(cursoId);
        return ResponseEntity.ok(count);
    }

    // Conta quantos alunos foram aprovados no curso
    @GetMapping("/curso/{cursoId}/count-aprovados")
    public ResponseEntity<Long> countAprovadosByCurso(@PathVariable("cursoId") String cursoId) {
        var count = boletimService.countAprovadosByCurso(cursoId);
        return ResponseEntity.ok(count);
    }

    // Calcula média geral de desempenho do curso
    @GetMapping("/curso/{cursoId}/media-desempenho")
    public ResponseEntity<Double> calcularMediaDesempenhoCurso(@PathVariable("cursoId") String cursoId) {
        var media = boletimService.calcularMediaDesempenhoCurso(cursoId);
        return ResponseEntity.ok(media != null ? media : 0.0);
    }

    // Calcula média de frequência do curso
    @GetMapping("/curso/{cursoId}/media-frequencia")
    public ResponseEntity<Double> calcularMediaFrequenciaCurso(@PathVariable("cursoId") String cursoId) {
        var media = boletimService.calcularMediaFrequenciaCurso(cursoId);
        return ResponseEntity.ok(media != null ? media : 0.0);
    }

    // ========== ESTATÍSTICAS CONSOLIDADAS DO CURSO ==========

    // Retorna um resumo completo do curso
    @GetMapping("/curso/{cursoId}/estatisticas")
    public ResponseEntity<EstatisticasCursoDto> getEstatisticasCurso(@PathVariable("cursoId") String cursoId) {
        var stats = new EstatisticasCursoDto();
        stats.setTotalAlunos(boletimService.countBoletinsByCurso(cursoId));
        stats.setTotalAprovados(boletimService.countAprovadosByCurso(cursoId));
        stats.setTotalReprovados(stats.getTotalAlunos() - stats.getTotalAprovados());
        stats.setMediaDesempenho(boletimService.calcularMediaDesempenhoCurso(cursoId));
        stats.setMediaFrequencia(boletimService.calcularMediaFrequenciaCurso(cursoId));

        if (stats.getTotalAlunos() > 0) {
            double percentualAprovacao = (stats.getTotalAprovados() * 100.0) / stats.getTotalAlunos();
            stats.setPercentualAprovacao(Math.round(percentualAprovacao * 100.0) / 100.0);
        } else {
            stats.setPercentualAprovacao(0.0);
        }

        return ResponseEntity.ok(stats);
    }

    // ========== DELETAR BOLETIM ==========

    @DeleteMapping("/{boletimId}")
    public ResponseEntity<Void> deleteBoletim(@PathVariable("boletimId") String boletimId) {
        try {
            boletimService.deleteBoletim(boletimId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ========== DTO INTERNO PARA ESTATÍSTICAS ==========

    @lombok.Data
    @lombok.AllArgsConstructor
    @lombok.NoArgsConstructor
    public static class EstatisticasCursoDto {
        private Long totalAlunos;
        private Long totalAprovados;
        private Long totalReprovados;
        private Double mediaDesempenho;
        private Double mediaFrequencia;
        private Double percentualAprovacao;
    }
}