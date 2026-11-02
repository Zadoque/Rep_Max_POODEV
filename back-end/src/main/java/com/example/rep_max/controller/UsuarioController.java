package com.example.rep_max.controller;

import com.example.rep_max.DTO.response.UsuarioResponse;
import com.example.rep_max.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> getMyUser(Authentication authentication) {
        UsuarioResponse usuarioResponse = usuarioService.getByEmail(
                authentication.getName()); //name = email;

        return ResponseEntity.ok(usuarioResponse);
    }

    @GetMapping()
    public ResponseEntity<List<UsuarioResponse>> getAllUsuarios() {
        return ResponseEntity.ok(usuarioService.getAll());
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> desativarUsuario(
            Authentication authentication,
            HttpServletRequest request,
            HttpServletResponse response) {
        UsuarioResponse usuarioResponse = usuarioService.
                getByEmail(authentication.getName());
        usuarioService.desativarUsuario(usuarioResponse.id());

        new SecurityContextLogoutHandler()
                .logout(request, response, authentication);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> getById(@PathVariable Long id) {
        return ResponseEntity.of(usuarioService.getById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativarUsuarioPorId(@PathVariable Long id) {
        usuarioService.desativarUsuario(id);

        return ResponseEntity.noContent().build();
    }




}
