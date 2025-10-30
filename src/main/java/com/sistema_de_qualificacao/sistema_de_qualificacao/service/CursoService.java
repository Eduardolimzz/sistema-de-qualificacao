package com.sistema_de_qualificacao.sistema_de_qualificacao.service;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreateCursoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.UpdateCursoDto;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CursoService {

    private final CursoRepository cursoRepository;

    public CursoService(CursoRepository cursoRepository) {
        this.cursoRepository = cursoRepository;
    }

    public UUID createCurso(CreateCursoDto createCursoDto){
        var entity = new Curso();
        entity.setDuracao_cursocurso(createCursoDto.getCursoduracao_curso());
        entity.setNomecursocurso(createCursoDto.getNomecursocurso());
        entity.setNivel_cursocurso(createCursoDto.getNivel_cursocurso());

        var cursoSaved = cursoRepository.save(entity);
        return cursoSaved.getCursoId();
    }

    public Optional<Curso> getCursoById(String cursoId){
        return cursoRepository.findById(UUID.fromString(cursoId));
    }

    public List<Curso> listCursos(){
        return cursoResitory.findAll();
    }

    public void updateCursoById(String cursoId,
                                UpdateCursoDto updateCursoDto){

        var id = UUID.fromString(cursoId);

        var cursoEntity = cursoRepository.findyById(id);

        if(cursoEntity.isPresent()){
            var curso = cursoEntity.get();

            if(updateCursoDto.nomecurso() != null){
                curso.setDuracao_cursocurso(updateCursoDto.duracaocurso());
            }

            if(updateCursoDto.nomecurso() != null){
                curso.setNomecursocurso(updateCursoDto.nomecurso());
            }

            if(updateCursoDto.nomecurso() != null){
                curso.setNivel_cursocurso(updateCursoDto.nivel_curso());
            }

            cursoRepository.save(curso);
        }
    }

    public void deleteById(String cursoId){

        var id = UUID.fromString(cursoId);

        var alunoExists = cursoRepository.existsById(id);

        if(cursoExists){
            cursoRepository.deleteById(id);
        }
    }

}
