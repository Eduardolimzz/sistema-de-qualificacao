package com.sistema_de_qualificacao.sistema_de_qualificacao.service;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreateMatriculaProfessorDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.MatriculaProfessorResponseDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.UpdateMatriculaProfessorDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.MatriculaProfessor;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.MatriculaProfessorId;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.CursoRepository;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.MatriculaProfessorRepository;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.ProfessorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MatriculaProfessorService {

    private final MatriculaProfessorRepository matriculaProfessorRepository;
    private final ProfessorRepository professorRepository;
    private final CursoRepository cursoRepository;

    public MatriculaProfessorService(MatriculaProfessorRepository matriculaProfessorRepository,
                                     ProfessorRepository professorRepository
                                    , CursoRepository cursoRepository
    ){
        this.matriculaProfessorRepository = matriculaProfessorRepository;
        this.professorRepository = professorRepository;
        this.cursoRepository = cursoRepository;
    }

    @Transactional
    public MatriculaProfessorId createMatriculaProfessor(CreateMatriculaProfessorDto createMatriculaProfessorDto){

        var professorExists = professorRepository.existsById(createMatriculaProfessorDto.getProfessorId());

        if(!professorExists) {
            throw new IllegalArgumentException("Professor não encontrado com ID: " + createMatriculaProfessorDto.getProfessorId());
        }

        // Quando criar Curso, descomentar:
         var cursoExists = cursoRepository.existsById(createMatriculaProfessorDto.getCursoId());
         if (!cursoExists) {
             throw new IllegalArgumentException("Curso não encontrado com ID: " + createMatriculaProfessorDto.getCursoId());
         }

        var matriculaExists = matriculaProfessorRepository.existsProfessorByIdAndCursoById(
            createMatriculaProfessorDto.getProfessorId(),
            createMatriculaProfessorDto.getCursoId()
        );

        if (matriculaExists) {
            throw new IllegalArgumentException(
                    "Já existe uma matrícula para este professor neste curso"
            );
        }
        var entity = new MatriculaProfessor();
        entity.setProfessorId(createMatriculaProfessorDto.getProfessorId());
        entity.setCursoId(createMatriculaProfessorDto.getCursoId());
        entity.setStatus_professor(createMatriculaProfessorDto.getStatus_professor());

        var matriculaSaved = matriculaProfessorRepository.save(entity);

        return new MatriculaProfessorId(
                matriculaSaved.getProfessorId(),
                matriculaSaved.getCursoId()
        );
    }

    public Optional<MatriculaProfessorResponseDto> getMatriculaById(String professorId, String cursoId) {
        var idProfessor = UUID.fromString(professorId);
        var idCurso = UUID.fromString(cursoId);

        return matriculaProfessorRepository.findProfessorByIdAndCursoById(idProfessor, idCurso)
                .map(this::convertToResponseDto);
    }

    public List<MatriculaProfessorResponseDto> listAllMatriculas() {
        return matriculaProfessorRepository.findAll().stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public List<MatriculaProfessorResponseDto> listMatriculasByProfessorId(String professorId) {
        var id = UUID.fromString(professorId);
        return matriculaProfessorRepository.findProfessorById(id).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public List<MatriculaProfessorResponseDto> listMatriculasByCursoId(String cursoId) {
        var id = UUID.fromString(cursoId);
        return matriculaProfessorRepository.findCursoById(id).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public List<MatriculaProfessorResponseDto> listMatriculasByStatus(String status_professor) {
        return matriculaProfessorRepository.findByStatus(status_professor).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateMatricula(String professorId, String cursoId, UpdateMatriculaProfessorDto updateDto) {
        // CORRIGIDO: nomes de variáveis duplicados
        var idProfessor = UUID.fromString(professorId);
        var idCurso = UUID.fromString(cursoId);

        var matriculaEntity = matriculaProfessorRepository.findProfessorByIdAndCursoById(idProfessor, idCurso);

        if (matriculaEntity.isPresent()) {
            var matricula = matriculaEntity.get();

            if (updateDto.getStatus_professor() != null && !updateDto.getStatus_professor().isBlank()) {
                matricula.setStatus_professor(updateDto.getStatus_professor());
            }

            matriculaProfessorRepository.save(matricula);
        } else {
            throw new IllegalArgumentException("Matrícula não encontrada");
        }
    }

    @Transactional
    public void deleteMatricula(String professorId, String cursoId) {
        // CORRIGIDO: nomes de variáveis duplicados
        var idProfessor = UUID.fromString(professorId);
        var idCurso = UUID.fromString(cursoId);

        var id = new MatriculaProfessorId(idProfessor, idCurso);

        var matriculaExists = matriculaProfessorRepository.existsById(id);

        if (matriculaExists) {
            matriculaProfessorRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Matrícula não encontrada");
        }
    }

    private MatriculaProfessorResponseDto convertToResponseDto(MatriculaProfessor matricula) {
        var response = new MatriculaProfessorResponseDto();
        response.setProfessorId(matricula.getProfessorId());
        response.setCursoId(matricula.getCursoId());
        response.setStatus_professor(matricula.getStatus_professor());

        // Carregar nomes se os relacionamentos estiverem disponíveis
        if (matricula.getProfessor() != null) {
            response.setNomeprofessor(matricula.getProfessor().getNomeprofessor());
        }

        // Quando criar Curso, descomentar:
         if (matricula.getCurso() != null) {
             response.setNomecurso(matricula.getCurso().getNomecurso());
         }

        return response;
    }


}
