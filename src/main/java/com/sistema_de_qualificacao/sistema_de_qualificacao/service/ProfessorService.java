package com.sistema_de_qualificacao.sistema_de_qualificacao.service;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreateProfessorDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.UpdateProfessorDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Professor;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.ProfessorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProfessorService {

    private final ProfessorRepository professorRepository;

    public ProfessorService(ProfessorRepository professorRepository){
        this.professorRepository = professorRepository;
    }

    public UUID createProfessor(CreateProfessorDto createProfessorDto){
        var entity = new Professor();
        entity.setNomeprofessor(createProfessorDto.getNomeprofessor());
        entity.setEmailprofessor(createProfessorDto.getEmailprofessor());
        entity.setSenhaprofessor(createProfessorDto.getSenhaprofessor());

        var professorSaved = professorRepository.save(entity);
        return professorSaved.getProfessorId();
    }

    public Optional<Professor> getProfessorById(String professorId){
        return professorRepository.findById(UUID.fromString(professorId));
    }

    public List<Professor> listProfessores(){
        return professorRepository.findAll();
    }

    public void updateProfessorById(String professorId,
                                UpdateProfessorDto updateProfessorDto){

        var id = UUID.fromString(professorId);

        var professorEntity =professorRepository.findById(id);

        if(professorEntity.isPresent()){
            var professor = professorEntity.get();

            if(updateProfessorDto.nomeprofessor() != null){
                professor.setNomeprofessor(updateProfessorDto.nomeprofessor());
            }
            if(updateProfessorDto.senhaprofessor() != null){
                professor.setSenhaprofessor(updateProfessorDto.senhaprofessor());
            }
            professorRepository.save(professor);
        }
    }

    public void deleteById(String professorId){

        var id = UUID.fromString(professorId);

        var professorExists = professorRepository.existsById(id);

        if(professorExists){
            professorRepository.deleteById(id);
        }
    }

}
