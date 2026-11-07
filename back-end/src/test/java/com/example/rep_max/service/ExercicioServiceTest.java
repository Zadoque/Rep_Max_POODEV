package com.example.rep_max.service;

import com.example.rep_max.DTO.mapper.ExercicioMapper;
import com.example.rep_max.DTO.request.ExercicioRequest;
import com.example.rep_max.DTO.response.ExercicioResponse;
import com.example.rep_max.entity.Exercicio;
import com.example.rep_max.entity.GrupoMuscular;
import com.example.rep_max.repository.ExercicioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExercicioServiceTest {

    @Mock
    ExercicioRepository exercicioRepository;

    @Mock
    ExercicioMapper mapper;

    @InjectMocks
    ExercicioService service;

    private ExercicioRequest request() {
        return new ExercicioRequest(
                "Supino reto", GrupoMuscular.PEITO,
                null, "Deitar no banco e empurrar a barra", null
        );
    }

    @Test
    void criarSempreAtivaNovoExercicio() {
        ExercicioRequest request = request();
        Exercicio exercicio = new Exercicio();
        exercicio.setAtivo(false);
        ExercicioResponse resposta = new ExercicioResponse(
                1L, "Supino reto", GrupoMuscular.PEITO,
                null, "Deitar no banco e empurrar a barra", null, true
        );

        when(mapper.toEntity(request)).thenReturn(exercicio);
        when(exercicioRepository.save(exercicio)).thenReturn(exercicio);
        when(mapper.toResponse(exercicio)).thenReturn(resposta);

        assertEquals(resposta, service.criar(request));
        assertTrue(exercicio.isAtivo());
        verify(exercicioRepository).save(exercicio);
    }

    @Test
    void listarConsultaApenasAtivos() {
        when(exercicioRepository.findAllByAtivoTrue()).thenReturn(List.of());
        assertTrue(service.listarAtivos().isEmpty());
        verify(exercicioRepository).findAllByAtivoTrue();
        verify(exercicioRepository, never()).findAll();
    }

    @Test
    void buscarInativoRetorna404() {
        when(exercicioRepository.findByIdAndAtivoTrue(10L))
                .thenReturn(Optional.empty());

        ResponseStatusException erro = assertThrows(
                ResponseStatusException.class,
                () -> service.buscarPorId(10L)
        );
        assertEquals(HttpStatus.NOT_FOUND, erro.getStatusCode());
    }

    @Test
    void atualizarExercicioExistente() {
        ExercicioRequest request = request();
        Exercicio exercicio = new Exercicio();
        exercicio.setAtivo(true);
        when(exercicioRepository.findByIdAndAtivoTrue(1L))
                .thenReturn(Optional.of(exercicio));

        service.atualizar(1L, request);

        verify(mapper).updateEntity(request, exercicio);
        assertTrue(exercicio.isAtivo());
    }

    @Test
    void desativarPreservaRegistro() {
        Exercicio exercicio = new Exercicio();
        exercicio.setAtivo(true);
        when(exercicioRepository.findById(1L))
                .thenReturn(Optional.of(exercicio));

        service.desativar(1L);

        assertFalse(exercicio.isAtivo());
        verify(exercicioRepository, never()).delete(any(Exercicio.class));
    }

    @Test
    void desativarInexistenteRetorna404() {
        when(exercicioRepository.findById(10L))
                .thenReturn(Optional.empty());

        ResponseStatusException erro = assertThrows(
                ResponseStatusException.class,
                () -> service.desativar(10L)
        );
        assertEquals(HttpStatus.NOT_FOUND, erro.getStatusCode());
    }
}
