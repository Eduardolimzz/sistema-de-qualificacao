package com.sistema_de_qualificacao.sistema_de_qualificacao.repository;

import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, UUID> {

    // ========== BUSCAS BÁSICAS ==========

    // Busca todas as avaliações de um curso específico
    @Query("SELECT a FROM Avaliacao a WHERE a.cursoId = :cursoId")
    List<Avaliacao> findByCursoId(@Param("cursoId") UUID cursoId);

    // Busca avaliação por ID com detalhes do curso carregados
    @Query("SELECT a FROM Avaliacao a LEFT JOIN FETCH a.curso WHERE a.avaliacaoId = :avaliacaoId")
    Optional<Avaliacao> findByIdWithDetails(@Param("avaliacaoId") UUID avaliacaoId);

    // Busca todas as avaliações de um curso com detalhes carregados
    @Query("SELECT a FROM Avaliacao a LEFT JOIN FETCH a.curso WHERE a.cursoId = :cursoId")
    List<Avaliacao> findByCursoIdWithDetails(@Param("cursoId") UUID cursoId);

    // Busca todas as avaliações com detalhes do curso
    @Query("SELECT a FROM Avaliacao a LEFT JOIN FETCH a.curso")
    List<Avaliacao> findAllWithDetails();

    // ========== BUSCAS POR TÍTULO ==========

    // Busca avaliações por título (busca parcial, case-insensitive)
    @Query("SELECT a FROM Avaliacao a WHERE LOWER(a.tituloAvaliacao) LIKE LOWER(CONCAT('%', :titulo, '%'))")
    List<Avaliacao> findByTituloContaining(@Param("titulo") String titulo);

    // Busca avaliações de um curso por título
    @Query("SELECT a FROM Avaliacao a WHERE a.cursoId = :cursoId AND LOWER(a.tituloAvaliacao) LIKE LOWER(CONCAT('%', :titulo, '%'))")
    List<Avaliacao> findByCursoIdAndTituloContaining(@Param("cursoId") UUID cursoId, @Param("titulo") String titulo);

    // Busca avaliação exata por título no curso
    @Query("SELECT a FROM Avaliacao a WHERE a.cursoId = :cursoId AND a.tituloAvaliacao = :titulo")
    Optional<Avaliacao> findByCursoIdAndTitulo(@Param("cursoId") UUID cursoId, @Param("titulo") String titulo);

    // ========== BUSCAS POR PESO ==========

    // Busca avaliações por peso específico
    @Query("SELECT a FROM Avaliacao a WHERE a.pesoAvaliacao = :peso")
    List<Avaliacao> findByPesoAvaliacao(@Param("peso") Double peso);

    // Busca avaliações com peso maior ou igual
    @Query("SELECT a FROM Avaliacao a WHERE a.pesoAvaliacao >= :pesoMinimo")
    List<Avaliacao> findByPesoMaiorOuIgual(@Param("pesoMinimo") Double pesoMinimo);

    // Busca avaliações de um curso por peso
    @Query("SELECT a FROM Avaliacao a WHERE a.cursoId = :cursoId AND a.pesoAvaliacao = :peso")
    List<Avaliacao> findByCursoIdAndPeso(@Param("cursoId") UUID cursoId, @Param("peso") Double peso);

    // ========== ORDENAÇÃO E LISTAGENS ==========

    // Busca avaliações ordenadas por data de criação (mais recentes primeiro)
    @Query("SELECT a FROM Avaliacao a ORDER BY a.dataCriacao DESC")
    List<Avaliacao> findAllOrderByDataCriacaoDesc();

    // Busca avaliações de um curso ordenadas por data
    @Query("SELECT a FROM Avaliacao a WHERE a.cursoId = :cursoId ORDER BY a.dataCriacao DESC")
    List<Avaliacao> findByCursoIdOrderByDataCriacaoDesc(@Param("cursoId") UUID cursoId);

    // Busca avaliações de um curso ordenadas por peso (decrescente)
    @Query("SELECT a FROM Avaliacao a WHERE a.cursoId = :cursoId ORDER BY a.pesoAvaliacao DESC")
    List<Avaliacao> findByCursoIdOrderByPesoDesc(@Param("cursoId") UUID cursoId);

    // Busca as N avaliações mais recentes de um curso
    @Query("SELECT a FROM Avaliacao a WHERE a.cursoId = :cursoId ORDER BY a.dataCriacao DESC LIMIT :limit")
    List<Avaliacao> findTopNByCursoIdOrderByDataCriacaoDesc(@Param("cursoId") UUID cursoId, @Param("limit") int limit);

    // ========== VERIFICAÇÕES E CONTAGENS ==========

    // Verifica se existe avaliação com título específico no curso
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Avaliacao a WHERE a.cursoId = :cursoId AND a.tituloAvaliacao = :titulo")
    boolean existsByCursoIdAndTitulo(@Param("cursoId") UUID cursoId, @Param("titulo") String titulo);

    // Conta quantas avaliações um curso possui
    @Query("SELECT COUNT(a) FROM Avaliacao a WHERE a.cursoId = :cursoId")
    long countByCursoId(@Param("cursoId") UUID cursoId);

    // Calcula a soma dos pesos das avaliações de um curso
    @Query("SELECT SUM(a.pesoAvaliacao) FROM Avaliacao a WHERE a.cursoId = :cursoId")
    Double calcularSomaPesosCurso(@Param("cursoId") UUID cursoId);

    // Calcula o peso médio das avaliações de um curso
    @Query("SELECT AVG(a.pesoAvaliacao) FROM Avaliacao a WHERE a.cursoId = :cursoId")
    Double calcularPesoMedioCurso(@Param("cursoId") UUID cursoId);

    // ========== BUSCAS ESPECÍFICAS ==========

    // Busca avaliações criadas após uma data específica
    @Query("SELECT a FROM Avaliacao a WHERE a.dataCriacao >= :dataInicio")
    List<Avaliacao> findByDataCriacaoAfter(@Param("dataInicio") java.time.LocalDateTime dataInicio);

    // Busca avaliações de um curso criadas após uma data
    @Query("SELECT a FROM Avaliacao a WHERE a.cursoId = :cursoId AND a.dataCriacao >= :dataInicio")
    List<Avaliacao> findByCursoIdAndDataCriacaoAfter(@Param("cursoId") UUID cursoId, @Param("dataInicio") java.time.LocalDateTime dataInicio);
}