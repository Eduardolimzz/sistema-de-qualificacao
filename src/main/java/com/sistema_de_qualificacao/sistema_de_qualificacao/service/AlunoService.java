package com.sistema_de_qualificacao.sistema_de_qualificacao.service;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreateAlunoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.UpdateAlunoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Aluno;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.AlunoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;

    public AlunoService(AlunoRepository alunoRepository) {
        this.alunoRepository = alunoRepository;
    }

    public UUID createAluno(CreateAlunoDto createAlunoDto){
        var entity = new Aluno();
        entity.setNomealuno(createAlunoDto.getNomealuno());
        entity.setEmailaluno(createAlunoDto.getEmailaluno());
        entity.setSenhaaluno(createAlunoDto.getSenhaaluno());

        var alunoSaved = alunoRepository.save(entity);
        return alunoSaved.getAlunoId();
    }

    //metodo publico que vai retornar o próprio aluno

    public Optional<Aluno> getAlunoById(String alunoId){
        //recebemos uma string e convertemos para UUID
        return alunoRepository.findById(UUID.fromString(alunoId));
    }

    public List<Aluno> listAlunos(){
        return alunoRepository.findAll();
    }

    public void updateAlunoById(String alunoId,
                                UpdateAlunoDto updateAlunoDto){

        var id = UUID.fromString(alunoId);

        var alunoEntity = alunoRepository.findById(id);

        if(alunoEntity.isPresent()){
            var aluno = alunoEntity.get();

            if(updateAlunoDto.nomealuno() != null){
                aluno.setNomealuno(updateAlunoDto.nomealuno());
            }
            if(updateAlunoDto.senhaaluno() != null){
                aluno.setSenhaaluno(updateAlunoDto.senhaaluno());
            }
            alunoRepository.save(aluno);
        }
    }

    public void deleteById(String alunoId){

        var id = UUID.fromString(alunoId);

        var alunoExists = alunoRepository.existsById(id);

        if(alunoExists){
            alunoRepository.deleteById(id);
        }
    }


}