package com.sistema_de_qualificacao.sistema_de_qualificacao.service;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.LoginRequestDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.LoginResponseDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.AlunoRepository;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.ProfessorRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;

    public AuthService(AlunoRepository alunoRepository, ProfessorRepository professorRepository) {
        this.alunoRepository = alunoRepository;
        this.professorRepository = professorRepository;
    }

    public LoginResponseDto autenticar(LoginRequestDto loginDto) {

        // 1️⃣ Tenta logar como ALUNO
        var alunoOptional = alunoRepository.findByEmailaluno(loginDto.getEmail());

        if (alunoOptional.isPresent()) {
            var aluno = alunoOptional.get();

            if (aluno.getSenhaaluno().equals(loginDto.getSenha())) {
                String token = "token-aluno-" + aluno.getNomealuno();
                // ✅ RETORNAR O ID DO ALUNO
                return new LoginResponseDto(
                        token,
                        "aluno",
                        aluno.getNomealuno(),
                        aluno.getAlunoId()
                );
            }
        }

        // 2️⃣ Se não achou aluno, tenta logar como PROFESSOR
        var professorOptional = professorRepository.findByEmailprofessor(loginDto.getEmail());

        if (professorOptional.isPresent()) {
            var professor = professorOptional.get();

            if (professor.getSenhaprofessor().equals(loginDto.getSenha())) {
                String token = "token-professor-" + professor.getNomeprofessor();
                // ✅ RETORNAR O ID DO PROFESSOR
                return new LoginResponseDto(
                        token,
                        "professor",
                        professor.getNomeprofessor(),
                        professor.getProfessorId()
                );
            }
        }

        // 3️⃣ Se não achou nenhum dos dois, erro
        throw new RuntimeException("Credenciais inválidas");
    }
}