package com.sistema_de_qualificacao.sistema_de_qualificacao.repository;

import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Eventos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EventosRepository extends JpaRepository<Eventos, UUID> {

    /** Busca uma lista de eventos cujo nome contenha o termo de busca. */
    List<Eventos> findByNomeEventoContainingIgnoreCase(String nomeEvento);

    /** Busca eventos associados a um determinado curso. */
    List<Eventos> findByCurso_CursoId(UUID cursoId);

    /** Busca eventos que ocorrerão após uma determinada data. */
    List<Eventos> findByDataEventoGreaterThanEqual(String dataEvento);

    /** Busca eventos por nome e curso. */
    List<Eventos> findByNomeEventoContainingIgnoreCaseAndCurso_CursoId(String nomeEvento, UUID cursoId);
}