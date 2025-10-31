package com.sistema_de_qualificacao.sistema_de_qualificacao.service;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreateMatriculaAlunoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.MatriculaAlunoResponseDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.UpdateMatriculaAlunoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.MatriculaAluno;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.MatriculaAlunoId;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.AlunoRepository;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.CursoRepository;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.MatriculaAlunoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MatriculaAlunoService {

    private final MatriculaAlunoRepository matriculaAlunoRepository;
    private final AlunoRepository alunoRepository;
    private final CursoRepository cursoRepository;

    public MatriculaAlunoService(MatriculaAlunoRepository matriculaAlunoRepository,
                                 AlunoRepository alunoRepository
                                ,CursoRepository cursoRepository
    ) {
        this.matriculaAlunoRepository = matriculaAlunoRepository;
        this.alunoRepository = alunoRepository;
        this.cursoRepository = cursoRepository;
    }

    @Transactional
    public MatriculaAlunoId createMatricula(CreateMatriculaAlunoDto createMatriculaAlunoDto) {

        var alunoExists = alunoRepository.existsById(createMatriculaAlunoDto.getAlunoId());

        if (!alunoExists) {
            throw new IllegalArgumentException("Aluno não encontrado com ID: " + createMatriculaAlunoDto.getAlunoId());
        }

        // Quando criar Curso, descomentar:
         var cursoExists = cursoRepository.existsById(createMatriculaAlunoDto.getCursoId());
         if (!cursoExists) {
             throw new IllegalArgumentException("Curso não encontrado com ID: " + createMatriculaAlunoDto.getCursoId());
         }

        var matriculaExists = matriculaAlunoRepository.existsAlunoByIdAndCursoById(
                createMatriculaAlunoDto.getAlunoId(),
                createMatriculaAlunoDto.getCursoId()
        );

        if (matriculaExists) {
            throw new IllegalArgumentException(
                    "Já existe uma matrícula para este aluno neste curso"
            );
        }

        var entity = new MatriculaAluno();
        entity.setAlunoId(createMatriculaAlunoDto.getAlunoId());
        entity.setCursoId(createMatriculaAlunoDto.getCursoId());
        entity.setStatus(createMatriculaAlunoDto.getStatus());

        var matriculaSaved = matriculaAlunoRepository.save(entity);

        return new MatriculaAlunoId(
                matriculaSaved.getAlunoId(),
                matriculaSaved.getCursoId()
        );
    }

    public Optional<MatriculaAlunoResponseDto> getMatriculaById(String alunoId, String cursoId) {
        var idAluno = UUID.fromString(alunoId);
        var idCurso = UUID.fromString(cursoId);

        return matriculaAlunoRepository.findAlunoByIdAndCursoById(idAluno, idCurso)
                .map(this::convertToResponseDto);
    }

    public List<MatriculaAlunoResponseDto> listAllMatriculas() {
        return matriculaAlunoRepository.findAll().stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public List<MatriculaAlunoResponseDto> listMatriculasByAlunoId(String alunoId) {
        var id = UUID.fromString(alunoId);
        return matriculaAlunoRepository.findAlunoById(id).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public List<MatriculaAlunoResponseDto> listMatriculasByCursoId(String cursoId) {
        var id = UUID.fromString(cursoId);
        return matriculaAlunoRepository.findCursoById(id).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public List<MatriculaAlunoResponseDto> listMatriculasByStatus(String status) {
        return matriculaAlunoRepository.findByStatus(status).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateMatricula(String alunoId, String cursoId, UpdateMatriculaAlunoDto updateDto) {
        // CORRIGIDO: nomes de variáveis duplicados
        var idAluno = UUID.fromString(alunoId);
        var idCurso = UUID.fromString(cursoId);

        var matriculaEntity = matriculaAlunoRepository.findAlunoByIdAndCursoById(idAluno, idCurso);

        if (matriculaEntity.isPresent()) {
            var matricula = matriculaEntity.get();

            if (updateDto.getStatus() != null && !updateDto.getStatus().isBlank()) {
                matricula.setStatus(updateDto.getStatus());
            }

            matriculaAlunoRepository.save(matricula);
        } else {
            throw new IllegalArgumentException("Matrícula não encontrada");
        }
    }

    @Transactional
    public void deleteMatricula(String alunoId, String cursoId) {
        // CORRIGIDO: nomes de variáveis duplicados
        var idAluno = UUID.fromString(alunoId);
        var idCurso = UUID.fromString(cursoId);

        var id = new MatriculaAlunoId(idAluno, idCurso);

        var matriculaExists = matriculaAlunoRepository.existsById(id);

        if (matriculaExists) {
            matriculaAlunoRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Matrícula não encontrada");
        }
    }

    private MatriculaAlunoResponseDto convertToResponseDto(MatriculaAluno matricula) {
        var response = new MatriculaAlunoResponseDto();
        response.setAlunoId(matricula.getAlunoId());
        response.setCursoId(matricula.getCursoId());
        response.setStatus(matricula.getStatus());

        // Carregar nomes se os relacionamentos estiverem disponíveis
        if (matricula.getAluno() != null) {
            response.setNomealuno(matricula.getAluno().getNomealuno());
        }

        // Quando criar Curso, descomentar:
         if (matricula.getCurso() != null) {
             response.setNomecurso(matricula.getCurso().getNomecurso());
         }

        return response;
    }
}