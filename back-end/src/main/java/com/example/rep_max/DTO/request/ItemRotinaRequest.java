package com.example.rep_max.DTO.request;

import jakarta.validation.constraints.Min;

import jakarta.validation.constraints.NotNull;

public record ItemRotinaRequest(
        @NotNull(message = "Exercício é obrigatório")
        Long exercicioId,


        @NotNull(message = "Ordem é obrigatória")
        @Min(value = 1, message = "Ordem deve ser maior que zero")
        Integer ordem,


        @NotNull(message = "Quantidade de séries é obrigatória")
        @Min(value = 1, message = "Quantidade de séries deve ser maior que zero")
        Integer quantidadeSeries
) {


}
