package com.example.rep_max.controller;

import com.example.rep_max.DTO.request.SerieExecutadaRequest;
import com.example.rep_max.DTO.response.SerieExecutadaResponse;
import com.example.rep_max.service.SerieExecutadaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/treinos/{treinoId}/series")
public class SerieExecutadaController {

    private final SerieExecutadaService service;

    @PostMapping
    public ResponseEntity<SerieExecutadaResponse> create(
            @PathVariable Long treinoId,
            @Valid @RequestBody SerieExecutadaRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.create(
                        treinoId, request, authentication.getName()
                ));
    }

    @GetMapping
    public ResponseEntity<List<SerieExecutadaResponse>> getAll(
            @PathVariable Long treinoId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                service.findAll(treinoId, authentication.getName())
        );
    }

    @GetMapping("/{serieId}")
    public ResponseEntity<SerieExecutadaResponse> getById(
            @PathVariable Long treinoId,
            @PathVariable Long serieId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                service.getById(
                        treinoId, serieId, authentication.getName()
                )
        );
    }

    @PutMapping("/{serieId}")
    public ResponseEntity<SerieExecutadaResponse> update(
            @PathVariable Long treinoId,
            @PathVariable Long serieId,
            @Valid @RequestBody SerieExecutadaRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                service.update(
                        treinoId, serieId, request,
                        authentication.getName()
                )
        );
    }

    @DeleteMapping("/{serieId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long treinoId,
            @PathVariable Long serieId,
            Authentication authentication
    ) {
        service.delete(treinoId, serieId, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
