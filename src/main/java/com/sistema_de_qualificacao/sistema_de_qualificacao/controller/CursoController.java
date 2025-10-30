package com.sistema_de_qualificacao.sistema_de_qualificacao.controller;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreateCursoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.UpdateCursoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Aluno;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Curso;
import com.sistema_de_qualificacao.sistema_de_qualificacao.service.CursoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/v1/curso")
public class CursoController {
    private final CursoService cursoService;

    public CursoController(CursoService cursoService) {
        this.cursoService = cursoService;
    }
    //cria
    @PostMapping
    public ResponseEntity<Void> createCurso(@Valid @RequestBody CreateCursoDto createCursoDto) {
        try {
            var cursoId = cursoService.createCurso(createCursoDto);
            return ResponseEntity.created(  //cursoId to string????
                    URI.create("/v1/curso/" + cursoId.getCursoId())).body(cursoId);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    //lista
    @GetMapping
    public ResponseEntity<List<Curso>> listCurso(){
        var curso = cursoService.listCursos();
        return ResponseEntity.ok(curso);
    }

@GetMapping("/{cursoId}")
public ResponseEntity<Curso> getCursoById(@PathVariable("cursoId") String cursoId){
    // Implementar lógica aqui
    var curso = cursoService.getCursoById(cursoId);

    if(curso.isPresent()){
        return ResponseEntity.ok(curso.get());
    }else{
        return ResponseEntity.notFound().build();
    }
}
    //atualizando
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
    //deletando
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