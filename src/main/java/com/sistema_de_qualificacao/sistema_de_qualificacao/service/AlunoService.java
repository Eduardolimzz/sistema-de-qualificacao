package com.sistema_de_qualificacao.sistema_de_qualificacao.service;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreateAlunoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Aluno;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.AlunoRepository;
import org.springframework.stereotype.Service;

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
}