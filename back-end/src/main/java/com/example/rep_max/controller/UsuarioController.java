package com.example.rep_max.controller;

import com.example.rep_max.DTO.response.UsuarioResponse;
import com.example.rep_max.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> getId(@PathVariable Long id) {
        return ResponseEntity.of(usuarioService.getById(id));
    }

    @GetMapping()
    public ResponseEntity<List<UsuarioResponse>> getAllUsuarios() {
        return ResponseEntity.ok(usuarioService.getAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativarUsuario(@PathVariable Long id) {
        usuarioService.desativarUsuario(id);

        return ResponseEntity.noContent().build();
    }


}
