package com.example.rep_max.service;

import com.example.rep_max.DTO.mapper.TreinoMapper;
import com.example.rep_max.entity.StatusTreino;
import com.example.rep_max.entity.Treino;
import com.example.rep_max.exception.RegraNegocioException;
import com.example.rep_max.repository.RotinaTreinoRepository;
import com.example.rep_max.repository.SerieExecutadaRepository;
import com.example.rep_max.repository.TreinoRepository;
import com.example.rep_max.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TreinoServiceLifecycleTest {

    private static final String OWNER = "aluno@example.com";
    private static final Long ID = 10L;

    @Mock private TreinoMapper mapper;
    @Mock private TreinoRepository repository;
    @Mock private RotinaTreinoRepository rotinaTreinoRepository;
    @Mock private UsuarioRepository usuarioRepository;
    @Mock private SerieExecutadaRepository serieExecutadaRepository;

    private TreinoService service;

    @BeforeEach
    void setUp() {
        service = new TreinoService(mapper, repository, rotinaTreinoRepository, usuarioRepository,
                serieExecutadaRepository);
    }

    @Test
    void deleteAllowsWorkoutWithoutExecutedSeriesRegardlessOfStatus() {
        for (StatusTreino status : StatusTreino.values()) {
            Treino treino = treino(status, LocalDateTime.now(), null);
            givenWorkout(treino);
            when(serieExecutadaRepository.existsByTreino_Id(ID)).thenReturn(false);

            service.delete(ID, OWNER);

            verify(repository).delete(treino);
        }
        verify(serieExecutadaRepository, times(StatusTreino.values().length))
                .existsByTreino_Id(ID);
    }

    @Test
    void deleteRejectsWorkoutWithExecutedSeries() {
        Treino treino = treino(StatusTreino.FINALIZADO, LocalDateTime.now(), LocalDateTime.now());
        givenWorkout(treino);
        when(serieExecutadaRepository.existsByTreino_Id(ID)).thenReturn(true);

        assertThrows(RegraNegocioException.class, () -> service.delete(ID, OWNER));

        verify(serieExecutadaRepository).existsByTreino_Id(ID);
        verify(repository, never()).delete(treino);
    }

    @Test
    void deleteRejectsMissingOrOtherUsersWorkoutBeforeCheckingSeries() {
        when(repository.findByIdAndAluno_EmailIgnoreCase(ID, OWNER)).thenReturn(Optional.empty());

        assertThrows(Exception.class, () -> service.delete(ID, OWNER));

        verifyNoInteractions(serieExecutadaRepository);
        verify(repository, never()).delete(org.mockito.ArgumentMatchers.any(Treino.class));
    }

    @Test
    void pauseChangesOnlyStatusOfInProgressWorkout() {
        LocalDateTime start = LocalDateTime.of(2026, 1, 1, 8, 0);
        Treino treino = treino(StatusTreino.EM_ANDAMENTO, start, null);
        givenWorkout(treino);

        service.pause(ID, OWNER);

        assertEquals(StatusTreino.PAUSADO, treino.getStatus());
        assertEquals(start, treino.getInicio());
        assertEquals(null, treino.getFim());
    }

    @Test
    void resumeChangesOnlyStatusOfPausedWorkout() {
        LocalDateTime start = LocalDateTime.of(2026, 1, 1, 8, 0);
        Treino treino = treino(StatusTreino.PAUSADO, start, null);
        givenWorkout(treino);

        service.resume(ID, OWNER);

        assertEquals(StatusTreino.EM_ANDAMENTO, treino.getStatus());
        assertEquals(start, treino.getInicio());
        assertEquals(null, treino.getFim());
    }

    @Test
    void finishInProgressWorkoutSetsFinishTimeAndPreservesStart() {
        LocalDateTime start = LocalDateTime.of(2026, 1, 1, 8, 0);
        Treino treino = treino(StatusTreino.EM_ANDAMENTO, start, null);
        givenWorkout(treino);

        service.finish(ID, OWNER);

        assertEquals(StatusTreino.FINALIZADO, treino.getStatus());
        assertEquals(start, treino.getInicio());
        assertNotNull(treino.getFim());
        assertEquals(false, treino.getFim().isBefore(start));
    }

    @Test
    void finishPausedWorkoutSetsFinishTime() {
        Treino treino = treino(StatusTreino.PAUSADO, LocalDateTime.now().minusHours(1), null);
        givenWorkout(treino);

        service.finish(ID, OWNER);

        assertEquals(StatusTreino.FINALIZADO, treino.getStatus());
        assertNotNull(treino.getFim());
    }

    @Test
    void invalidTransitionsPreserveWorkoutState() {
        for (StatusTreino status : StatusTreino.values()) {
            Treino pauseCandidate = treino(status, LocalDateTime.now(), null);
            givenWorkout(pauseCandidate);
            if (status != StatusTreino.EM_ANDAMENTO) {
                assertThrows(RegraNegocioException.class, () -> service.pause(ID, OWNER));
                assertEquals(status, pauseCandidate.getStatus());
                assertEquals(null, pauseCandidate.getFim());
            }

            Treino resumeCandidate = treino(status, LocalDateTime.now(), null);
            givenWorkout(resumeCandidate);
            if (status != StatusTreino.PAUSADO) {
                assertThrows(RegraNegocioException.class, () -> service.resume(ID, OWNER));
                assertEquals(status, resumeCandidate.getStatus());
                assertEquals(null, resumeCandidate.getFim());
            }

            Treino finishCandidate = treino(status, LocalDateTime.now(), null);
            givenWorkout(finishCandidate);
            if (status == StatusTreino.FINALIZADO) {
                assertThrows(RegraNegocioException.class, () -> service.finish(ID, OWNER));
                assertEquals(status, finishCandidate.getStatus());
                assertEquals(null, finishCandidate.getFim());
            }
        }
    }

    @Test
    void missingOrOtherUsersWorkoutIsNotChanged() {
        when(repository.findByIdAndAluno_EmailIgnoreCase(ID, OWNER)).thenReturn(Optional.empty());

        assertThrows(Exception.class, () -> service.pause(ID, OWNER));
        assertThrows(Exception.class, () -> service.resume(ID, OWNER));
        assertThrows(Exception.class, () -> service.finish(ID, OWNER));
        verifyNoInteractions(mapper);
    }

    private void givenWorkout(Treino treino) {
        when(repository.findByIdAndAluno_EmailIgnoreCase(ID, OWNER)).thenReturn(Optional.of(treino));
    }

    private Treino treino(StatusTreino status, LocalDateTime inicio, LocalDateTime fim) {
        Treino treino = new Treino();
        treino.setStatus(status);
        treino.setInicio(inicio);
        treino.setFim(fim);
        return treino;
    }
}
