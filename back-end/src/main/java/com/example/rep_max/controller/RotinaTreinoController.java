package com.example.rep_max.controller;

import com.example.rep_max.DTO.request.RotinaTreinoRequest;
import com.example.rep_max.DTO.response.RotinaTreinoResponse;
import com.example.rep_max.service.RotinaTreinoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rotinas")
public class RotinaTreinoController {

    private final RotinaTreinoService rotinaTreinoService;

    @PostMapping
    public ResponseEntity<RotinaTreinoResponse> create(
            @Valid @RequestBody RotinaTreinoRequest request,
            Authentication authentication
    ) {
        RotinaTreinoResponse response = rotinaTreinoService.create(
                request,
                authentication.getName()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<RotinaTreinoResponse>> getAll(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                rotinaTreinoService.findALlAtiva(authentication.getName())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<RotinaTreinoResponse> getById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                rotinaTreinoService.findById(id, authentication.getName())
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<RotinaTreinoResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody RotinaTreinoRequest request,
            Authentication authentication
    ) {
        RotinaTreinoResponse response = rotinaTreinoService.update(
                id,
                request,
                authentication.getName()
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            Authentication authentication
    ) {
        rotinaTreinoService.desativar(id, authentication.getName());

        return ResponseEntity.noContent().build();
    }
}