package com.example.rep_max.DTO.request;

public record UsuarioRequest(
        String nome,
        String email,
        String senha
) {
}