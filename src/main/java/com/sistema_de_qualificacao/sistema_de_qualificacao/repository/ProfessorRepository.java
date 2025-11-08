package com.sistema_de_qualificacao.sistema_de_qualificacao.repository;

import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, UUID> {
    Optional<Professor> findByEmailprofessor(String email); // ✅ CORRETO
}
