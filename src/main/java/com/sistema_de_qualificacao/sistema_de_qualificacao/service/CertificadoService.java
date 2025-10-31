package com.sistema_de_qualificacao.sistema_de_qualificacao.service;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreateCertificadoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.UpdateCertificadoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Certificado;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.CertificadoRepository;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.AlunoRepository;
import com.sistema_de_qualificacao.sistema_de_qualificacao.repository.CursoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CertificadoService {
    private final CertificadoRepository certificadoRepository;
    private final AlunoRepository alunoRepository;
    private final CursoRepository cursoRepository;

    public CertificadoService(
            CertificadoRepository certificadoRepository,
            AlunoRepository alunoRepository,
            CursoRepository cursoRepository
    ) {
        this.certificadoRepository = certificadoRepository;
        this.alunoRepository = alunoRepository;
        this.cursoRepository = cursoRepository;
    }

    public UUID createCertificado(CreateCertificadoDto createCertificadoDto){
        var alunoId = UUID.fromString(createCertificadoDto.getAlunoId());
        var cursoId = UUID.fromString(createCertificadoDto.getCursoId());

        var alunoRef = alunoRepository.getReferenceById(alunoId);
        var cursoRef = cursoRepository.getReferenceById(cursoId);

        var entity = new Certificado();
        entity.setData_conclusao(createCertificadoDto.getData_conclusao());

        entity.setAluno(alunoRef);
        entity.setCurso(cursoRef);

        var certificadoSaved = certificadoRepository.save(entity);
        return certificadoSaved.getCertificadoId();
    }

    // CORRIGIDO: Sintaxe e uso do método JOIN FETCH
    @Transactional(readOnly = true)
    public Optional<Certificado> getCertificadoById(String certificadoId){
        UUID id = UUID.fromString(certificadoId); // PONTO E VÍRGULA ADICIONADO

        // REQUER QUE O MÉTODO ESTEJA NO REPOSITÓRIO (Próxima etapa)
        return certificadoRepository.findByIdWithAlunoAndCurso(id);
    }

    // CORRIGIDO: Uso do método JOIN FETCH para listar todos
    @Transactional(readOnly = true)
    public List<Certificado> listCertificado(){
        // Usa o novo método que carrega os relacionamentos para evitar LazyInitializationException
        return certificadoRepository.findAllWithAlunoAndCurso();
    }

    @Transactional
    public void updateCertificadoById(String certificadoId,
                                      UpdateCertificadoDto updateCertificadoDto){

        var id = UUID.fromString(certificadoId);

        var certificadoEntity = certificadoRepository.findById(id);

        if(certificadoEntity.isPresent()){
            var certificado = certificadoEntity.get();

            if(updateCertificadoDto.data_conclusao() != null){
                certificado.setData_conclusao(updateCertificadoDto.data_conclusao());

            }

            certificadoRepository.save(certificado);
        }else {
            throw new IllegalArgumentException("Curso não encontrado com o ID: " + certificadoId);
        }
    }

    @Transactional
    public void deleteById(String certificadoId){

        var id = UUID.fromString(certificadoId);

        var certificadoExists = certificadoRepository.existsById(id);

        if(certificadoExists){
            certificadoRepository.deleteById(id);
        }else {
            throw new IllegalArgumentException("Curso não encontrado com o ID: " + certificadoId);
        }
    }
}