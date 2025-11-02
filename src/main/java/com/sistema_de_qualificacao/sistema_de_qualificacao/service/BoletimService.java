package com.sistema_de_qualificacao.sistema_de_qualificacao.service;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.BoletimResponseDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreateBoletimDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Boletim;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.AlunoRepository;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.AvaliacaoRepository;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.BoletimRepository;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.CursoRepository;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.RespostaAvaliacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BoletimService {

    private final BoletimRepository boletimRepository;
    private final CursoRepository cursoRepository;
    private final AvaliacaoRepository avaliacaoRepository;
    private final AlunoRepository alunoRepository;
    private final RespostaAvaliacaoRepository respostaAvaliacaoRepository;

    public BoletimService(BoletimRepository boletimRepository,
                          CursoRepository cursoRepository,
                          AvaliacaoRepository avaliacaoRepository,
                          AlunoRepository alunoRepository,
                          RespostaAvaliacaoRepository respostaAvaliacaoRepository) {
        this.boletimRepository = boletimRepository;
        this.cursoRepository = cursoRepository;
        this.avaliacaoRepository = avaliacaoRepository;
        this.alunoRepository = alunoRepository;
        this.respostaAvaliacaoRepository = respostaAvaliacaoRepository;
    }

    // ========== CRIAR BOLETIM INICIAL (quando aluno se matricula) ==========
    @Transactional
    public UUID createBoletim(CreateBoletimDto createBoletimDto) {
        // Verifica se o aluno existe
        var alunoExists = alunoRepository.existsById(createBoletimDto.getAlunoId());
        if (!alunoExists) {
            throw new IllegalArgumentException("Aluno não encontrado com ID: " + createBoletimDto.getAlunoId());
        }

        // Verifica se o curso existe
        var cursoExists = cursoRepository.existsById(createBoletimDto.getCursoId());
        if (!cursoExists) {
            throw new IllegalArgumentException("Curso não encontrado com ID: " + createBoletimDto.getCursoId());
        }

        // Verifica se já existe boletim para este aluno neste curso
        var boletimExists = boletimRepository.existsByAlunoIdAndCursoId(
                createBoletimDto.getAlunoId(),
                createBoletimDto.getCursoId()
        );
        if (boletimExists) {
            throw new IllegalArgumentException("Já existe um boletim para este aluno neste curso");
        }

        // Cria boletim inicial (valores zerados)
        var entity = new Boletim();
        entity.setAlunoId(createBoletimDto.getAlunoId());
        entity.setCursoId(createBoletimDto.getCursoId());
        entity.setFrequenciaBoletim(0);
        entity.setDesempenhoBoletim(0.0);

        var saved = boletimRepository.save(entity);
        return saved.getBoletimId();
    }

    // ========== ATUALIZAR BOLETIM (chamado quando professor lança nota) ==========
    @Transactional
    public void atualizarBoletim(UUID alunoId, UUID cursoId) {
        // ✅ BUSCA OU CRIA o boletim
        var boletimOpt = boletimRepository.findByAlunoIdAndCursoId(alunoId, cursoId);

        Boletim boletim;
        if (boletimOpt.isEmpty()) {
            // Se não existe, cria agora
            boletim = new Boletim();
            boletim.setAlunoId(alunoId);
            boletim.setCursoId(cursoId);
            boletim.setFrequenciaBoletim(0);
            boletim.setDesempenhoBoletim(0.0);
            boletim = boletimRepository.save(boletim);
        } else {
            boletim = boletimOpt.get();
        }

        // Busca todas as respostas do aluno neste curso
        var respostas = respostaAvaliacaoRepository.findByAlunoIdAndCursoId(alunoId, cursoId);

        // Calcula média ponderada das avaliações CONCLUÍDAS
        double somaNotasPonderadas = 0;
        double somaPesos = 0;
        int avaliacoesFinalizadas = 0;

        for (var resposta : respostas) {
            if ("CONCLUIDA".equals(resposta.getStatusResposta()) && resposta.getNotaObtida() != null) {
                var avaliacao = avaliacaoRepository.findById(resposta.getAvaliacaoId())
                        .orElseThrow(() -> new IllegalArgumentException("Avaliação não encontrada"));

                somaNotasPonderadas += resposta.getNotaObtida() * avaliacao.getPesoAvaliacao();
                somaPesos += avaliacao.getPesoAvaliacao();
                avaliacoesFinalizadas++;
            }
        }

        // Atualiza desempenho (média ponderada)
        if (somaPesos > 0) {
            double mediaFinal = somaNotasPonderadas / somaPesos;
            boletim.setDesempenhoBoletim(Math.round(mediaFinal * 100.0) / 100.0);
        }

        // Atualiza frequência (% de avaliações que o aluno participou)
        long totalAvaliacoesCurso = avaliacaoRepository.countByCursoId(cursoId);
        if (totalAvaliacoesCurso > 0) {
            int frequencia = (int) ((avaliacoesFinalizadas * 100) / totalAvaliacoesCurso);
            boletim.setFrequenciaBoletim(frequencia);
        }

        boletimRepository.save(boletim);
    }

    // ========== BUSCAR BOLETIM ==========
    public Optional<BoletimResponseDto> getBoletimByAlunoAndCurso(String alunoId, String cursoId) {
        var idAluno = UUID.fromString(alunoId);
        var idCurso = UUID.fromString(cursoId);

        return boletimRepository.findByAlunoIdAndCursoId(idAluno, idCurso)
                .map(this::convertToResponseDto);
    }

    public Optional<BoletimResponseDto> getBoletimById(String boletimId) {
        var id = UUID.fromString(boletimId);
        return boletimRepository.findByIdWithDetails(id)
                .map(this::convertToResponseDto);
    }

    // ========== LISTAR BOLETINS ==========
    public List<BoletimResponseDto> listBoletinsByAluno(String alunoId) {
        var id = UUID.fromString(alunoId);
        return boletimRepository.findByAlunoIdWithDetails(id).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public List<BoletimResponseDto> listBoletinsByCurso(String cursoId) {
        var id = UUID.fromString(cursoId);
        return boletimRepository.findByCursoIdWithDetails(id).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public List<BoletimResponseDto> listAprovadosByCurso(String cursoId) {
        var id = UUID.fromString(cursoId);
        return boletimRepository.findAprovadosByCurso(id).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public List<BoletimResponseDto> listReprovadosByCurso(String cursoId) {
        var id = UUID.fromString(cursoId);
        return boletimRepository.findReprovadosByCurso(id).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    // ========== ESTATÍSTICAS ==========
    public Long countBoletinsByCurso(String cursoId) {
        var id = UUID.fromString(cursoId);
        return boletimRepository.countByCursoId(id);
    }

    public Long countAprovadosByCurso(String cursoId) {
        var id = UUID.fromString(cursoId);
        return boletimRepository.countAprovadosByCurso(id);
    }

    public Double calcularMediaDesempenhoCurso(String cursoId) {
        var id = UUID.fromString(cursoId);
        return boletimRepository.calcularMediaDesempenhoCurso(id);
    }

    public Double calcularMediaFrequenciaCurso(String cursoId) {
        var id = UUID.fromString(cursoId);
        return boletimRepository.calcularMediaFrequenciaCurso(id);
    }

    // ========== DELETAR ==========
    @Transactional
    public void deleteBoletim(String boletimId) {
        var id = UUID.fromString(boletimId);
        var exists = boletimRepository.existsById(id);

        if (exists) {
            boletimRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Boletim não encontrado");
        }
    }

    // ========== CONVERTER PARA DTO ==========
    private BoletimResponseDto convertToResponseDto(Boletim boletim) {
        var dto = new BoletimResponseDto();
        dto.setBoletimId(boletim.getBoletimId());
        dto.setAlunoId(boletim.getAlunoId());
        dto.setCursoId(boletim.getCursoId());
        dto.setFrequenciaBoletim(boletim.getFrequenciaBoletim());
        dto.setDesempenhoBoletim(boletim.getDesempenhoBoletim());

        // Carrega dados relacionados
        if (boletim.getAluno() != null) {
            dto.setNomeAluno(boletim.getAluno().getNomealuno());
            dto.setEmailAluno(boletim.getAluno().getEmailaluno());
        }

        if (boletim.getCurso() != null) {
            dto.setNomeCurso(boletim.getCurso().getNomecurso());
            dto.setNivelCurso(boletim.getCurso().getNivel_curso());
        }

        // Define status de aprovação
        dto.setStatusAprovacao(calcularStatusAprovacao(
                boletim.getDesempenhoBoletim(),
                boletim.getFrequenciaBoletim()
        ));

        return dto;
    }

    private String calcularStatusAprovacao(Double desempenho, Integer frequencia) {
        if (desempenho >= 7.0 && frequencia >= 75) {
            return "APROVADO";
        } else if (desempenho >= 5.0 && desempenho < 7.0) {
            return "RECUPERACAO";
        } else {
            return "REPROVADO";
        }
    }
}