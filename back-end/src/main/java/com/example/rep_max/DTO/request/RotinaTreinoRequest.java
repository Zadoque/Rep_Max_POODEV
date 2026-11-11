package com.example.rep_max.DTO.request;

import com.example.rep_max.entity.Usuario;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public record RotinaTreinoRequest(

        @NotBlank(message = "Nome é obrigatório")
        @Size(min = 2, max = 255)
        String nome

) {}
