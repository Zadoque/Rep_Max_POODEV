package com.example.rep_max.DTO.request;

import jakarta.validation.constraints.Size;

public record TreinoUpdateRequest(
        @Size(max = 255)
        String observacoes
) {
}
