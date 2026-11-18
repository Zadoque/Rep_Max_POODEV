package com.example.rep_max.controller;

import com.example.rep_max.DTO.request.TreinoRequest;
import com.example.rep_max.DTO.request.TreinoUpdateRequest;
import com.example.rep_max.DTO.response.TreinoResponse;
import com.example.rep_max.service.TreinoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/treinos")
public class TreinoController {

    private final TreinoService service;

    @PostMapping
    public ResponseEntity<TreinoResponse> create(
            @Valid @RequestBody TreinoRequest request,
            Authentication authentication
    ) {
        TreinoResponse response = service.create(
                authentication.getName(),
                request
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<TreinoResponse>> getAll(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                service.findAll(authentication.getName())
        );
    }

    @GetMapping("/{treinoId}")
    public ResponseEntity<TreinoResponse> getById(
            @PathVariable Long treinoId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                service.getById(treinoId, authentication.getName())
        );
    }

    @PutMapping("/{treinoId}")
    public ResponseEntity<TreinoResponse> update(
            @PathVariable Long treinoId,
            @Valid @RequestBody TreinoUpdateRequest request,
            Authentication authentication
    ) {
        TreinoResponse response = service.update(
                treinoId,
                request,
                authentication.getName()
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{treinoId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long treinoId,
            Authentication authentication
    ) {
        service.delete(treinoId, authentication.getName());

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{treinoId}/pause")
    public ResponseEntity<Void> pause(@PathVariable Long treinoId, Authentication authentication) {
        service.pause(treinoId, authentication.getName());

        return ResponseEntity.noContent().build();

    }

    @PatchMapping("/{treinoId}/resume")
    public ResponseEntity<Void> resume(@PathVariable Long treinoId, Authentication authentication) {
        service.resume(treinoId, authentication.getName());

        return ResponseEntity.noContent().build();

    }

    @PatchMapping("/{treinoId}/finish")
    public ResponseEntity<Void> finish(@PathVariable Long treinoId, Authentication authentication) {
        service.finish(treinoId, authentication.getName());

        return ResponseEntity.noContent().build();

    }
}