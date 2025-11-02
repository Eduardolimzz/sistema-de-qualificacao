package com.sistema_de_qualificacao.sistema_de_qualificacao.controller;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreatePatrocinadorDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.PatrocinadorResponseDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.UpdatePatrocinadorDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.service.PatrocinadorService; // Service correto
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/v1/patrocinador")
public class PatrocinadorController {

    private final PatrocinadorService patrocinadorService;

    public PatrocinadorController(PatrocinadorService patrocinadorService){
        this.patrocinadorService = patrocinadorService;
    }


    @PostMapping
    public ResponseEntity<Void> createPatrocinador(@RequestBody @Valid CreatePatrocinadorDto createPatrocinadorDto){
        // Método do Service corrigido
        var patrocinadorId = patrocinadorService.createPatrocinador(createPatrocinadorDto);


        return ResponseEntity.created(URI.create("/v1/patrocinador/" +
                patrocinadorId.toString())).build();

    }


    @GetMapping

    public ResponseEntity<List<PatrocinadorResponseDto>> listPatrocinador(){
        var patrocinador = patrocinadorService.listPatrocinador();
        return ResponseEntity.ok(patrocinador);
    }


    @GetMapping("/{patrocinadorId}")
    public ResponseEntity<PatrocinadorResponseDto> getPatrocinadorById(@PathVariable("patrocinadorId") String patrocinadorId){
        var patrocinador = patrocinadorService.getPatrocinadorById(patrocinadorId);


        if(patrocinador.isPresent()){
            return ResponseEntity.ok(patrocinador.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }


    @PutMapping("/{patrocinadorId}")
    public ResponseEntity<Void> updatePatrocinador(
            @PathVariable("patrocinadorId") String patrocinadorId,
            @Valid @RequestBody UpdatePatrocinadorDto updatePatrocinadordto) {
        try {
            patrocinadorService.updatePatrocinadorById(patrocinadorId, updatePatrocinadordto);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/{patrocinadorId}")
    public ResponseEntity<Void> deletePatrocinador(
            @PathVariable("patrocinadorId") String patrocinadorId) {
        patrocinadorService.deleteById(patrocinadorId);
        return ResponseEntity.noContent().build();
    }
}