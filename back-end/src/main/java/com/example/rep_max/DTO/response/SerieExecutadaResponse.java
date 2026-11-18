package com.example.rep_max.DTO.response;

import com.example.rep_max.entity.TipoTecnica;

import java.math.BigDecimal;

public record SerieExecutadaResponse(
        Long id,
        Long treinoId,
        Long exercicioId,
        String exercicioNome,
        Integer numeroSerie,
        Integer repeticoes,
        BigDecimal cargaKg,
        TipoTecnica tipoTecnica,
        Integer ordemExecucao
) {}
