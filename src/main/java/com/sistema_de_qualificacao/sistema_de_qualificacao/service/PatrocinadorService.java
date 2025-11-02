package com.sistema_de_qualificacao.sistema_de_qualificacao.service;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreatePatrocinadorDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.PatrocinadorResponseDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.UpdatePatrocinadorDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Patrocinador;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.PatrocinadorRepository; // Importação corrigida
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PatrocinadorService {
    private final PatrocinadorRepository patrocinadorRepository;


    public PatrocinadorService(PatrocinadorRepository patrocinadorRepository

    ) {

        this.patrocinadorRepository = patrocinadorRepository;
    }

    @Transactional
    public UUID createPatrocinador(CreatePatrocinadorDto createPatrocinadorDto){
        var entity = new Patrocinador();

        entity.setNomePatrocinador(createPatrocinadorDto.getNomePatrocinador());

        var patrocinadorSaved = patrocinadorRepository.save(entity);

        return patrocinadorSaved.getPatrocinadorId();
    }

    @Transactional(readOnly = true)
    public Optional<PatrocinadorResponseDto> getPatrocinadorById(String patrocinadorId){
        return patrocinadorRepository.findById(UUID.fromString(patrocinadorId))
                .map(PatrocinadorResponseDto::fromEntity);
    }

    @Transactional(readOnly = true)
    // Nome do método corrigido
    public List<PatrocinadorResponseDto> listPatrocinador(){
        return patrocinadorRepository.findAll().stream()
                .map(PatrocinadorResponseDto::fromEntity)
                .toList();
    }


    @Transactional
    public void updatePatrocinadorById(String patrocinadorId,
                                       UpdatePatrocinadorDto updatePatrocinadorDto){

        var id = UUID.fromString(patrocinadorId);
        var patrocinadorEntity = patrocinadorRepository.findById(id);

        if(patrocinadorEntity.isPresent()){
            var patrocinador = patrocinadorEntity.get();

            if(updatePatrocinadorDto.nomePatrocinador() != null){

                patrocinador.setNomePatrocinador(updatePatrocinadorDto.nomePatrocinador());
            }


            patrocinadorRepository.save(patrocinador);

        }else {

            throw new IllegalArgumentException("Patrocinador não encontrado com o ID: " + patrocinadorId);
        }

    }

    public void deleteById(String patrocinadorId){
        var id = UUID.fromString(patrocinadorId);

        var patrocinadorExists = patrocinadorRepository.existsById(id);


        if(patrocinadorExists){
            patrocinadorRepository.deleteById(id);
        }

    }
}