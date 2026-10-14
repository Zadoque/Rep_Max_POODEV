package com.example.rep_max.controller;

import com.example.rep_max.DTO.response.UsuarioResponse;
import com.example.rep_max.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

}
