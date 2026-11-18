package com.example.rep_max.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.hibernate.exception.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private static final String EMAIL_UNIQUE_CONSTRAINT = "uk_usuarios_email_ignore_case";
    private static final String OPEN_WORKOUT_UNIQUE_CONSTRAINT = "uk_treinos_aluno_aberto";

    @ExceptionHandler(RegraNegocioException.class)
    public ResponseEntity<ErroResponse> tratarRegraNegocio(
            RegraNegocioException exception, HttpServletRequest request) {
        return resposta(HttpStatus.CONFLICT, "REGRA_NEGOCIO", exception.getMessage(),
                request, Map.of());
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErroResponse> tratarResponseStatus(
            ResponseStatusException exception, HttpServletRequest request) {
        HttpStatus status = HttpStatus.valueOf(exception.getStatusCode().value());
        String code = switch (status) {
            case BAD_REQUEST -> "REQUISICAO_INVALIDA";
            case NOT_FOUND -> "RECURSO_NAO_ENCONTRADO";
            case CONFLICT -> "CONFLITO";
            default -> "ERRO_HTTP";
        };
        return resposta(status, code, exception.getReason(), request, Map.of());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponse> tratarValidacao(
            MethodArgumentNotValidException exception, HttpServletRequest request) {
        Map<String, String> fieldErrors = exception.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(FieldError::getField, this::mensagemDoCampo,
                        (first, second) -> first, LinkedHashMap::new));
        return resposta(HttpStatus.BAD_REQUEST, "VALIDACAO_INVALIDA",
                "Um ou mais campos são inválidos.", request, fieldErrors);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErroResponse> tratarJsonInvalido(
            HttpMessageNotReadableException exception, HttpServletRequest request) {
        return resposta(HttpStatus.BAD_REQUEST, "JSON_INVALIDO",
                "O corpo da requisição é inválido.", request, Map.of());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErroResponse> tratarIntegridade(
            DataIntegrityViolationException exception, HttpServletRequest request
    ) {
        String constraintName = constraintName(exception);

        if (OPEN_WORKOUT_UNIQUE_CONSTRAINT.equals(constraintName)) {
            log.info("Criação de treino rejeitada pela restrição de treino aberto");
            return resposta(HttpStatus.CONFLICT, "TREINO_ABERTO_EXISTENTE",
                    "Você já possui um treino em andamento ou pausado.", request, Map.of());
        }

        if (EMAIL_UNIQUE_CONSTRAINT.equals(constraintName)) {
            return resposta(HttpStatus.CONFLICT, "CONFLITO_DADOS",
                    "Email já cadastrado", request, Map.of());
        }

        log.error("Violação de integridade não reconhecida ao processar {} {}",
                request.getMethod(), request.getRequestURI(), exception);
        return resposta(HttpStatus.INTERNAL_SERVER_ERROR, "ERRO_INTERNO",
                "Ocorreu um erro interno no servidor.", request, Map.of());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResponse> tratarErroInesperado(
            Exception exception, HttpServletRequest request) {
        log.error("Erro inesperado ao processar {} {}", request.getMethod(), request.getRequestURI(), exception);
        return resposta(HttpStatus.INTERNAL_SERVER_ERROR, "ERRO_INTERNO",
                "Ocorreu um erro interno no servidor.", request, Map.of());
    }

    private String mensagemDoCampo(FieldError error) {
        return error.getDefaultMessage() == null ? "Valor inválido." : error.getDefaultMessage();
    }

    private String constraintName(Throwable exception) {
        Throwable cause = exception;
        while (cause != null) {
            if (cause instanceof ConstraintViolationException violation
                    && violation.getConstraintName() != null) {
                return violation.getConstraintName();
            }
            cause = cause.getCause();
        }
        return null;
    }

    private ResponseEntity<ErroResponse> resposta(
            HttpStatus status, String code, String message, HttpServletRequest request,
            Map<String, String> fieldErrors) {
        ErroResponse body = new ErroResponse(Instant.now(), status.value(), code,
                message == null ? status.getReasonPhrase() : message,
                request.getRequestURI(), fieldErrors.isEmpty() ? null : fieldErrors);
        return ResponseEntity.status(status).body(body);
    }
}
