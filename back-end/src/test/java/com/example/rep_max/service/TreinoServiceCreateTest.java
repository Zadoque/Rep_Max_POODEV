package com.example.rep_max.service;

import com.example.rep_max.DTO.mapper.TreinoMapper;
import com.example.rep_max.DTO.request.TreinoRequest;
import com.example.rep_max.DTO.response.TreinoResponse;
import com.example.rep_max.entity.RotinaTreino;
import com.example.rep_max.entity.StatusTreino;
import com.example.rep_max.entity.Treino;
import com.example.rep_max.entity.TipoPerfil;
import com.example.rep_max.entity.Usuario;
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
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.lenient;

@ExtendWith(MockitoExtension.class)
class TreinoServiceCreateTest {

    private static final String EMAIL = "aluno@example.com";
    private static final Long ALUNO_ID = 10L;
    private static final Long ROTINA_ID = 20L;
    private static final TreinoRequest REQUEST = new TreinoRequest(ROTINA_ID, "treino de teste");

    @Mock private TreinoMapper mapper;
    @Mock private TreinoRepository repository;
    @Mock private RotinaTreinoRepository rotinaRepository;
    @Mock private UsuarioRepository usuarioRepository;
    @Mock private SerieExecutadaRepository serieExecutadaRepository;

    private TreinoService service;
    private Usuario aluno;
    private RotinaTreino rotina;

    @BeforeEach
    void setUp() {
        service = new TreinoService(mapper, repository, rotinaRepository, usuarioRepository,
                serieExecutadaRepository);
        aluno = new Usuario();
        aluno.setId(ALUNO_ID);
        aluno.setEmail(EMAIL);
        aluno.setNome("Aluno");
        aluno.setSenhaHash("hash");
        aluno.setPerfil(TipoPerfil.ALUNO);
        rotina = new RotinaTreino();
        rotina.setId(ROTINA_ID);
        rotina.setAluno(aluno);
        rotina.setAtiva(true);
        rotina.setNome("Rotina A");
        when(usuarioRepository.findByEmailIgnoreCase(EMAIL)).thenReturn(Optional.of(aluno));
        lenient().when(rotinaRepository.findByIdAndAluno_EmailIgnoreCaseAndAtivaTrue(ROTINA_ID, EMAIL))
                .thenReturn(Optional.of(rotina));
    }

    @Test
    void createsFirstWorkoutAndInitializesOwnershipAndOpenStatus() {
        Treino mapped = new Treino();
        TreinoResponse response = new TreinoResponse(1L, ROTINA_ID, "Rotina A", null, null,
                StatusTreino.EM_ANDAMENTO, REQUEST.observacoes());
        when(repository.existsByAluno_IdAndStatusIn(ALUNO_ID,
                List.of(StatusTreino.EM_ANDAMENTO, StatusTreino.PAUSADO))).thenReturn(false);
        when(mapper.toEntity(REQUEST)).thenReturn(mapped);
        when(repository.save(mapped)).thenReturn(mapped);
        when(mapper.toResponse(mapped)).thenReturn(response);

        TreinoResponse result = service.create(EMAIL, REQUEST);

        assertSame(response, result);
        assertSame(aluno, mapped.getAluno());
        assertSame(rotina, mapped.getRotinaOrigem());
        assertEquals(StatusTreino.EM_ANDAMENTO, mapped.getStatus());
        verify(repository).existsByAluno_IdAndStatusIn(ALUNO_ID,
                List.of(StatusTreino.EM_ANDAMENTO, StatusTreino.PAUSADO));
        verify(repository).save(mapped);
    }

    @Test
    void rejectsWhenAnOpenWorkoutExistsAndDoesNotMapOrSave() {
        when(repository.existsByAluno_IdAndStatusIn(ALUNO_ID,
                List.of(StatusTreino.EM_ANDAMENTO, StatusTreino.PAUSADO))).thenReturn(true);

        RegraNegocioException exception = assertThrows(RegraNegocioException.class,
                () -> service.create(EMAIL, REQUEST));

        assertEquals("Você já possui um treino em andamento ou pausado.", exception.getMessage());
        verify(repository).existsByAluno_IdAndStatusIn(ALUNO_ID,
                List.of(StatusTreino.EM_ANDAMENTO, StatusTreino.PAUSADO));
        verify(mapper, never()).toEntity(any());
        verify(repository, never()).save(any());
    }

    @Test
    void rejectsMissingUserBeforeAccessingOtherCollaborators() {
        when(usuarioRepository.findByEmailIgnoreCase(EMAIL)).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> service.create(EMAIL, REQUEST));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        verifyNoInteractions(mapper, repository, rotinaRepository);
    }

    @Test
    void rejectsMissingOrOtherUsersRoutineBeforeCheckingOpenWorkouts() {
        when(rotinaRepository.findByIdAndAluno_EmailIgnoreCaseAndAtivaTrue(ROTINA_ID, EMAIL))
                .thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> service.create(EMAIL, REQUEST));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        verifyNoInteractions(mapper, repository);
    }
}
