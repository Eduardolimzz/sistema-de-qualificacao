package com.sistema_de_qualificacao.sistema_de_qualificacao.controller;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreateCursoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.UpdateCursoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Curso;
import com.sistema_de_qualificacao.sistema_de_qualificacao.service.CursoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/v1/cursos")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"})
public class CursoController {
    private final CursoService cursoService;

    public CursoController(CursoService cursoService) {
        this.cursoService = cursoService;
    }

    @PostMapping
    public ResponseEntity<Curso> createCurso(@RequestBody CreateCursoDto createCursoDto){
        var cursoId = cursoService.createCurso(createCursoDto);
        return ResponseEntity.created(URI.create("/v1/cursos/" + cursoId.toString())).build();
    }

    @GetMapping
    public ResponseEntity<List<Curso>> listCurso(){
        var curso = cursoService.listCursos();
        return ResponseEntity.ok(curso);
    }

    @GetMapping("/{cursoId}")
    public ResponseEntity<Curso> getCursoById(@PathVariable("cursoId") String cursoId){
        var curso = cursoService.getCursoById(cursoId);

        if(curso.isPresent()){
            return ResponseEntity.ok(curso.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{cursoId}")
    public ResponseEntity<Void> updateCurso(
            @PathVariable("cursoId") String cursoId,
            @Valid @RequestBody UpdateCursoDto updateDto) {
        try {
            cursoService.updateCursoById(cursoId, updateDto);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{cursoId}")
    public ResponseEntity<Void> deleteCurso(
            @PathVariable("cursoId") String cursoId) {
        try {
            cursoService.deleteById(cursoId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}