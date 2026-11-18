package com.example.rep_max.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.server.ResponseStatusException;

import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void businessRuleReturnsStableConflictPayload() {
        ErroResponse body = handler.tratarRegraNegocio(
                new RegraNegocioException("Estado inválido"), request()).getBody();

        assertNotNull(body);
        assertEquals(409, body.status());
        assertEquals("REGRA_NEGOCIO", body.code());
        assertEquals("Estado inválido", body.message());
        assertEquals("/treinos/1/pausar", body.path());
    }

    @Test
    void responseStatusExceptionReturnsNotFoundPayload() {
        ErroResponse body = handler.tratarResponseStatus(
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Treino não encontrado"), request()).getBody();

        assertNotNull(body);
        assertEquals(404, body.status());
        assertEquals("RECURSO_NAO_ENCONTRADO", body.code());
        assertEquals("Treino não encontrado", body.message());
    }

    @Test
    void unexpectedExceptionDoesNotExposeInternalDetails() {
        ErroResponse body = handler.tratarErroInesperado(
                new IllegalStateException("SQL password=secret"), request()).getBody();

        assertNotNull(body);
        assertEquals(500, body.status());
        assertEquals("ERRO_INTERNO", body.code());
        assertEquals("Ocorreu um erro interno no servidor.", body.message());
    }

    @Test
    void openWorkoutConstraintReturnsSpecificConflictPayload() {
        ErroResponse body = handler.tratarIntegridade(
                integrityViolation("uk_treinos_aluno_aberto"), request()).getBody();

        assertNotNull(body);
        assertEquals(409, body.status());
        assertEquals("TREINO_ABERTO_EXISTENTE", body.code());
        assertEquals("Você já possui um treino em andamento ou pausado.", body.message());
    }

    @Test
    void emailConstraintKeepsExistingConflictPayload() {
        ErroResponse body = handler.tratarIntegridade(
                integrityViolation("uk_usuarios_email_ignore_case"), request()).getBody();

        assertNotNull(body);
        assertEquals(409, body.status());
        assertEquals("CONFLITO_DADOS", body.code());
        assertEquals("Email já cadastrado", body.message());
    }

    @Test
    void unknownIntegrityViolationIsNotReportedAsOpenWorkoutConflict() {
        ErroResponse body = handler.tratarIntegridade(
                integrityViolation("uk_outra_restricao"), request()).getBody();

        assertNotNull(body);
        assertEquals(500, body.status());
        assertEquals("ERRO_INTERNO", body.code());
        assertEquals("Ocorreu um erro interno no servidor.", body.message());
    }

    private DataIntegrityViolationException integrityViolation(String constraintName) {
        ConstraintViolationException hibernateException = new ConstraintViolationException(
                "constraint violation", new SQLException("database detail"), constraintName);
        return new DataIntegrityViolationException("write failed", hibernateException);
    }

    private HttpServletRequest request() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setMethod("PATCH");
        request.setRequestURI("/treinos/1/pausar");
        return request;
    }
}
