package com.example.rep_max.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.server.ResponseStatusException;

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

    private HttpServletRequest request() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setMethod("PATCH");
        request.setRequestURI("/treinos/1/pausar");
        return request;
    }
}
