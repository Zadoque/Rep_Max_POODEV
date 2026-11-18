package com.example.rep_max.exception;

import java.time.Instant;
import java.util.Map;

public record ErroResponse(
        Instant timestamp,
        int status,
        String code,
        String message,
        String path,
        Map<String, String> fieldErrors
) {
}
