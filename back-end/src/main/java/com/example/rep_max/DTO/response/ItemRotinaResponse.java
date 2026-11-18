package com.example.rep_max.DTO.response;

public record ItemRotinaResponse(
        Long id,
        Long exercicioId,
        String exercicioNome,
        Integer ordem,
        Integer quantidadeSeries
) {}