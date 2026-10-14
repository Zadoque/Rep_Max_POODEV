package com.example.rep_max.DTO.response;

import com.example.rep_max.entity.TipoPerfil;

public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        TipoPerfil perfil,
        boolean ativo
) {
}