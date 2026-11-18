package com.example.rep_max.repository;

import com.example.rep_max.entity.StatusTreino;
import com.example.rep_max.entity.TipoPerfil;
import com.example.rep_max.entity.Treino;
import com.example.rep_max.entity.Usuario;
import com.example.rep_max.integration.PostgresIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@Transactional
class TreinoRepositoryIntegrationTest extends PostgresIntegrationTest {

    private static final List<StatusTreino> OPEN_STATUSES =
            List.of(StatusTreino.EM_ANDAMENTO, StatusTreino.PAUSADO);

    @Autowired
    private TreinoRepository treinoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    void returnsFalseWhenStudentHasNoWorkouts() {
        Usuario aluno = persistStudent("sem-treino@example.com");

        assertFalse(hasOpenWorkout(aluno));
    }

    @Test
    void returnsTrueWhenStudentHasWorkoutInProgress() {
        Usuario aluno = persistStudent("andamento@example.com");
        persistWorkout(aluno, StatusTreino.EM_ANDAMENTO, 1);

        assertTrue(hasOpenWorkout(aluno));
    }

    @Test
    void returnsTrueWhenStudentHasPausedWorkout() {
        Usuario aluno = persistStudent("pausado@example.com");
        persistWorkout(aluno, StatusTreino.PAUSADO, 1);

        assertTrue(hasOpenWorkout(aluno));
    }

    @Test
    void returnsFalseWhenStudentHasOnlyFinishedWorkouts() {
        Usuario aluno = persistStudent("finalizados@example.com");
        persistWorkout(aluno, StatusTreino.FINALIZADO, 1);
        persistWorkout(aluno, StatusTreino.FINALIZADO, 2);

        assertFalse(hasOpenWorkout(aluno));
    }

    @Test
    void ignoresOpenWorkoutOwnedByAnotherStudent() {
        Usuario aluno = persistStudent("consultado@example.com");
        Usuario outroAluno = persistStudent("outro@example.com");
        persistWorkout(outroAluno, StatusTreino.EM_ANDAMENTO, 1);

        assertFalse(hasOpenWorkout(aluno));
    }

    @Test
    void returnsTrueWhenStudentHasFinishedAndPausedWorkouts() {
        Usuario aluno = persistStudent("misto@example.com");
        persistWorkout(aluno, StatusTreino.FINALIZADO, 1);
        persistWorkout(aluno, StatusTreino.FINALIZADO, 2);
        persistWorkout(aluno, StatusTreino.PAUSADO, 3);

        assertTrue(hasOpenWorkout(aluno));
    }

    private boolean hasOpenWorkout(Usuario aluno) {
        return treinoRepository.existsByAluno_IdAndStatusIn(aluno.getId(), OPEN_STATUSES);
    }

    private Usuario persistStudent(String email) {
        Usuario aluno = new Usuario();
        aluno.setNome("Aluno");
        aluno.setEmail(email);
        aluno.setSenhaHash("hash");
        aluno.setPerfil(TipoPerfil.ALUNO);
        return usuarioRepository.saveAndFlush(aluno);
    }

    private void persistWorkout(Usuario aluno, StatusTreino status, int hoursAgo) {
        Treino treino = new Treino();
        treino.setAluno(aluno);
        treino.setInicio(LocalDateTime.now().minusHours(hoursAgo));
        treino.setStatus(status);
        if (status == StatusTreino.FINALIZADO) {
            treino.setFim(treino.getInicio().plusMinutes(30));
        }
        treinoRepository.saveAndFlush(treino);
    }
}
