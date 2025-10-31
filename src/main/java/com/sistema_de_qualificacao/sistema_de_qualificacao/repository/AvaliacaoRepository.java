package com.sistema_de_qualificacao.sistema_de_qualificacao.repository;

import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Avaliacao;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.AvaliacaoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, AvaliacaoId> {

    // Busca todas as avaliações de um curso específico
    @Query("SELECT a FROM Avaliacao a WHERE a.cursoId = :cursoId")
    List<Avaliacao> findByCursoId(@Param("cursoId") UUID cursoId);

    // Busca todas as avaliações de um aluno específico
    @Query("SELECT a FROM Avaliacao a WHERE a.alunoId = :alunoId")
    List<Avaliacao> findByAlunoId(@Param("alunoId") UUID alunoId);

    // Busca avaliação específica por ID
    @Query("SELECT a FROM Avaliacao a WHERE a.avaliacaoId = :avaliacaoId")
    Optional<Avaliacao> findByAvaliacaoId(@Param("avaliacaoId") UUID avaliacaoId);

    // Verifica se existe avaliação para aluno e curso
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Avaliacao a WHERE a.alunoId = :alunoId AND a.cursoId = :cursoId")
    boolean existsByAlunoIdAndCursoId(@Param("alunoId") UUID alunoId, @Param("cursoId") UUID cursoId);

    // Busca avaliação específica por aluno e curso
    @Query("SELECT a FROM Avaliacao a WHERE a.alunoId = :alunoId AND a.cursoId = :cursoId")
    Optional<Avaliacao> findByAlunoIdAndCursoId(@Param("alunoId") UUID alunoId, @Param("cursoId") UUID cursoId);

    // Busca avaliações por nota específica
    @Query("SELECT a FROM Avaliacao a WHERE a.nota_avaliacao = :nota")
    List<Avaliacao> findByNota(@Param("nota") Integer nota);

    // Busca avaliações de um curso com nota específica
    @Query("SELECT a FROM Avaliacao a WHERE a.cursoId = :cursoId AND a.nota_avaliacao = :nota")
    List<Avaliacao> findByCursoIdAndNota(@Param("cursoId") UUID cursoId, @Param("nota") Integer nota);

    // Busca avaliações de um aluno com nota específica
    @Query("SELECT a FROM Avaliacao a WHERE a.alunoId = :alunoId AND a.nota_avaliacao = :nota")
    List<Avaliacao> findByAlunoIdAndNota(@Param("alunoId") UUID alunoId, @Param("nota") Integer nota);

    // Busca avaliações com nota maior ou igual a um valor
    @Query("SELECT a FROM Avaliacao a WHERE a.nota_avaliacao >= :notaMinima")
    List<Avaliacao> findByNotaMaiorOuIgual(@Param("notaMinima") Integer notaMinima);

    // Busca avaliações com nota menor que um valor
    @Query("SELECT a FROM Avaliacao a WHERE a.nota_avaliacao < :notaMaxima")
    List<Avaliacao> findByNotaMenorQue(@Param("notaMaxima") Integer notaMaxima);

    // Conta quantas avaliações um curso possui
    @Query("SELECT COUNT(a) FROM Avaliacao a WHERE a.cursoId = :cursoId")
    long countByCursoId(@Param("cursoId") UUID cursoId);

    // Conta quantas avaliações um aluno possui
    @Query("SELECT COUNT(a) FROM Avaliacao a WHERE a.alunoId = :alunoId")
    long countByAlunoId(@Param("alunoId") UUID alunoId);

    // Calcula a média de notas de um curso
    @Query("SELECT AVG(a.nota_avaliacao) FROM Avaliacao a WHERE a.cursoId = :cursoId")
    Double calcularMediaNotasCurso(@Param("cursoId") UUID cursoId);

    // Calcula a média de notas de um aluno
    @Query("SELECT AVG(a.nota_avaliacao) FROM Avaliacao a WHERE a.alunoId = :alunoId")
    Double calcularMediaNotasAluno(@Param("alunoId") UUID alunoId);

    // Busca avaliações com JOIN FETCH para evitar N+1 queries (carrega aluno e curso)
    @Query("SELECT a FROM Avaliacao a JOIN FETCH a.aluno JOIN FETCH a.curso WHERE a.alunoId = :alunoId")
    List<Avaliacao> findByAlunoIdWithDetails(@Param("alunoId") UUID alunoId);

    // Busca avaliações de um curso com JOIN FETCH
    @Query("SELECT a FROM Avaliacao a JOIN FETCH a.aluno JOIN FETCH a.curso WHERE a.cursoId = :cursoId")
    List<Avaliacao> findByCursoIdWithDetails(@Param("cursoId") UUID cursoId);

    // Busca todas as avaliações com detalhes (use com cuidado, pode ser pesado)
    @Query("SELECT a FROM Avaliacao a JOIN FETCH a.aluno JOIN FETCH a.curso")
    List<Avaliacao> findAllWithDetails();

    // Busca avaliações ordenadas por nota (decrescente)
    @Query("SELECT a FROM Avaliacao a ORDER BY a.nota_avaliacao DESC")
    List<Avaliacao> findAllOrderByNotaDesc();

    // Busca melhores avaliações de um curso
    @Query("SELECT a FROM Avaliacao a WHERE a.cursoId = :cursoId ORDER BY a.nota_avaliacao DESC")
    List<Avaliacao> findByCursoIdOrderByNotaDesc(@Param("cursoId") UUID cursoId);

    // Busca piores avaliações de um curso
    @Query("SELECT a FROM Avaliacao a WHERE a.cursoId = :cursoId ORDER BY a.nota_avaliacao ASC")
    List<Avaliacao> findByCursoIdOrderByNotaAsc(@Param("cursoId") UUID cursoId);

    // Deleta avaliação por ID
    @Modifying
    @Transactional
    @Query("DELETE FROM Avaliacao a WHERE a.avaliacaoId = :avaliacaoId")
    void deleteByAvaliacaoId(@Param("avaliacaoId") UUID avaliacaoId);

    // Deleta todas as avaliações de um aluno específico
    @Modifying
    @Transactional
    @Query("DELETE FROM Avaliacao a WHERE a.alunoId = :alunoId")
    void deleteByAlunoId(@Param("alunoId") UUID alunoId);

    // Deleta todas as avaliações de um curso específico
    @Modifying
    @Transactional
    @Query("DELETE FROM Avaliacao a WHERE a.cursoId = :cursoId")
    void deleteByCursoId(@Param("cursoId") UUID cursoId);
}