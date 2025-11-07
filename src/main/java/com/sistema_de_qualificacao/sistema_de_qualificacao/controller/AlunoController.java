package com.sistema_de_qualificacao.sistema_de_qualificacao.controller;

import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.CreateAlunoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.LoginRequestDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.LoginResponseDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.dto.UpdateAlunoDto;
import com.sistema_de_qualificacao.sistema_de_qualificacao.entity.Aluno;
import com.sistema_de_qualificacao.sistema_de_qualificacao.service.AlunoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/v1/alunos")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"})

public class AlunoController {

    private AlunoService alunoService;

    public AlunoController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    @PostMapping
    public ResponseEntity<Aluno> createAluno(@RequestBody CreateAlunoDto createAlunoDto){
        var alunoId = alunoService.createAluno(createAlunoDto);
        return ResponseEntity.created(URI.create("/v1/alunos/" + alunoId.toString())).build();
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginDto) {
        try {
            // 1. Chama o método que você acabou de criar no Service
            LoginResponseDto response = alunoService.autenticarAluno(loginDto);

            // 2. Se deu certo, retorna 200 OK com o token e a role
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            // 3. Se o service deu erro (senha/email errado), retorna 401
            return ResponseEntity.status(401).body(null);
        }
    }

    @GetMapping("/{alunoId}")
    public ResponseEntity<Aluno> getAlunoById(@PathVariable("alunoId") String alunoId){
        // Implementar lógica aqui
        var aluno = alunoService.getAlunoById(alunoId);

        if(aluno.isPresent()){
            return ResponseEntity.ok(aluno.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Aluno>> listAlunos(){
        var alunos = alunoService.listAlunos();

        return ResponseEntity.ok(alunos);
    }

    @PutMapping("/{alunoId}") //nos precisamos receber o id como parametro, e informalo que é uma String
    //@RequestBody vai mostrar os campo que devem ser atualizados, isso é mostrado no UpdateAlunoDto
    public ResponseEntity<Void> updateAlunoById(@PathVariable("alunoId")String alunoId,
                                                @RequestBody UpdateAlunoDto updateAlunoDto){
        alunoService.updateAlunoById(alunoId, updateAlunoDto);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{alunoId}")
    public ResponseEntity<Void> deleById(@PathVariable("alunoId")String alunoId){
        alunoService.deleteById(alunoId);

        return ResponseEntity.noContent().build();
    }


}