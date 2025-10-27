package com.sistema_de_qualificacao.sistema_de_qualificacao.repository;

import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.MatriculaAluno;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.MatriculaAlunoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MatriculaAlunoRepository extends JpaRepository<MatriculaAluno, MatriculaAlunoId> {

    //Busca todas as matrículas de um aluno específico
    @Query("SELECT m FROM MatriculaAluno m WHERE m.alunoId = :alunoId")
    List<MatriculaAluno> findAlunoById(@Param("alunoId") UUID alunoId);

    //Busca todas as matrículas de um curso específico
    @Query("SELECT m FROM MatriculaAluno m WHERE m.cursoId = :cursoId")
    List<MatriculaAluno> findCursoById(@Param("cursoId") UUID cursoId);

    //Verifica se existe matrícula para aluno e curso
    @Query("SELECT CASE WHEN COUNT(m) > 0 THEN true ELSE false END FROM MatriculaAluno m WHERE m.alunoId = :alunoId AND m.cursoId = :cursoId")
    boolean existsAlunoByIdAndCursoById(@Param("alunoId") UUID alunoId, @Param("cursoId") UUID cursoId);

    //Busca matrícula específica
    @Query("SELECT m FROM MatriculaAluno m WHERE m.alunoId = :alunoId and m.cursoId = :cursoId")
    Optional<MatriculaAluno> findAlunoByIdAndCursoById(@Param("alunoId") UUID alunoId, @Param("cursoId") UUID cursoId);

    //Busca por status das matrículas
    @Query("SELECT m FROM MatriculaAluno m WHERE m.status = :status")
    List<MatriculaAluno> findByStatus(@Param("status") String status);
}
