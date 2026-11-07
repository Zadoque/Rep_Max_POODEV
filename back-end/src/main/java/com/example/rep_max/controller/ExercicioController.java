package com.example.rep_max.controller;

import com.example.rep_max.DTO.request.ExercicioRequest;
import com.example.rep_max.DTO.response.ExercicioResponse;
import com.example.rep_max.service.ExercicioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/exercicios")
public class ExercicioController {

    private final ExercicioService exercicioService;

    @GetMapping
    public ResponseEntity<List<ExercicioResponse>> listar() {
        return ResponseEntity.ok(exercicioService.listarAtivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExercicioResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(exercicioService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ExercicioResponse> criar(
            @Valid @RequestBody ExercicioRequest request
    ) {
        ExercicioResponse salvo = exercicioService.criar(request);
        return ResponseEntity.created(URI.create("/exercicios/" + salvo.id()))
                .body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExercicioResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ExercicioRequest request
    ) {
        return ResponseEntity.ok(exercicioService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {
        exercicioService.desativar(id);
        return ResponseEntity.noContent().build();
    }
}
