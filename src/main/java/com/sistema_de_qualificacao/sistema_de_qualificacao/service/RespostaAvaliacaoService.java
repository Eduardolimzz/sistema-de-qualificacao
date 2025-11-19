package com.sistema_de_qualificacao.sistema_de_qualificacao.service;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreateRespostaAvaliacaoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.RespostaAvaliacaoResponseDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.UpdateRespostaAvaliacaoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.RespostaAvaliacao;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.AlunoRepository;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.AvaliacaoRepository;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.RespostaAvaliacaoRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RespostaAvaliacaoService {

    private final RespostaAvaliacaoRepository respostaAvaliacaoRepository;
    private final AlunoRepository alunoRepository;
    private final AvaliacaoRepository avaliacaoRepository;
    private final BoletimService boletimService;

    public RespostaAvaliacaoService(RespostaAvaliacaoRepository respostaAvaliacaoRepository,
                                    AlunoRepository alunoRepository,
                                    AvaliacaoRepository avaliacaoRepository,
                                    @Lazy BoletimService boletimService) {
        this.respostaAvaliacaoRepository = respostaAvaliacaoRepository;
        this.alunoRepository = alunoRepository;
        this.avaliacaoRepository = avaliacaoRepository;
        this.boletimService = boletimService;
    }

    @Transactional
    public UUID createRespostaAvaliacao(CreateRespostaAvaliacaoDto createDto) {
        // Verifica se o aluno existe
        var alunoExists = alunoRepository.existsById(createDto.getAlunoId());
        if (!alunoExists) {
            throw new IllegalArgumentException("Aluno não encontrado com ID: " + createDto.getAlunoId());
        }

        // Verifica se a avaliação existe
        var avaliacaoExists = avaliacaoRepository.existsById(createDto.getAvaliacaoId());
        if (!avaliacaoExists) {
            throw new IllegalArgumentException("Avaliação não encontrada com ID: " + createDto.getAvaliacaoId());
        }

        // Verifica se aluno já respondeu esta avaliação
        var jaRespondeu = respostaAvaliacaoRepository.existsByAvaliacaoIdAndAlunoId(
                createDto.getAvaliacaoId(),
                createDto.getAlunoId()
        );
        if (jaRespondeu) {
            throw new IllegalArgumentException("Você já respondeu esta avaliação");
        }

        // Cria a resposta
        var entity = new RespostaAvaliacao();
        entity.setAvaliacaoId(createDto.getAvaliacaoId());
        entity.setAlunoId(createDto.getAlunoId());
        entity.setTextoResposta(createDto.getTextoResposta());
        entity.setStatusResposta("PENDENTE");
        entity.setDataConclusao(LocalDateTime.now());
        // dataInicio é preenchido automaticamente via @CreationTimestamp
        // notaObtida fica NULL

        var saved = respostaAvaliacaoRepository.save(entity);
        return saved.getRespostaAvaliacaoId();
    }

    public Optional<RespostaAvaliacaoResponseDto> getRespostaById(String respostaId) {
        var id = UUID.fromString(respostaId);
        return respostaAvaliacaoRepository.findByIdWithDetails(id)
                .map(this::convertToResponseDto);
    }

    public List<RespostaAvaliacaoResponseDto> listRespostasByAvaliacao(String avaliacaoId) {
        var id = UUID.fromString(avaliacaoId);
        return respostaAvaliacaoRepository.findByAvaliacaoIdWithDetails(id).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public List<RespostaAvaliacaoResponseDto> listRespostasByAluno(String alunoId) {
        var id = UUID.fromString(alunoId);
        return respostaAvaliacaoRepository.findByAlunoIdWithDetails(id).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public List<RespostaAvaliacaoResponseDto> listRespostasByStatus(String status) {
        return respostaAvaliacaoRepository.findByStatus(status).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public List<RespostaAvaliacaoResponseDto> listRespostasPendentes() {
        return listRespostasByStatus("PENDENTE");
    }

    @Transactional
    public void updateResposta(String respostaId, UpdateRespostaAvaliacaoDto updateDto) {
        var id = UUID.fromString(respostaId);
        var respostaEntity = respostaAvaliacaoRepository.findById(id);

        if (respostaEntity.isPresent()) {
            var resposta = respostaEntity.get();

            // Só permite atualizar se ainda estiver PENDENTE
            if (!"PENDENTE".equals(resposta.getStatusResposta())) {
                throw new IllegalArgumentException("Não é possível editar uma resposta já corrigida");
            }

            if (updateDto.getTextoResposta() != null && !updateDto.getTextoResposta().isBlank()) {
                resposta.setTextoResposta(updateDto.getTextoResposta());
            }

            respostaAvaliacaoRepository.save(resposta);
        } else {
            throw new IllegalArgumentException("Resposta não encontrada");
        }
    }

    @Transactional
    public void lancarNota(String respostaId, Double nota) {
        var id = UUID.fromString(respostaId);
        var resposta = respostaAvaliacaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Resposta não encontrada"));

        resposta.setNotaObtida(nota);
        resposta.setStatusResposta("CONCLUIDA");
        respostaAvaliacaoRepository.save(resposta);

        // ✅ ATUALIZA O BOLETIM AUTOMATICAMENTE
        var avaliacao = avaliacaoRepository.findById(resposta.getAvaliacaoId())
                .orElseThrow(() -> new IllegalArgumentException("Avaliação não encontrada"));

        boletimService.atualizarBoletim(resposta.getAlunoId(), avaliacao.getCursoId());
    }

    @Transactional
    public void deleteResposta(String respostaId) {
        var id = UUID.fromString(respostaId);
        var respostaExists = respostaAvaliacaoRepository.existsById(id);

        if (respostaExists) {
            respostaAvaliacaoRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Resposta não encontrada");
        }
    }

    public Long countRespostasByAvaliacao(String avaliacaoId) {
        var id = UUID.fromString(avaliacaoId);
        return respostaAvaliacaoRepository.countByAvaliacaoId(id);
    }

    public Double calcularMediaAvaliacao(String avaliacaoId) {
        var id = UUID.fromString(avaliacaoId);
        return respostaAvaliacaoRepository.calcularMediaNotasAvaliacao(id);
    }

    public Double calcularMediaAluno(String alunoId) {
        var id = UUID.fromString(alunoId);
        return respostaAvaliacaoRepository.calcularMediaNotasAluno(id);
    }

    private RespostaAvaliacaoResponseDto convertToResponseDto(RespostaAvaliacao resposta) {
        var dto = new RespostaAvaliacaoResponseDto();
        dto.setRespostaAvaliacaoId(resposta.getRespostaAvaliacaoId());
        dto.setAvaliacaoId(resposta.getAvaliacaoId());
        dto.setAlunoId(resposta.getAlunoId());
        dto.setTextoResposta(resposta.getTextoResposta());
        dto.setNotaObtida(resposta.getNotaObtida());
        dto.setStatusResposta(resposta.getStatusResposta());
        dto.setDataInicio(resposta.getDataInicio());
        dto.setDataConclusao(resposta.getDataConclusao());

        // Carregar dados relacionados se disponíveis
        if (resposta.getAluno() != null) {
            dto.setNomeAluno(resposta.getAluno().getNomealuno());
            dto.setEmailAluno(resposta.getAluno().getEmailaluno());
        }

        if (resposta.getAvaliacao() != null) {
            dto.setTituloAvaliacao(resposta.getAvaliacao().getTituloAvaliacao());
            dto.setPesoAvaliacao(resposta.getAvaliacao().getPesoAvaliacao());

            if (resposta.getAvaliacao().getCurso() != null) {
                dto.setNomeCurso(resposta.getAvaliacao().getCurso().getNomecurso());
            }
        }

        return dto;
    }
}