package com.example.rep_max.exception;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> tratarIntegridade(
            DataIntegrityViolationException exception
    ) {
        Throwable causa = exception;

        while (causa != null) {
            if (causa instanceof ConstraintViolationException violacao
                    && "uk_usuarios_email_ignore_case"
                    .equals(violacao.getConstraintName())) {

                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of(
                                "message",
                                "Email já cadastrado"
                        ));
            }

            causa = causa.getCause();
        }

        // Outras falhas de integridade não são necessariamente
        // conflitos de e-mail.
        throw exception;
    }
}