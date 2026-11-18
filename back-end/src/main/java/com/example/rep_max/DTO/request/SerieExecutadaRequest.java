package com.example.rep_max.DTO.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record SerieExecutadaRequest(
        @NotNull @Positive Long exercicioId,

        @NotNull @Positive Integer numeroSerie,

        @NotNull @Positive Integer repeticoes,

        @NotNull @DecimalMin("0.0")
        @Digits(integer = 8, fraction = 2)
        BigDecimal cargaKg,

        @NotNull @Positive Integer ordemExecucao
) {}
