package com.example.rep_max.DTO.request;

import com.example.rep_max.entity.GrupoMuscular;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ExercicioRequest(
        @NotBlank(message = "Nome é obrigatório")
        @Size(max = 255, message = "Nome deve ter no máximo 255 caracteres")
        String nome,

        @NotNull(message = "Grupo muscular é obrigatório")
        GrupoMuscular grupoMuscular,

        @Size(max = 255, message = "Descrição deve ter no máximo 255 caracteres")
        String descricao,

        @NotBlank(message = "Instruções de execução são obrigatórias")
        @Size(max = 255, message = "Instruções devem ter no máximo 255 caracteres")
        String instrucoesExecucao,

        @Size(max = 255, message = "URL da mídia deve ter no máximo 255 caracteres")
        String urlMidia
) {}
