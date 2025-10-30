package com.sistema_de_qualificacao.sistema_de_qualificacao.service;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreateCursoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.UpdateCursoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Curso;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.CursoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CursoService {

    private final CursoRepository cursoRepository;

    public CursoService(CursoRepository cursoRepository) {
        this.cursoRepository = cursoRepository;
    }

    public UUID createCurso(CreateCursoDto createCursoDto){
        var entity = new Curso();
        entity.setDuracao_curso(createCursoDto.getDuracao_curso());
        entity.setNomecurso(createCursoDto.getNomecurso());
        entity.setNivel_curso(createCursoDto.getNivel_curso());

        var cursoSaved = cursoRepository.save(entity);
        return cursoSaved.getCursoId();
    }

    public Optional<Curso> getCursoById(String cursoId){
        return cursoRepository.findById(UUID.fromString(cursoId));
    }

    public List<Curso> listCursos(){
        return cursoRepository.findAll();
    }

    public void updateCursoById(String cursoId,
                                UpdateCursoDto updateCursoDto){

        var id = UUID.fromString(cursoId);

        var cursoEntity = cursoRepository.findById(id);

        if(cursoEntity.isPresent()){
            var curso = cursoEntity.get();

            if(updateCursoDto.duracaocurso() != null){
                curso.setDuracao_curso(updateCursoDto.duracaocurso());

            }

            if(updateCursoDto.nomecurso() != null){
                curso.setNomecurso(updateCursoDto.nomecurso());

            }

            if(updateCursoDto.nivel_curso() != null){
                curso.setNivel_curso(updateCursoDto.nivel_curso());
            }

            cursoRepository.save(curso);
        }else {
            // CORRIGIDO: Lança exceção para o Controller retornar HTTP 404
            throw new IllegalArgumentException("Curso não encontrado com o ID: " + cursoId);
    }}

    public void deleteById(String cursoId){

        var id = UUID.fromString(cursoId);

        var cursoExists = cursoRepository.existsById(id);

        if(cursoExists){
            cursoRepository.deleteById(id);
        }else {
            // CORRIGIDO: Lança exceção para o Controller retornar HTTP 404
            throw new IllegalArgumentException("Curso não encontrado com o ID: " + cursoId);
        }
    }

}
