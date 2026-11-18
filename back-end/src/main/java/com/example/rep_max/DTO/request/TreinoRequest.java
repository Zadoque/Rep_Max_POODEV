package com.example.rep_max.DTO.request;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record TreinoRequest(
        @NotNull
        @Positive
        Long rotinaOrigemId,
        @Size(max = 255)
        String observacoes
) {
}
