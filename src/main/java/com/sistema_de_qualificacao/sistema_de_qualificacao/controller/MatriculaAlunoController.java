package com.sistema_de_qualificacao.sistema_de_qualificacao.controller;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreateMatriculaAlunoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.MatriculaAlunoResponseDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.UpdateMatriculaAlunoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.service.MatriculaAlunoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/v1/matriculas")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"}) // ✅ ADICIONAR ISSO
public class MatriculaAlunoController {

    private final MatriculaAlunoService matriculaAlunoService;

    public MatriculaAlunoController(MatriculaAlunoService matriculaAlunoService){
        this.matriculaAlunoService = matriculaAlunoService;
    }

    @PostMapping
    public ResponseEntity<Void> createMatricula(@Valid @RequestBody CreateMatriculaAlunoDto createDto) {
        try {
            var matriculaId = matriculaAlunoService.createMatricula(createDto);
            return ResponseEntity.created(
                    URI.create("/v1/matriculas/aluno/" + matriculaId.getAlunoId() +
                            "/curso/" + matriculaId.getCursoId())
            ).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/aluno/{alunoId}/curso/{cursoId}")
    public ResponseEntity<MatriculaAlunoResponseDto> getMatriculaById(
            @PathVariable("alunoId") String alunoId,
            @PathVariable("cursoId") String cursoId) {

        var matricula = matriculaAlunoService.getMatriculaById(alunoId, cursoId);

        return matricula.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<MatriculaAlunoResponseDto>> listAllMatriculas() {
        var matriculas = matriculaAlunoService.listAllMatriculas();
        return ResponseEntity.ok(matriculas);
    }

    @GetMapping("/aluno/{alunoId}")
    public ResponseEntity<List<MatriculaAlunoResponseDto>> listMatriculasByAluno(
            @PathVariable("alunoId") String alunoId) {
        var matriculas = matriculaAlunoService.listMatriculasByAlunoId(alunoId);
        return ResponseEntity.ok(matriculas);
    }

    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<List<MatriculaAlunoResponseDto>> listMatriculasByCurso(
            @PathVariable("cursoId") String cursoId) {
        var matriculas = matriculaAlunoService.listMatriculasByCursoId(cursoId);
        return ResponseEntity.ok(matriculas);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<MatriculaAlunoResponseDto>> listMatriculasByStatus(
            @PathVariable("status") String status) {
        var matriculas = matriculaAlunoService.listMatriculasByStatus(status);
        return ResponseEntity.ok(matriculas);
    }

    @PutMapping("/aluno/{alunoId}/curso/{cursoId}")
    public ResponseEntity<Void> updateMatricula(
            @PathVariable("alunoId") String alunoId,
            @PathVariable("cursoId") String cursoId,
            @Valid @RequestBody UpdateMatriculaAlunoDto updateDto) {
        try {
            matriculaAlunoService.updateMatricula(alunoId, cursoId, updateDto);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/aluno/{alunoId}/curso/{cursoId}")
    public ResponseEntity<Void> deleteMatricula(
            @PathVariable("alunoId") String alunoId,
            @PathVariable("cursoId") String cursoId) {
        try {
            matriculaAlunoService.deleteMatricula(alunoId, cursoId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}