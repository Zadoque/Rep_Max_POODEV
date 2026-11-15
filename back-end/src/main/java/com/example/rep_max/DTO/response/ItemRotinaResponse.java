package com.example.rep_max.DTO.response;

public record ItemRotinaResponse(
        Long id,
        Long exercicioId,
        String nomeExercicio,
        Integer ordem,
        Integer quantidadeSeries
) {}
