package com.example.rep_max.service;

import com.example.rep_max.DTO.mapper.ExercicioMapper;
import com.example.rep_max.DTO.request.ExercicioRequest;
import com.example.rep_max.DTO.response.ExercicioResponse;
import com.example.rep_max.entity.Exercicio;
import com.example.rep_max.repository.ExercicioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExercicioService {

    private final ExercicioRepository exercicioRepository;
    private final ExercicioMapper mapper;

    @Transactional(readOnly = true)
    public List<ExercicioResponse> listarAtivos() {
        return exercicioRepository.findAllByAtivoTrue()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ExercicioResponse buscarPorId(Long id) {
        return mapper.toResponse(buscarAtivo(id));
    }

    @Transactional
    public ExercicioResponse criar(ExercicioRequest request) {
        Exercicio exercicio = mapper.toEntity(request);
        exercicio.setAtivo(true);
        return mapper.toResponse(exercicioRepository.save(exercicio));
    }

    @Transactional
    public ExercicioResponse atualizar(Long id, ExercicioRequest request) {
        Exercicio exercicio = buscarAtivo(id);
        mapper.updateEntity(request, exercicio);
        return mapper.toResponse(exercicio);
    }

    @Transactional
    public void desativar(Long id) {
        Exercicio exercicio = exercicioRepository.findById(id)
                .orElseThrow(() -> naoEncontrado());
        exercicio.setAtivo(false);
    }

    private Exercicio buscarAtivo(Long id) {
        return exercicioRepository.findByIdAndAtivoTrue(id)
                .orElseThrow(() -> naoEncontrado());
    }

    private ResponseStatusException naoEncontrado() {
        return new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Exercício não encontrado"
        );
    }
}
