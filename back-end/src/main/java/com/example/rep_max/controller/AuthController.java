package com.example.rep_max.controller;

import com.example.rep_max.DTO.request.UsuarioRequest;
import com.example.rep_max.DTO.response.UsuarioResponse;
import com.example.rep_max.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioService usuarioService;

    @GetMapping
    public CsrfToken csrf(CsrfToken csrfToken) {
        return  csrfToken;
    }


    @PostMapping
    public ResponseEntity<UsuarioResponse> register(@Valid @RequestBody UsuarioRequest request) {
        UsuarioResponse usuarioResponse = usuarioService.saveUsuario(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(usuarioResponse);

    }



}
