package com.example.rep_max.integration;

import com.example.rep_max.entity.StatusTreino;
import com.example.rep_max.entity.TipoPerfil;
import com.example.rep_max.entity.Treino;
import com.example.rep_max.entity.Usuario;
import com.example.rep_max.repository.TreinoRepository;
import com.example.rep_max.repository.UsuarioRepository;
import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class OpenWorkoutIndexIntegrationTest extends PostgresIntegrationTest {

    @Autowired private TreinoRepository treinoRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private JdbcTemplate jdbcTemplate;
    @Autowired private PlatformTransactionManager transactionManager;

    private TransactionTemplate requiresNew;

    @BeforeEach
    void cleanDatabase() {
        jdbcTemplate.update("DELETE FROM series_executadas");
        jdbcTemplate.update("DELETE FROM treinos");
        jdbcTemplate.update("DELETE FROM itens_rotina");
        jdbcTemplate.update("DELETE FROM rotinas_treino");
        jdbcTemplate.update("DELETE FROM usuarios");
        requiresNew = new TransactionTemplate(transactionManager);
        requiresNew.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);
    }

    @Test
    void allowsSeveralFinishedWorkoutsForOneStudent() {
        Usuario aluno = persistStudent("varios-finalizados@example.com");

        persistWorkout(aluno.getId(), StatusTreino.FINALIZADO, 3);
        persistWorkout(aluno.getId(), StatusTreino.FINALIZADO, 2);
        persistWorkout(aluno.getId(), StatusTreino.FINALIZADO, 1);

        assertEquals(3, workoutsFor(aluno.getId()).size());
    }

    @Test
    void rejectsSecondInProgressWorkoutForSameStudent() {
        Usuario aluno = persistStudent("dois-andamento@example.com");
        persistWorkout(aluno.getId(), StatusTreino.EM_ANDAMENTO, 2);

        assertOpenWorkoutViolation(
                () -> persistWorkout(aluno.getId(), StatusTreino.EM_ANDAMENTO, 1));

        assertOnlyOpenWorkout(aluno.getId(), StatusTreino.EM_ANDAMENTO);
    }

    @Test
    void rejectsPausedWorkoutWhenStudentHasWorkoutInProgress() {
        Usuario aluno = persistStudent("andamento-pausado@example.com");
        persistWorkout(aluno.getId(), StatusTreino.EM_ANDAMENTO, 2);

        assertOpenWorkoutViolation(
                () -> persistWorkout(aluno.getId(), StatusTreino.PAUSADO, 1));

        assertOnlyOpenWorkout(aluno.getId(), StatusTreino.EM_ANDAMENTO);
    }

    @Test
    void rejectsSecondPausedWorkoutForSameStudent() {
        Usuario aluno = persistStudent("dois-pausados@example.com");
        persistWorkout(aluno.getId(), StatusTreino.PAUSADO, 2);

        assertOpenWorkoutViolation(
                () -> persistWorkout(aluno.getId(), StatusTreino.PAUSADO, 1));

        assertOnlyOpenWorkout(aluno.getId(), StatusTreino.PAUSADO);
    }

    @Test
    void allowsDifferentStudentsToHaveOpenWorkouts() {
        Usuario primeiro = persistStudent("primeiro@example.com");
        Usuario segundo = persistStudent("segundo@example.com");

        persistWorkout(primeiro.getId(), StatusTreino.EM_ANDAMENTO, 1);
        persistWorkout(segundo.getId(), StatusTreino.PAUSADO, 1);

        assertOnlyOpenWorkout(primeiro.getId(), StatusTreino.EM_ANDAMENTO);
        assertOnlyOpenWorkout(segundo.getId(), StatusTreino.PAUSADO);
    }

    @Test
    void allowsNewWorkoutAfterPreviousOneIsFinished() {
        Usuario aluno = persistStudent("finaliza-e-recomeca@example.com");
        Long firstId = persistWorkout(aluno.getId(), StatusTreino.EM_ANDAMENTO, 2);

        requiresNew.executeWithoutResult(status -> {
            Treino treino = treinoRepository.findById(firstId).orElseThrow();
            treino.setStatus(StatusTreino.FINALIZADO);
            treino.setFim(LocalDateTime.now().minusHours(1));
            treinoRepository.saveAndFlush(treino);
        });
        Long secondId = persistWorkout(aluno.getId(), StatusTreino.EM_ANDAMENTO, 0);

        List<Treino> persisted = workoutsFor(aluno.getId());
        assertEquals(2, persisted.size());
        assertEquals(StatusTreino.FINALIZADO, treinoRepository.findById(firstId).orElseThrow().getStatus());
        assertEquals(StatusTreino.EM_ANDAMENTO, treinoRepository.findById(secondId).orElseThrow().getStatus());
    }

    private Usuario persistStudent(String email) {
        return requiresNew.execute(status -> {
            Usuario aluno = new Usuario();
            aluno.setNome("Aluno");
            aluno.setEmail(email);
            aluno.setSenhaHash("hash");
            aluno.setPerfil(TipoPerfil.ALUNO);
            return usuarioRepository.saveAndFlush(aluno);
        });
    }

    private Long persistWorkout(Long alunoId, StatusTreino status, int hoursAgo) {
        return requiresNew.execute(transactionStatus -> {
            Treino treino = new Treino();
            treino.setAluno(usuarioRepository.getReferenceById(alunoId));
            treino.setInicio(LocalDateTime.now().minusHours(hoursAgo));
            treino.setStatus(status);
            if (status == StatusTreino.FINALIZADO) {
                treino.setFim(treino.getInicio().plusMinutes(30));
            }
            return treinoRepository.saveAndFlush(treino).getId();
        });
    }

    private List<Treino> workoutsFor(Long alunoId) {
        return treinoRepository.findAll().stream()
                .filter(treino -> treino.getAluno().getId().equals(alunoId))
                .toList();
    }

    private void assertOnlyOpenWorkout(Long alunoId, StatusTreino expectedStatus) {
        List<Treino> persisted = workoutsFor(alunoId);
        assertEquals(1, persisted.size());
        assertEquals(expectedStatus, persisted.getFirst().getStatus());
    }

    private void assertOpenWorkoutViolation(Executable insertion) {
        DataIntegrityViolationException exception =
                assertThrows(DataIntegrityViolationException.class, insertion);

        Throwable cause = exception;
        boolean expectedConstraintFound = false;
        while (cause != null) {
            if (cause instanceof ConstraintViolationException violation
                    && "uk_treinos_aluno_aberto".equals(violation.getConstraintName())) {
                expectedConstraintFound = true;
                break;
            }
            cause = cause.getCause();
        }
        assertTrue(expectedConstraintFound,
                "A exceção deve identificar o índice uk_treinos_aluno_aberto");
    }
}
