package com.sistema_de_qualificacao.sistema_de_qualificacao.repository;

import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Boletim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BoletimRepository extends JpaRepository<Boletim, UUID> {

    // ========== BUSCAS BÁSICAS ==========

    // Busca Boletim específico de um aluno em um curso
    @Query("SELECT b FROM Boletim b WHERE b.alunoId = :alunoId AND b.cursoId = :cursoId")
    Optional<Boletim> findByAlunoIdAndCursoId(@Param("alunoId") UUID alunoId, @Param("cursoId") UUID cursoId);

    // Busca todos os Boletims de um aluno (todos os cursos)
    @Query("SELECT b FROM Boletim b WHERE b.alunoId = :alunoId")
    List<Boletim> findByAlunoId(@Param("alunoId") UUID alunoId);

    // Busca todos os Boletims de um curso (todos os alunos)
    @Query("SELECT b FROM Boletim b WHERE b.cursoId = :cursoId")
    List<Boletim> findByCursoId(@Param("cursoId") UUID cursoId);

    // Verifica se já existe Boletim do aluno no curso
    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM Boletim b WHERE b.alunoId = :alunoId AND b.cursoId = :cursoId")
    boolean existsByAlunoIdAndCursoId(@Param("alunoId") UUID alunoId, @Param("cursoId") UUID cursoId);

    // ========== BUSCAS COM DETALHES (JOIN FETCH) ==========

    // Busca Boletim com detalhes do aluno e curso carregados
    @Query("SELECT b FROM Boletim b LEFT JOIN FETCH b.aluno LEFT JOIN FETCH b.curso WHERE b.boletimId = :boletimId")
    Optional<Boletim> findByIdWithDetails(@Param("boletimId") UUID boletimId);

    // Busca todos os Boletims de um curso com detalhes
    @Query("SELECT b FROM Boletim b LEFT JOIN FETCH b.aluno LEFT JOIN FETCH b.curso WHERE b.cursoId = :cursoId")
    List<Boletim> findByCursoIdWithDetails(@Param("cursoId") UUID cursoId);

    // Busca todos os Boletims de um aluno com detalhes
    @Query("SELECT b FROM Boletim b LEFT JOIN FETCH b.aluno LEFT JOIN FETCH b.curso WHERE b.alunoId = :alunoId")
    List<Boletim> findByAlunoIdWithDetails(@Param("alunoId") UUID alunoId);

    // ========== FILTROS POR FREQUÊNCIA ==========

    // Busca Boletims com frequência maior ou igual a X%
    @Query("SELECT b FROM Boletim b WHERE b.frequenciaBoletim >= :frequenciaMinima")
    List<Boletim> findByFrequenciaBoletimMaiorOuIgual(@Param("frequenciaMinima") Integer frequenciaMinima);

    // Busca Boletims de um curso com frequência >= X%
    @Query("SELECT b FROM Boletim b WHERE b.cursoId = :cursoId AND b.frequenciaBoletim >= :frequenciaMinima")
    List<Boletim> findByCursoIdAndFrequenciaMaiorOuIgual(@Param("cursoId") UUID cursoId, @Param("frequenciaMinima") Integer frequenciaMinima);

    // Busca Boletims com frequência < X% (alunos em risco)
    @Query("SELECT b FROM Boletim b WHERE b.frequenciaBoletim < :frequenciaMaxima")
    List<Boletim> findByFrequenciaBoletimMenorQue(@Param("frequenciaMaxima") Integer frequenciaMaxima);

    // ========== FILTROS POR DESEMPENHO (NOTA) ==========

    // Busca Boletims com desempenho >= X
    @Query("SELECT b FROM Boletim b WHERE b.desempenhoBoletim >= :desempenhoMinimo")
    List<Boletim> findByDesempenhoBoletimMaiorOuIgual(@Param("desempenhoMinimo") Double desempenhoMinimo);

    // Busca Boletims de um curso com desempenho >= X
    @Query("SELECT b FROM Boletim b WHERE b.cursoId = :cursoId AND b.desempenhoBoletim >= :desempenhoMinimo")
    List<Boletim> findByCursoIdAndDesempenhoMaiorOuIgual(@Param("cursoId") UUID cursoId, @Param("desempenhoMinimo") Double desempenhoMinimo);

    // Busca Boletims com desempenho < X
    @Query("SELECT b FROM Boletim b WHERE b.desempenhoBoletim < :desempenhoMaximo")
    List<Boletim> findByDesempenhoBoletimMenorQue(@Param("desempenhoMaximo") Double desempenhoMaximo);

    // ========== APROVAÇÃO/REPROVAÇÃO ==========

    // Busca alunos aprovados em um curso (nota >= 7.0 E frequência >= 75%)
    @Query("SELECT b FROM Boletim b WHERE b.cursoId = :cursoId AND b.desempenhoBoletim >= 7.0 AND b.frequenciaBoletim >= 75")
    List<Boletim> findAprovadosByCurso(@Param("cursoId") UUID cursoId);

    // Busca alunos reprovados em um curso (nota < 7.0 OU frequência < 75%)
    @Query("SELECT b FROM Boletim b WHERE b.cursoId = :cursoId AND (b.desempenhoBoletim < 7.0 OR b.frequenciaBoletim < 75)")
    List<Boletim> findReprovadosByCurso(@Param("cursoId") UUID cursoId);

    // Busca alunos em recuperação (nota entre 5.0 e 6.9)
    @Query("SELECT b FROM Boletim b WHERE b.cursoId = :cursoId AND b.desempenhoBoletim >= 5.0 AND b.desempenhoBoletim < 7.0")
    List<Boletim> findAlunosEmRecuperacao(@Param("cursoId") UUID cursoId);

    // ========== CONTAGENS ==========

    // Conta quantos Boletims existem em um curso
    @Query("SELECT COUNT(b) FROM Boletim b WHERE b.cursoId = :cursoId")
    long countByCursoId(@Param("cursoId") UUID cursoId);

    // Conta quantos cursos um aluno cursou
    @Query("SELECT COUNT(b) FROM Boletim b WHERE b.alunoId = :alunoId")
    long countByAlunoId(@Param("alunoId") UUID alunoId);

    // Conta aprovados no curso
    @Query("SELECT COUNT(b) FROM Boletim b WHERE b.cursoId = :cursoId AND b.desempenhoBoletim >= 7.0 AND b.frequenciaBoletim >= 75")
    long countAprovadosByCurso(@Param("cursoId") UUID cursoId);

    // Conta reprovados no curso
    @Query("SELECT COUNT(b) FROM Boletim b WHERE b.cursoId = :cursoId AND (b.desempenhoBoletim < 7.0 OR b.frequenciaBoletim < 75)")
    long countReprovadosByCurso(@Param("cursoId") UUID cursoId);

    // ========== CÁLCULO DE MÉDIAS ==========

    // Calcula média de desempenho de um curso
    @Query("SELECT AVG(b.desempenhoBoletim) FROM Boletim b WHERE b.cursoId = :cursoId")
    Double calcularMediaDesempenhoCurso(@Param("cursoId") UUID cursoId);

    // Calcula média de frequência de um curso
    @Query("SELECT AVG(b.frequenciaBoletim) FROM Boletim b WHERE b.cursoId = :cursoId")
    Double calcularMediaFrequenciaCurso(@Param("cursoId") UUID cursoId);

    // Calcula média de desempenho de um aluno (em todos os cursos)
    @Query("SELECT AVG(b.desempenhoBoletim) FROM Boletim b WHERE b.alunoId = :alunoId")
    Double calcularMediaDesempenhoAluno(@Param("alunoId") UUID alunoId);

    // Calcula média de frequência de um aluno
    @Query("SELECT AVG(b.frequenciaBoletim) FROM Boletim b WHERE b.alunoId = :alunoId")
    Double calcularMediaFrequenciaAluno(@Param("alunoId") UUID alunoId);

    // ========== RANKING ==========

    // Top N alunos com melhor desempenho no curso
    @Query("SELECT b FROM Boletim b WHERE b.cursoId = :cursoId ORDER BY b.desempenhoBoletim DESC LIMIT :limit")
    List<Boletim> findTopAlunosByCurso(@Param("cursoId") UUID cursoId, @Param("limit") int limit);

    // Alunos com pior desempenho no curso
    @Query("SELECT b FROM Boletim b WHERE b.cursoId = :cursoId ORDER BY b.desempenhoBoletim ASC LIMIT :limit")
    List<Boletim> findBottomAlunosByCurso(@Param("cursoId") UUID cursoId, @Param("limit") int limit);

    // Boletims ordenados por desempenho (decrescente)
    @Query("SELECT b FROM Boletim b WHERE b.cursoId = :cursoId ORDER BY b.desempenhoBoletim DESC")
    List<Boletim> findByCursoIdOrderByDesempenhoDesc(@Param("cursoId") UUID cursoId);

    // Boletims ordenados por frequência (decrescente)
    @Query("SELECT b FROM Boletim b WHERE b.cursoId = :cursoId ORDER BY b.frequenciaBoletim DESC")
    List<Boletim> findByCursoIdOrderByFrequenciaDesc(@Param("cursoId") UUID cursoId);

    // ========== BUSCA AVANÇADA ==========

    // Alunos críticos (baixa frequência E baixo desempenho)
    @Query("SELECT b FROM Boletim b WHERE b.cursoId = :cursoId AND b.frequenciaBoletim < 75 AND b.desempenhoBoletim < 7.0")
    List<Boletim> findAlunosCriticosByCurso(@Param("cursoId") UUID cursoId);

    // Alunos destaque (alta frequência E alto desempenho)
    @Query("SELECT b FROM Boletim b WHERE b.cursoId = :cursoId AND b.frequenciaBoletim >= 90 AND b.desempenhoBoletim >= 9.0")
    List<Boletim> findAlunosDestaqueByCurso(@Param("cursoId") UUID cursoId);

    // Busca com múltiplos critérios
    @Query("SELECT b FROM Boletim b WHERE b.cursoId = :cursoId AND b.frequenciaBoletim >= :frequenciaMinima AND b.desempenhoBoletim >= :desempenhoMinimo")
    List<Boletim> findByCursoIdWithCriterios(
            @Param("cursoId") UUID cursoId,
            @Param("frequenciaMinima") Integer frequenciaMinima,
            @Param("desempenhoMinimo") Double desempenhoMinimo
    );
}