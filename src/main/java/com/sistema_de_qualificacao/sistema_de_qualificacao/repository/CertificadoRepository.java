package com.sistema_de_qualificacao.sistema_de_qualificacao.repository;

import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Certificado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CertificadoRepository extends JpaRepository<Certificado, UUID> {

    // 1. Busca certificado por ID do Aluno e ID do Curso (Unique Constraint)
    @Query("SELECT c FROM Certificado c WHERE c.aluno.alunoId = :alunoId AND c.curso.cursoId = :cursoId")
    Optional<Certificado> findByAlunoIdAndCursoId(@Param("alunoId") UUID alunoId,
                                                  @Param("cursoId") UUID cursoId);

    // 2. Busca certificados por ID do Aluno
    @Query("SELECT c FROM Certificado c WHERE c.aluno.alunoId = :alunoId")
    List<Certificado> findByAlunoId(@Param("alunoId") UUID alunoId);

    // 3. Busca certificados por ID do Curso
    @Query("SELECT c FROM Certificado c WHERE c.curso.cursoId = :cursoId")
    List<Certificado> findByCursoId(@Param("cursoId") UUID cursoId);

    // 4. Busca certificados por data de conclusão exata
    @Query("SELECT c FROM Certificado c WHERE c.data_conclusao = :dataConclusao")
    List<Certificado> findByDataConclusao(@Param("dataConclusao") String dataConclusao);

    // 5. Verifica se existe certificado para um aluno em um curso específico
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Certificado c WHERE c.aluno.alunoId = :alunoId AND c.curso.cursoId = :cursoId")
    boolean existsByAlunoIdAndCursoId(@Param("alunoId") UUID alunoId,
                                      @Param("cursoId") UUID cursoId);

    // 6. Conta quantos certificados foram emitidos para um curso
    @Query("SELECT COUNT(c) FROM Certificado c WHERE c.curso.cursoId = :cursoId")
    long countByCursoId(@Param("cursoId") UUID cursoId);

    // 7. Conta quantos cursos um aluno certificou
    @Query("SELECT COUNT(c) FROM Certificado c WHERE c.aluno.alunoId = :alunoId")
    long countByAlunoId(@Param("alunoId") UUID alunoId);

    // 8. Busca certificados ordenados por data de conclusão (mais recentes primeiro)
    @Query("SELECT c FROM Certificado c ORDER BY c.data_conclusao DESC")
    List<Certificado> findAllOrderByDataConclusaoDesc();

    // 9. Busca certificados em um período de conclusão
    @Query("SELECT c FROM Certificado c WHERE c.data_conclusao LIKE CONCAT('%', :ano, '%')")
    List<Certificado> findByDataConclusaoContaining(@Param("ano") String ano);

    // 10. MÉTODO JOIN FETCH PARA BUSCAR POR ID (Para o GET by ID)
    @Query("SELECT c FROM Certificado c JOIN FETCH c.aluno JOIN FETCH c.curso WHERE c.certificadoId = :id")
    Optional<Certificado> findByIdWithAlunoAndCurso(@Param("id") UUID id);

    // 11. MÉTODO JOIN FETCH PARA BUSCAR TODOS (Para o GET /v1/certificado)
    @Query("SELECT c FROM Certificado c JOIN FETCH c.aluno JOIN FETCH c.curso")
    List<Certificado> findAllWithAlunoAndCurso(); // <-- NOVO MÉTODO

    // 12. Este método já estava correto e usava a convenção Spring Data
    Optional<Certificado> findByAluno_AlunoIdAndCurso_CursoId(UUID alunoId, UUID cursoId);
}