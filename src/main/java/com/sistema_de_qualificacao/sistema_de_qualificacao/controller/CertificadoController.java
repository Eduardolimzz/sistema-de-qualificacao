package com.sistema_de_qualificacao.sistema_de_qualificacao.controller;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreateCertificadoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.UpdateCertificadoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Certificado;
import com.sistema_de_qualificacao.sistema_de_qualificacao.service.CertificadoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/v1/certificado")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"}) // ✅ ADICIONAR ISSO

public class CertificadoController {
    private final CertificadoService certificadoService;

    public CertificadoController(CertificadoService certificadoService) {
        this.certificadoService = certificadoService;
    }

    @PostMapping
    public ResponseEntity<Certificado> createCertificado(@RequestBody CreateCertificadoDto createCertificadoDto){
        var certificadoId = certificadoService.createCertificado(createCertificadoDto);

        return ResponseEntity.created(URI.create("/v1/certificado/" +
                certificadoId.toString())).build();

    }
    @GetMapping
    public ResponseEntity<List<Certificado>> listCertificado(){
        var certificado = certificadoService.listCertificado();
        return ResponseEntity.ok(certificado);
    }
    @GetMapping("/{certificadoId}")
    public ResponseEntity<Certificado> getCertificadoById(@PathVariable("certificadoId") String certificadoId){
        // Implementar lógica aqui
        var certificado = certificadoService.getCertificadoById(certificadoId);

        if(certificado.isPresent()){
            return ResponseEntity.ok(certificado.get());
        }else{
            return ResponseEntity.notFound().build();
        }}

    @PutMapping("/{certificadoId}")
    public ResponseEntity<Void> updateCertificado(
            @PathVariable("certificadoId") String certificadoId,
            @Valid @RequestBody UpdateCertificadoDto updateCertificado) {
        try {
            certificadoService.updateCertificadoById(certificadoId, updateCertificado);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
            }
        }
    @DeleteMapping("/{certificadoId}")
    public ResponseEntity<Void> deleteCertificado(
            @PathVariable("certificadoId") String certificadoId) {
        try {
            certificadoService.deleteById(certificadoId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

}
