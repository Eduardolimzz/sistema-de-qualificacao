package com.sistema_de_qualificacao.sistema_de_qualificacao.controller;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreateEventosDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.EventosResponseDto; // NOVO
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.UpdateEventosdto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.service.EventosService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/v1/eventos")
public class EventosController {
    private final EventosService eventosService;

    public EventosController(EventosService eventosService){
        this.eventosService = eventosService;
    }

    // POST /v1/eventos (Criar)
    @PostMapping
    public ResponseEntity<Void> createEventos(@RequestBody @Valid CreateEventosDto createEventosDto){
        var eventosId = eventosService.createEventos(createEventosDto);

        return ResponseEntity.created(URI.create("/v1/eventos/" +
                eventosId.toString())).build();

    }

    // GET /v1/eventos (Listar Todos) - Retorna List<DTO>
    @GetMapping
    public ResponseEntity<List<EventosResponseDto>> listEventos(){ // TIPO DE RETORNO AJUSTADO
        var eventos = eventosService.listEventos();
        return ResponseEntity.ok(eventos);
    }

    // GET /v1/eventos/{eventosId} (Buscar por ID) - Retorna DTO
    @GetMapping("/{eventosId}")
    public ResponseEntity<EventosResponseDto> getEventosById(@PathVariable("eventosId") String eventosId){ // TIPO DE RETORNO AJUSTADO
        var eventos = eventosService.getEventosById(eventosId);

        if(eventos.isPresent()){
            return ResponseEntity.ok(eventos.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    // PUT /v1/eventos/{eventosId} (Atualizar)
    @PutMapping("/{eventosId}")
    public ResponseEntity<Void> updateEventos(
            @PathVariable("eventosId") String eventosId,
            @Valid @RequestBody UpdateEventosdto updateEventosdto) {
        try {
            eventosService.updateEventosById(eventosId, updateEventosdto);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /v1/eventos/{eventosId} (Excluir)
    @DeleteMapping("/{eventosId}")
    public ResponseEntity<Void> deleteEventos(
            @PathVariable("eventosId") String eventosId) {
        eventosService.deleteById(eventosId);
        return ResponseEntity.noContent().build();
    }
}