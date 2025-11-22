package com.sistema_de_qualificacao.sistema_de_qualificacao.controller;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreateMatriculaProfessorDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.MatriculaProfessorResponseDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.UpdateMatriculaProfessorDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.service.MatriculaProfessorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/v1/matriculasProfessor")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"}) // ✅ ADICIONAR ISSO

public class MatriculaProfessorController {

    private final MatriculaProfessorService matriculaProfessorService;

    public MatriculaProfessorController(MatriculaProfessorService matriculaProfessorService) {
        this.matriculaProfessorService = matriculaProfessorService;
    }

    @PostMapping
    public ResponseEntity<Void> createMatriculaProfessor(@Valid @RequestBody CreateMatriculaProfessorDto createMatriculaProfessorDto) {
        try {
            var matriculaId = matriculaProfessorService.createMatriculaProfessor(createMatriculaProfessorDto);
            return ResponseEntity.created(
                    URI.create("/v1/matriculasProfessor/professor/" + matriculaId.getProfessorId() +
                            "/curso/" + matriculaId.getCursoId())
            ).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/professor/{professorId}/curso/{cursoId}")
    public ResponseEntity<MatriculaProfessorResponseDto> getMatriculaById(
            @PathVariable("professorId") String professorId,
            @PathVariable("cursoId") String cursoId) {

        var matricula = matriculaProfessorService.getMatriculaById(professorId, cursoId);

        return matricula.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<MatriculaProfessorResponseDto>> listAllMatriculas() {
        var matriculasProfessor = matriculaProfessorService.listAllMatriculas();
        return ResponseEntity.ok(matriculasProfessor);
    }

    @GetMapping("/professor/{professorId}")
    public ResponseEntity<List<MatriculaProfessorResponseDto>> listMatriculasByProfessor(
            @PathVariable("professorId") String professorId) {
        var matriculasProfessor = matriculaProfessorService.listMatriculasByProfessorId(professorId);
        return ResponseEntity.ok(matriculasProfessor);
    }

    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<List<MatriculaProfessorResponseDto>> listMatriculasByCurso(
            @PathVariable("cursoId") String cursoId) {
        var matriculasProfessor = matriculaProfessorService.listMatriculasByCursoId(cursoId);
        return ResponseEntity.ok(matriculasProfessor);
    }

    @GetMapping("/status_professor/{status_professor}")
    public ResponseEntity<List<MatriculaProfessorResponseDto>> listMatriculasByStatus(
            @PathVariable("status_professor") String status_professor) {
        var matriculasProfessor = matriculaProfessorService.listMatriculasByStatus(status_professor);
        return ResponseEntity.ok(matriculasProfessor);
    }

    @PutMapping("/professor/{professorId}/curso/{cursoId}")
    public ResponseEntity<Void> updateMatricula(
            @PathVariable("professorId") String professorId,
            @PathVariable("cursoId") String cursoId,
            @Valid @RequestBody UpdateMatriculaProfessorDto updateDto) {
        try {
            matriculaProfessorService.updateMatricula(professorId, cursoId, updateDto);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/professor/{professorId}/curso/{cursoId}")
    public ResponseEntity<Void> deleteMatricula(
            @PathVariable("professorId") String professorId,
            @PathVariable("cursoId") String cursoId) {
        try {
            matriculaProfessorService.deleteMatricula(professorId, cursoId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
