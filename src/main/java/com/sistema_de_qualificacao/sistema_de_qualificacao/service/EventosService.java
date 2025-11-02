package com.sistema_de_qualificacao.sistema_de_qualificacao.service;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreateEventosDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.EventosResponseDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.UpdateEventosdto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Eventos;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Patrocinador;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.CursoRepository;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.EventosRepository;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.PatrocinadorRepository; // NOVO
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Service
public class EventosService {
    private final EventosRepository eventosRepository;
    private final CursoRepository cursoRepository;
    private final PatrocinadorRepository patrocinadorRepository;

    public EventosService(EventosRepository eventosRepository,
                          CursoRepository cursoRepository,
                          PatrocinadorRepository patrocinadorRepository
    ) {
        this.eventosRepository = eventosRepository;
        this.cursoRepository = cursoRepository;
        this.patrocinadorRepository = patrocinadorRepository;
    }

    @Transactional
    public UUID createEventos(CreateEventosDto createEventosDto){
        var cursoId = UUID.fromString(createEventosDto.getCursoId());
        var cursoRef = cursoRepository.getReferenceById(cursoId);


        List<Patrocinador> patrocinadores = Optional.ofNullable(createEventosDto.getPatrocinadorIds())
                .orElseGet(Collections::emptyList)
                .stream()
                .map(UUID::fromString)
                .map(patrocinadorRepository::getReferenceById)
                .toList();

        var entity = new Eventos();
        entity.setDataEvento(createEventosDto.getDataEvento());
        entity.setNomeEvento(createEventosDto.getNomeEvento());
        entity.setCurso(cursoRef);
        entity.setPatrocinadores(patrocinadores);

        var eventoSaved = eventosRepository.save(entity);
        return eventoSaved.getEventosId();
    }

    @Transactional(readOnly = true)
    public Optional<EventosResponseDto> getEventosById(String eventosId){
        return eventosRepository.findById(UUID.fromString(eventosId))
                .map(EventosResponseDto::fromEntity);
    }

    @Transactional(readOnly = true)
    public List<EventosResponseDto> listEventos(){
        return eventosRepository.findAll().stream()
                .map(EventosResponseDto::fromEntity)
                .toList();
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