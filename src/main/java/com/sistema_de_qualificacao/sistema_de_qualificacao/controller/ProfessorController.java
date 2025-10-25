package com.sistema_de_qualificacao.sistema_de_qualificacao.controller;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreateProfessorDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.UpdateProfessorDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Professor;
import com.sistema_de_qualificacao.sistema_de_qualificacao.service.ProfessorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/v1/professores")
public class ProfessorController {

    private ProfessorService professorService;

    public ProfessorController(ProfessorService professorService){
        this.professorService = professorService;
    }

    @PostMapping
    public ResponseEntity<Professor> createProfessor(@RequestBody CreateProfessorDto createProfessorDto){
        var professorId = professorService.createProfessor(createProfessorDto);
        return ResponseEntity.created(URI.create("/v1/professores/" + professorId.toString())).build();
    }

    @GetMapping("/{professorId}")
    public ResponseEntity<Professor> getProfessorById(@PathVariable("professorId") String professorId){
        var professor = professorService.getProfessorById(professorId);
        if(professor.isPresent()){
            return ResponseEntity.ok(professor.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Professor>> listProfessores(){
        var professores = professorService.listProfessores();

        return ResponseEntity.ok(professores);
    }

    @PutMapping("/{professorId}") //nos precisamos receber o id como parametro, e informalo que é uma String
    //@RequestBody vai mostrar os campo que devem ser atualizados, isso é mostrado no UpdateProfessorDto
    public ResponseEntity<Void> updateProfessorById(@PathVariable("professorId")String professorId,
                                                @RequestBody UpdateProfessorDto updateProfessorDto){
        professorService.updateProfessorById(professorId, updateProfessorDto);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{professorId}")
    public ResponseEntity<Void> deleById(@PathVariable("professorId")String professorId){
        professorService.deleteById(professorId);

        return ResponseEntity.noContent().build();
    }

}
