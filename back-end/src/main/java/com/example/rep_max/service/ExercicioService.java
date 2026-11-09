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


    private final ExercicioRepository repository;
    private final ExercicioMapper mapper;

    @Transactional(readOnly = true)
    public List<ExercicioResponse> listAllAtivo() {
        return repository.findAllByAtivoTrue()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }


    @Transactional(readOnly = true)
    public ExercicioResponse findById(Long id) {
        return mapper.toResponse(buscarAtivo(id));
    }

    @Transactional
    public ExercicioResponse create(ExercicioRequest request) {
        Exercicio exercicio = mapper.toEntity(request);
        return mapper.toResponse(repository.save(exercicio));
    }

    @Transactional
    public ExercicioResponse update(Long id, ExercicioRequest request) {
        Exercicio exercicio = buscarAtivo(id);
        mapper.updateEntity(request, exercicio);
        return mapper.toResponse(exercicio);
    }

    @Transactional
    public void desativar(Long id) {
        Exercicio exercicio = buscarAtivo(id);
        exercicio.setAtivo(false);

    }

    private Exercicio buscarAtivo(Long id) {
        return repository.findByIdAndAtivoTrue(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Exercício não encontrado"
                ));
    }
}
