package com.example.rep_max.DTO.response;

import com.example.rep_max.entity.StatusTreino;

import java.time.LocalDateTime;


public record TreinoResponse(
        Long id,
        Long rotinaOrigemId,
        LocalDateTime inicio,
        LocalDateTime fim,
        StatusTreino status,
        String observacoes
) {
}
