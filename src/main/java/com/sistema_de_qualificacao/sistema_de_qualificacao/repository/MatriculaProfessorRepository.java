package com.sistema_de_qualificacao.sistema_de_qualificacao.repository;

import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.MatriculaProfessor;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.MatriculaProfessorId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MatriculaProfessorRepository extends JpaRepository<MatriculaProfessor, MatriculaProfessorId> {

    //Busca todas as matrículas de um professor específico
    @Query("SELECT m FROM MatriculaProfessor m WHERE m.professorId = :professorId")
    List<MatriculaProfessor> findProfessorById(@Param("professorId")UUID professorId);

    //Busca todas as matrículas de um curso específico
    @Query("SELECT m FROM MatriculaProfessor m WHERE m.cursoId = :cursoId")
    List<MatriculaProfessor> findCursoById(@Param("cursoId") UUID cursoId);

    //Verifica se existe matrícula para professor e curso
    @Query("SELECT CASE WHEN COUNT(m) > 0 THEN true ELSE false END FROM MatriculaProfessor m WHERE m.professorId = :professorId AND m.cursoId = :cursoId")
    boolean existsProfessorByIdAndCursoById(@Param("professorId") UUID professorId, @Param("cursoId") UUID cursoId);

    //Busca matrícula específica
    @Query("SELECT m FROM MatriculaProfessor m WHERE m.professorId = :professorId and m.cursoId = :cursoId")
    Optional<MatriculaProfessor> findProfessorByIdAndCursoById(@Param("professorId") UUID professorId, @Param("cursoId") UUID cursoId);

    //Busca por status das matrículas
    @Query("SELECT m FROM MatriculaProfessor m WHERE m.status = :status")
    List<MatriculaProfessor> findByStatus(@Param("status_professor") String status);

}
