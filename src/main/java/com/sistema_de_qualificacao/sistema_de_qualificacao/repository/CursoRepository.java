package com.sistema_de_qualificacao.sistema_de_qualificacao.repository;

import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CursoRepository extends JpaRepository<Curso, UUID> {

    // Busca curso por nome exato
    @Query("SELECT c FROM Curso c WHERE c.nomecurso = :nomecurso")
    Optional<Curso> findByNomecurso(@Param("nomecurso") String ac);

    // Busca cursos por nome (busca parcial/like)
    @Query("SELECT c FROM Curso c WHERE LOWER(c.nomecurso) LIKE LOWER(CONCAT('%', :nomecurso, '%'))")
    List<Curso> findByNomecursoContaining(@Param("nomecurso") String nomecurso);

    // Busca cursos por nível
    @Query("SELECT c FROM Curso c WHERE c.nivel_curso = :nivel_curso")
    List<Curso> findByNivelCurso(@Param("nivel_curso") String nivel_curso);

    // Busca cursos por duração
    @Query("SELECT c FROM Curso c WHERE c.duracao_curso = :duracao_curso")
    List<Curso> findByDuracaoCurso(@Param("duracao_curso") String duracao_curso);

    // Busca cursos por nível e duração (filtro combinado)
    @Query("SELECT c FROM Curso c WHERE c.nivel_curso = :nivel_curso AND c.duracao_curso = :duracao_curso")
    List<Curso> findByNivelAndDuracao(@Param("nivel_curso") String nivel_curso,
                                      @Param("duracao_curso") String duracao_curso);

    // Verifica se existe curso com determinado nome
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Curso c WHERE c.nomecurso = :nomecurso")
    boolean existsByNomecurso(@Param("nomecurso") String nomecurso);

    // Busca cursos que têm alunos matriculados
    @Query("SELECT DISTINCT c FROM Curso c JOIN c.matriculaAluno m WHERE m.alunoId = :alunoId")
    List<Curso> findCursosByAlunoId(@Param("alunoId") UUID alunoId);

    // Busca cursos que têm professores matriculados
    @Query("SELECT DISTINCT c FROM Curso c JOIN c.matriculaProfessor m WHERE m.professorId = :professorId")
    List<Curso> findCursosByProfessorId(@Param("professorId") UUID professorId);

    // Conta quantos alunos estão matriculados em um curso
    @Query("SELECT COUNT(m) FROM MatriculaAluno m WHERE m.cursoId = :cursoId")
    long countAlunosByCursoId(@Param("cursoId") UUID cursoId);

    // Conta quantos professores estão matriculados em um curso
    @Query("SELECT COUNT(m) FROM MatriculaProfessor m WHERE m.cursoId = :cursoId")
    long countProfessoresByCursoId(@Param("cursoId") UUID cursoId);

    // Busca cursos ordenados por nome
    @Query("SELECT c FROM Curso c ORDER BY c.nomecurso ASC")
    List<Curso> findAllOrderByNome();

    // Busca cursos criados recentemente (últimos N resultados)
    @Query("SELECT c FROM Curso c ORDER BY c.creationTimestamp DESC")
    List<Curso> findRecentCursos();
}