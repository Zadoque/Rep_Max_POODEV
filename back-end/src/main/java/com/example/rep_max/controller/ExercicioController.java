package com.example.rep_max.controller;


import com.example.rep_max.DTO.request.ExercicioRequest;
import com.example.rep_max.DTO.response.ExercicioResponse;
import com.example.rep_max.service.ExercicioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping(("/exercicios"))
public class ExercicioController {

    private final ExercicioService exercicioService;


    @PostMapping
    public ResponseEntity<ExercicioResponse> create(@Valid @RequestBody ExercicioRequest exercicioRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(exercicioService.create(exercicioRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExercicioResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(exercicioService.findById(id));

    }

    @GetMapping
    public ResponseEntity<List<ExercicioResponse>> getAll() {
        return ResponseEntity.ok(exercicioService.listAllAtivo());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id){
        exercicioService.desativar(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/{id}")
    public ResponseEntity<ExercicioResponse> update(@PathVariable Long id, @Valid @RequestBody ExercicioRequest request) {
        return ResponseEntity.ok(exercicioService.update(id, request));
    }

}
