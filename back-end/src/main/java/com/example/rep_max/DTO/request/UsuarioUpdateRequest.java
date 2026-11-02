package com.example.rep_max.DTO.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioUpdateRequest(
        @NotBlank(message = "Nome é obrigatório")
        @Size(
                min = 2,
                max = 100,
                message = "Nome deve ter entre 2 e 100 caracteres"
        )
        String nome

) {}
