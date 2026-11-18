package com.example.rep_max.integration;

import com.example.rep_max.DTO.request.TreinoRequest;
import com.example.rep_max.entity.RotinaTreino;
import com.example.rep_max.entity.StatusTreino;
import com.example.rep_max.entity.TipoPerfil;
import com.example.rep_max.entity.Usuario;
import com.example.rep_max.exception.RegraNegocioException;
import com.example.rep_max.repository.RotinaTreinoRepository;
import com.example.rep_max.repository.TreinoRepository;
import com.example.rep_max.repository.UsuarioRepository;
import com.example.rep_max.service.TreinoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class TreinoServiceConcurrencyIntegrationTest extends PostgresIntegrationTest {

    private static final String EMAIL = "concorrente@example.com";

    @Autowired private TreinoService treinoService;
    @Autowired private TreinoRepository treinoRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private RotinaTreinoRepository rotinaTreinoRepository;
    @Autowired private JdbcTemplate jdbcTemplate;

    private Long rotinaId;

    @BeforeEach
    void setUpFixture() {
        jdbcTemplate.update("DELETE FROM series_executadas");
        jdbcTemplate.update("DELETE FROM treinos");
        jdbcTemplate.update("DELETE FROM itens_rotina");
        jdbcTemplate.update("DELETE FROM rotinas_treino");
        jdbcTemplate.update("DELETE FROM usuarios");

        Usuario aluno = new Usuario();
        aluno.setNome("Aluno concorrente");
        aluno.setEmail(EMAIL);
        aluno.setSenhaHash("hash");
        aluno.setPerfil(TipoPerfil.ALUNO);
        aluno = usuarioRepository.saveAndFlush(aluno);

        RotinaTreino rotina = new RotinaTreino();
        rotina.setAluno(aluno);
        rotina.setNome("Rotina concorrente");
        rotina.setAtiva(true);
        rotinaId = rotinaTreinoRepository.saveAndFlush(rotina).getId();
    }

    @Test
    @Timeout(20)
    void confirmsExactlyOneOfTwoConcurrentCreationsForSameStudent() throws Exception {
        CountDownLatch ready = new CountDownLatch(2);
        CountDownLatch start = new CountDownLatch(1);

        try (ExecutorService executor = Executors.newFixedThreadPool(2)) {
            Future<Attempt> first = executor.submit(() -> attemptCreation(ready, start));
            Future<Attempt> second = executor.submit(() -> attemptCreation(ready, start));

            assertTrue(ready.await(5, TimeUnit.SECONDS), "As duas tarefas devem estar prontas");
            start.countDown();

            List<Attempt> attempts = List.of(
                    first.get(10, TimeUnit.SECONDS),
                    second.get(10, TimeUnit.SECONDS));

            assertEquals(1, attempts.stream().filter(Attempt::created).count());
            assertEquals(1, attempts.stream().filter(Attempt::rejected).count());
        }

        Long alunoId = usuarioRepository.findByEmailIgnoreCase(EMAIL).orElseThrow().getId();
        assertEquals(1, treinoRepository.findAll().stream()
                .filter(treino -> treino.getAluno().getId().equals(alunoId))
                .filter(treino -> treino.getStatus() == StatusTreino.EM_ANDAMENTO
                        || treino.getStatus() == StatusTreino.PAUSADO)
                .count());
    }

    private Attempt attemptCreation(CountDownLatch ready, CountDownLatch start) {
        ready.countDown();
        try {
            if (!start.await(5, TimeUnit.SECONDS)) {
                return new Attempt(false, new IllegalStateException("Timeout aguardando início"));
            }
            treinoService.create(EMAIL, new TreinoRequest(rotinaId, "concorrente"));
            return new Attempt(true, null);
        } catch (Exception exception) {
            return new Attempt(false, exception);
        }
    }

    private record Attempt(boolean created, Exception failure) {
        boolean rejected() {
            return !created && (hasCause(failure, RegraNegocioException.class)
                    || hasCause(failure, DataIntegrityViolationException.class));
        }

        private static boolean hasCause(Throwable throwable, Class<? extends Throwable> type) {
            while (throwable != null) {
                if (type.isInstance(throwable)) {
                    return true;
                }
                throwable = throwable.getCause();
            }
            return false;
        }
    }
}
