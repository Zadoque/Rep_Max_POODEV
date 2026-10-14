package com.example.rep_max.controller;

import com.example.rep_max.DTO.request.UsuarioRequest;
import com.example.rep_max.DTO.response.UsuarioResponse;
import com.example.rep_max.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<UsuarioResponse> register(@Valid @RequestBody UsuarioRequest request) {
        UsuarioResponse usuarioResponse = usuarioService.saveUsuario(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(usuarioResponse);

    }

}
