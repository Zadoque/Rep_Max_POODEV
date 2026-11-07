package com.example.rep_max.DTO.response;

import com.example.rep_max.entity.GrupoMuscular;

public record ExercicioResponse(
        Long id,
        String nome,
        GrupoMuscular grupoMuscular,
        String descricao,
        String instrucoesExecucao,
        String urlMidia,
        boolean ativo
) {}
