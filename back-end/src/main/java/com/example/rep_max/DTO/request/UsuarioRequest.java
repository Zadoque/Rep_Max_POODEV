package com.example.rep_max.DTO.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioRequest(
        @NotBlank(message = "Nome é obrigatório")
        @Size(min = 2, max = 100, message = "Nome deve ter entre 3 e 100 caracteres")
        String nome,
        @NotBlank(message = "Email é obrigatório")
        @Email(message = "Email deve ter um formato válido")
        @Size(max = 254, message = "Email deve ter no máximo 254 caracteres")
        String email,
        @NotBlank(message = "Senha é obrigatória")
        @Size(min = 8, max = 128, message = "Senha deve ter entre 8 e 128 caracteres")
        String senha
) {
}