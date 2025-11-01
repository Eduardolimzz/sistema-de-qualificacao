package com.sistema_de_qualificacao.sistema_de_qualificacao.repository;

import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.RespostaAvaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RespostaAvaliacaoRepository extends JpaRepository<RespostaAvaliacao, UUID> {

    // Busca todas as respostas de uma avaliação específica
    @Query("SELECT r FROM RespostaAvaliacao r WHERE r.avaliacaoId = :avaliacaoId")
    List<RespostaAvaliacao> findByAvaliacaoId(@Param("avaliacaoId") UUID avaliacaoId);

    // Busca todas as respostas de um aluno específico
    @Query("SELECT r FROM RespostaAvaliacao r WHERE r.alunoId = :alunoId")
    List<RespostaAvaliacao> findByAlunoId(@Param("alunoId") UUID alunoId);

    // Busca resposta específica de um aluno em uma avaliação
    @Query("SELECT r FROM RespostaAvaliacao r WHERE r.avaliacaoId = :avaliacaoId AND r.alunoId = :alunoId")
    Optional<RespostaAvaliacao> findByAvaliacaoIdAndAlunoId(@Param("avaliacaoId") UUID avaliacaoId, @Param("alunoId") UUID alunoId);

    // Verifica se aluno já iniciou a avaliação
    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM RespostaAvaliacao r WHERE r.avaliacaoId = :avaliacaoId AND r.alunoId = :alunoId")
    boolean existsByAvaliacaoIdAndAlunoId(@Param("avaliacaoId") UUID avaliacaoId, @Param("alunoId") UUID alunoId);

    // Código Corrigido: Usando o nome correto do campo ID (respostaAvaliacaoId)
    @Query("SELECT r FROM RespostaAvaliacao r JOIN FETCH r.aluno JOIN FETCH r.avaliacao WHERE r.respostaAvaliacaoId = :respostaId")
    Optional<RespostaAvaliacao> findByIdWithDetails(@Param("respostaId") UUID respostaId);

    // Busca todas as respostas de uma avaliação com detalhes
    @Query("SELECT r FROM RespostaAvaliacao r JOIN FETCH r.aluno JOIN FETCH r.avaliacao WHERE r.avaliacaoId = :avaliacaoId")
    List<RespostaAvaliacao> findByAvaliacaoIdWithDetails(@Param("avaliacaoId") UUID avaliacaoId);

    // Busca todas as respostas de um aluno com detalhes
    @Query("SELECT r FROM RespostaAvaliacao r JOIN FETCH r.aluno JOIN FETCH r.avaliacao WHERE r.alunoId = :alunoId")
    List<RespostaAvaliacao> findByAlunoIdWithDetails(@Param("alunoId") UUID alunoId);

    // Busca respostas por status
    @Query("SELECT r FROM RespostaAvaliacao r WHERE r.statusResposta = :status")
    List<RespostaAvaliacao> findByStatus(@Param("status") String status);

    // Busca respostas de uma avaliação por status
    @Query("SELECT r FROM RespostaAvaliacao r WHERE r.avaliacaoId = :avaliacaoId AND r.statusResposta = :status")
    List<RespostaAvaliacao> findByAvaliacaoIdAndStatus(@Param("avaliacaoId") UUID avaliacaoId, @Param("status") String status);

    // Busca respostas de um aluno por status
    @Query("SELECT r FROM RespostaAvaliacao r WHERE r.alunoId = :alunoId AND r.statusResposta = :status")
    List<RespostaAvaliacao> findByAlunoIdAndStatus(@Param("alunoId") UUID alunoId, @Param("status") String status);

    // Conta quantos alunos realizaram a avaliação
    @Query("SELECT COUNT(r) FROM RespostaAvaliacao r WHERE r.avaliacaoId = :avaliacaoId")
    long countByAvaliacaoId(@Param("avaliacaoId") UUID avaliacaoId);

    // Conta quantas avaliações um aluno já fez
    @Query("SELECT COUNT(r) FROM RespostaAvaliacao r WHERE r.alunoId = :alunoId")
    long countByAlunoId(@Param("alunoId") UUID alunoId);

    // Calcula média de notas de uma avaliação
    @Query("SELECT AVG(r.notaObtida) FROM RespostaAvaliacao r WHERE r.avaliacaoId = :avaliacaoId AND r.notaObtida IS NOT NULL")
    Double calcularMediaNotasAvaliacao(@Param("avaliacaoId") UUID avaliacaoId);

    // Calcula média de notas de um aluno
    @Query("SELECT AVG(r.notaObtida) FROM RespostaAvaliacao r WHERE r.alunoId = :alunoId AND r.notaObtida IS NOT NULL")
    Double calcularMediaNotasAluno(@Param("alunoId") UUID alunoId);

    // Busca respostas concluídas ordenadas por nota (decrescente)
    @Query("SELECT r FROM RespostaAvaliacao r WHERE r.avaliacaoId = :avaliacaoId AND r.statusResposta = 'CONCLUIDA' ORDER BY r.notaObtida DESC")
    List<RespostaAvaliacao> findTopNotasByAvaliacaoId(@Param("avaliacaoId") UUID avaliacaoId);

    // Busca respostas com nota maior ou igual a um valor
    @Query("SELECT r FROM RespostaAvaliacao r WHERE r.notaObtida >= :notaMinima")
    List<RespostaAvaliacao> findByNotaMaiorOuIgual(@Param("notaMinima") Double notaMinima);

    // Busca respostas de um aluno em um curso específico (via avaliacao)
    @Query("SELECT r FROM RespostaAvaliacao r JOIN r.avaliacao a WHERE r.alunoId = :alunoId AND a.cursoId = :cursoId")
    List<RespostaAvaliacao> findByAlunoIdAndCursoId(@Param("alunoId") UUID alunoId, @Param("cursoId") UUID cursoId);
}