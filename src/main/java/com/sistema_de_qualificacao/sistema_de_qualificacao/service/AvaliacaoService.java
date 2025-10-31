package com.sistema_de_qualificacao.sistema_de_qualificacao.service;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.AvaliacaoResponseDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreateAvaliacaoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.UpdateAvaliacaoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Avaliacao;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.AvaliacaoRepository;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.CursoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AvaliacaoService {

    private final AvaliacaoRepository avaliacaoRepository;
    private final CursoRepository cursoRepository;

    public AvaliacaoService(AvaliacaoRepository avaliacaoRepository,
                            CursoRepository cursoRepository) {
        this.avaliacaoRepository = avaliacaoRepository;
        this.cursoRepository = cursoRepository;
    }

    @Transactional
    public UUID createAvaliacao(CreateAvaliacaoDto createAvaliacaoDto) {
        // Verifica se o curso existe
        var cursoExists = cursoRepository.existsById(createAvaliacaoDto.getCursoId());
        if (!cursoExists) {
            throw new IllegalArgumentException("Curso não encontrado com ID: " + createAvaliacaoDto.getCursoId());
        }

        // Verifica se já existe avaliação com mesmo título no curso
        boolean tituloExiste = avaliacaoRepository.existsByCursoIdAndTitulo(
                createAvaliacaoDto.getCursoId(),
                createAvaliacaoDto.getTituloAvaliacao()
        );

        if (tituloExiste) {
            throw new IllegalArgumentException("Já existe uma avaliação com este título no curso");
        }

        var entity = new Avaliacao();
        entity.setCursoId(createAvaliacaoDto.getCursoId());
        entity.setTituloAvaliacao(createAvaliacaoDto.getTituloAvaliacao());
        entity.setDescricaoAvaliacao(createAvaliacaoDto.getDescricaoAvaliacao());
        entity.setPesoAvaliacao(createAvaliacaoDto.getPesoAvaliacao());
        // dataCriacao será preenchida automaticamente via @CreationTimestamp

        var avaliacaoSaved = avaliacaoRepository.save(entity);
        return avaliacaoSaved.getAvaliacaoId();
    }

    public Optional<AvaliacaoResponseDto> getAvaliacaoById(String avaliacaoId) {
        var id = UUID.fromString(avaliacaoId);
        return avaliacaoRepository.findByIdWithDetails(id)
                .map(this::convertToResponseDto);
    }

    public List<AvaliacaoResponseDto> listAllAvaliacoes() {
        return avaliacaoRepository.findAllWithDetails().stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public List<AvaliacaoResponseDto> listAvaliacoesByCursoId(String cursoId) {
        var id = UUID.fromString(cursoId);
        return avaliacaoRepository.findByCursoIdWithDetails(id).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public List<AvaliacaoResponseDto> listAvaliacoesByTitulo(String titulo) {
        return avaliacaoRepository.findByTituloContaining(titulo).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public List<AvaliacaoResponseDto> listAvaliacoesRecentesByCurso(String cursoId, int limit) {
        var id = UUID.fromString(cursoId);
        return avaliacaoRepository.findTopNByCursoIdOrderByDataCriacaoDesc(id, limit).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public List<AvaliacaoResponseDto> listAvaliacoesByPeso(Double peso) {
        return avaliacaoRepository.findByPesoAvaliacao(peso).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public List<AvaliacaoResponseDto> listAvaliacoesRecentes(int dias) {
        LocalDateTime dataLimite = LocalDateTime.now().minusDays(dias);
        return avaliacaoRepository.findByDataCriacaoAfter(dataLimite).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public Long countAvaliacoesByCurso(String cursoId) {
        var id = UUID.fromString(cursoId);
        return avaliacaoRepository.countByCursoId(id);
    }

    public Double calcularSomaPesosCurso(String cursoId) {
        var id = UUID.fromString(cursoId);
        return avaliacaoRepository.calcularSomaPesosCurso(id);
    }

    public Double calcularPesoMedioCurso(String cursoId) {
        var id = UUID.fromString(cursoId);
        return avaliacaoRepository.calcularPesoMedioCurso(id);
    }

    @Transactional
    public void updateAvaliacao(String avaliacaoId, UpdateAvaliacaoDto updateDto) {
        var id = UUID.fromString(avaliacaoId);
        var avaliacaoEntity = avaliacaoRepository.findById(id);

        if (avaliacaoEntity.isPresent()) {
            var avaliacao = avaliacaoEntity.get();

            if (updateDto.getTituloAvaliacao() != null && !updateDto.getTituloAvaliacao().isBlank()) {
                // Verifica se o novo título já existe no curso
                var tituloExiste = avaliacaoRepository.existsByCursoIdAndTitulo(
                        avaliacao.getCursoId(),
                        updateDto.getTituloAvaliacao()
                );

                if (tituloExiste && !avaliacao.getTituloAvaliacao().equals(updateDto.getTituloAvaliacao())) {
                    throw new IllegalArgumentException("Já existe outra avaliação com este título no curso");
                }

                avaliacao.setTituloAvaliacao(updateDto.getTituloAvaliacao());
            }

            if (updateDto.getDescricaoAvaliacao() != null) {
                avaliacao.setDescricaoAvaliacao(updateDto.getDescricaoAvaliacao());
            }

            if (updateDto.getPesoAvaliacao() != null && updateDto.getPesoAvaliacao() > 0) {
                avaliacao.setPesoAvaliacao(updateDto.getPesoAvaliacao());
            }

            avaliacaoRepository.save(avaliacao);
        } else {
            throw new IllegalArgumentException("Avaliação não encontrada");
        }
    }

    @Transactional
    public void deleteAvaliacao(String avaliacaoId) {
        var id = UUID.fromString(avaliacaoId);
        var avaliacaoExists = avaliacaoRepository.existsById(id);

        if (avaliacaoExists) {
            avaliacaoRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Avaliação não encontrada");
        }
    }

    private AvaliacaoResponseDto convertToResponseDto(Avaliacao avaliacao) {
        var response = new AvaliacaoResponseDto();
        response.setAvaliacaoId(avaliacao.getAvaliacaoId());
        response.setCursoId(avaliacao.getCursoId());
        response.setTituloAvaliacao(avaliacao.getTituloAvaliacao());
        response.setDescricaoAvaliacao(avaliacao.getDescricaoAvaliacao());
        response.setDataCriacao(avaliacao.getDataCriacao());
        response.setPesoAvaliacao(avaliacao.getPesoAvaliacao());

        if (avaliacao.getCurso() != null) {
            response.setNomeCurso(avaliacao.getCurso().getNomecurso());
            response.setNivelCurso(avaliacao.getCurso().getNivel_curso());
            response.setDuracaoCurso(avaliacao.getCurso().getDuracao_curso());
        }

        return response;
    }
}