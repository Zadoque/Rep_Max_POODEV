package com.example.rep_max.controller;

import com.example.rep_max.DTO.request.TreinoRequest;
import com.example.rep_max.DTO.response.TreinoResponse;
import com.example.rep_max.entity.StatusTreino;
import com.example.rep_max.exception.GlobalExceptionHandler;
import com.example.rep_max.exception.RegraNegocioException;
import com.example.rep_max.service.TreinoService;
import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import java.sql.SQLException;
import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TreinoController.class)
@ContextConfiguration(classes = {TreinoController.class, GlobalExceptionHandler.class})
class TreinoControllerTest {

    private static final String EMAIL = "aluno@example.com";
    private static final String VALID_REQUEST = """
            {"rotinaOrigemId": 20, "observacoes": "Treino A"}
            """;

    @Autowired private MockMvc mockMvc;

    @MockitoBean private TreinoService treinoService;

    @Test
    void validCreationReturnsCreated() throws Exception {
        when(treinoService.create(eq(EMAIL), any(TreinoRequest.class)))
                .thenReturn(response());

        performAuthenticated(VALID_REQUEST)
                .andExpect(status().isCreated())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.status").value("EM_ANDAMENTO"));
    }

    @Test
    void workoutInProgressReturnsConflict() throws Exception {
        assertOpenWorkoutConflict("Você já possui um treino em andamento ou pausado.");
    }

    @Test
    void pausedWorkoutReturnsConflict() throws Exception {
        assertOpenWorkoutConflict("Você já possui um treino em andamento ou pausado.");
    }

    @Test
    void onlyFinishedWorkoutsAllowCreation() throws Exception {
        when(treinoService.create(eq(EMAIL), any(TreinoRequest.class)))
                .thenReturn(response());

        performAuthenticated(VALID_REQUEST).andExpect(status().isCreated());
    }

    @Test
    void unauthenticatedUserIsRejected() throws Exception {
        mockMvc.perform(post("/treinos")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_REQUEST))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void deleteEmptyWorkoutReturnsNoContent() throws Exception {
        mockMvc.perform(delete("/treinos/10").with(user(EMAIL).roles("ALUNO")).with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteWorkoutWithSeriesReturnsConflictInErrorResponseFormat() throws Exception {
        doThrow(new RegraNegocioException(
                "Não é possível excluir um treino que possui séries executadas."
        ))
                .when(treinoService)
                .delete(eq(10L), eq(EMAIL));

        mockMvc.perform(delete("/treinos/10")
                        .with(user(EMAIL).roles("ALUNO"))
                        .with(csrf()))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("REGRA_NEGOCIO"))
                .andExpect(jsonPath("$.message")
                        .value("Não é possível excluir um treino que possui séries executadas."))
                .andExpect(jsonPath("$.path").value("/treinos/10"));
    }

    @Test
    void deleteMissingOrOtherUsersWorkoutReturnsNotFound() throws Exception {
        doThrow(new ResponseStatusException(NOT_FOUND, "Treino não encontrado"))
                .when(treinoService)
                .delete(eq(10L), eq(EMAIL));

        mockMvc.perform(delete("/treinos/10")
                        .with(user(EMAIL).roles("ALUNO"))
                        .with(csrf()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("RECURSO_NAO_ENCONTRADO"));
    }

    @Test
    void deleteWithoutCsrfReturnsForbidden() throws Exception {
        mockMvc.perform(delete("/treinos/10").with(user(EMAIL).roles("ALUNO")))
                .andExpect(status().isForbidden());
    }

    @Test
    void invalidDtoReturnsBadRequestInErrorResponseFormat() throws Exception {
        performAuthenticated("{\"rotinaOrigemId\": 0}")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.code").value("VALIDACAO_INVALIDA"))
                .andExpect(jsonPath("$.message").value("Um ou mais campos são inválidos."))
                .andExpect(jsonPath("$.path").value("/treinos"))
                .andExpect(jsonPath("$.fieldErrors.rotinaOrigemId").exists());
    }

    @Test
    void missingResourceReturnsNotFound() throws Exception {
        when(treinoService.create(eq(EMAIL), any(TreinoRequest.class)))
                .thenThrow(new ResponseStatusException(NOT_FOUND, "Rotina não encontrada"));

        performAuthenticated(VALID_REQUEST)
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.code").value("RECURSO_NAO_ENCONTRADO"))
                .andExpect(jsonPath("$.message").value("Rotina não encontrada"));
    }

    @Test
    void openWorkoutDatabaseConstraintReturnsConflict() throws Exception {
        when(treinoService.create(eq(EMAIL), any(TreinoRequest.class)))
                .thenThrow(integrityViolation("uk_treinos_aluno_aberto"));

        performAuthenticated(VALID_REQUEST)
                .andExpect(status().isConflict())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.code").value("TREINO_ABERTO_EXISTENTE"))
                .andExpect(jsonPath("$.message")
                        .value("Você já possui um treino em andamento ou pausado."))
                .andExpect(jsonPath("$.path").value("/treinos"));
    }

    @Test
    void emailDatabaseConstraintKeepsExistingConflictResponse() throws Exception {
        when(treinoService.create(eq(EMAIL), any(TreinoRequest.class)))
                .thenThrow(integrityViolation("uk_usuarios_email_ignore_case"));

        performAuthenticated(VALID_REQUEST)
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.code").value("CONFLITO_DADOS"))
                .andExpect(jsonPath("$.message").value("Email já cadastrado"));
    }

    @Test
    void unknownIntegrityViolationReturnsSanitizedInternalError() throws Exception {
        when(treinoService.create(eq(EMAIL), any(TreinoRequest.class)))
                .thenThrow(integrityViolation("uk_desconhecida"));

        performAuthenticated(VALID_REQUEST)
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.code").value("ERRO_INTERNO"))
                .andExpect(jsonPath("$.message").value("Ocorreu um erro interno no servidor."));
    }

    @Test
    void unexpectedErrorReturnsSanitizedInternalError() throws Exception {
        when(treinoService.create(eq(EMAIL), any(TreinoRequest.class)))
                .thenThrow(new IllegalStateException("SQL password=secret"));

        performAuthenticated(VALID_REQUEST)
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.status").value(500))
                .andExpect(jsonPath("$.code").value("ERRO_INTERNO"))
                .andExpect(jsonPath("$.message").value("Ocorreu um erro interno no servidor."));
    }

    private org.springframework.test.web.servlet.ResultActions performAuthenticated(String body)
            throws Exception {
        return mockMvc.perform(post("/treinos")
                .with(user(EMAIL).roles("ALUNO"))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(body));
    }

    private void assertOpenWorkoutConflict(String message) throws Exception {
        when(treinoService.create(eq(EMAIL), any(TreinoRequest.class)))
                .thenThrow(new RegraNegocioException(message));

        performAuthenticated(VALID_REQUEST)
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.code").value("REGRA_NEGOCIO"))
                .andExpect(jsonPath("$.message").value(message))
                .andExpect(jsonPath("$.path").value("/treinos"));
    }

    private TreinoResponse response() {
        return new TreinoResponse(1L, 20L, "Rotina A", LocalDateTime.now(), null,
                StatusTreino.EM_ANDAMENTO, "Treino A");
    }

    private DataIntegrityViolationException integrityViolation(String constraintName) {
        return new DataIntegrityViolationException("write failed",
                new ConstraintViolationException("constraint violation",
                        new SQLException("database detail"), constraintName));
    }
}
