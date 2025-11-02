package com.sistema_de_qualificacao.sistema_de_qualificacao.service;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreateEventosDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.EventosResponseDto; // NOVO
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.UpdateEventosdto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Eventos;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.CursoRepository;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.EventosRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
public class EventosService {
    private final EventosRepository eventosRepository;
    private final CursoRepository cursoRepository;

    public EventosService(EventosRepository eventosRepository,
                          CursoRepository cursoRepository
    ) {
        this.eventosRepository = eventosRepository;
        this.cursoRepository = cursoRepository;
    }

    @Transactional
    public UUID createEventos(CreateEventosDto createEventosDto){
        var cursoId = UUID.fromString(createEventosDto.getCursoId());
        var cursoRef = cursoRepository.getReferenceById(cursoId);

        var entity = new Eventos();
        entity.setDataEvento(createEventosDto.getDataEvento());
        entity.setNomeEvento(createEventosDto.getNomeEvento());
        entity.setCurso(cursoRef);

        var eventoSaved = eventosRepository.save(entity);
        return eventoSaved.getEventosId();
    }

    @Transactional(readOnly = true)
    // Retorna Optional<DTO>
    public Optional<EventosResponseDto> getEventosById(String eventosId){
        return eventosRepository.findById(UUID.fromString(eventosId))
                .map(EventosResponseDto::fromEntity); // Mapeia a entidade para o DTO
    }

    @Transactional(readOnly = true)
    // Retorna List<DTO>
    public List<EventosResponseDto> listEventos(){
        return eventosRepository.findAll().stream()
                .map(EventosResponseDto::fromEntity)
                .toList(); // Usa toList() do Java 16+
    }


    @Transactional
    public void updateEventosById(String eventosId,
                                  UpdateEventosdto updateEventosdto){

        var id = UUID.fromString(eventosId);
        var eventosEntity = eventosRepository.findById(id);

        if(eventosEntity.isPresent()){
            var eventos = eventosEntity.get();

            if(updateEventosdto.dataEvento() != null){
                eventos.setDataEvento(updateEventosdto.dataEvento());
            }
            if(updateEventosdto.nomeEvento() != null){
                eventos.setNomeEvento(updateEventosdto.nomeEvento());
            }

            eventosRepository.save(eventos);

        }else {
            throw new IllegalArgumentException("Evento não encontrado com o ID: " + eventosId);
        }

    }

    public void deleteById(String eventosId){
        var id = UUID.fromString(eventosId);
        var eventosExists = eventosRepository.existsById(id);

        if(eventosExists){
            eventosRepository.deleteById(id);
        }
    }
}