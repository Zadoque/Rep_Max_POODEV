package com.example.rep_max.service;

import com.example.rep_max.DTO.mapper.ItemRotinaMapper;
import com.example.rep_max.DTO.request.ItemRotinaRequest;
import com.example.rep_max.DTO.response.ItemRotinaResponse;
import com.example.rep_max.entity.Exercicio;
import com.example.rep_max.entity.ItemRotina;
import com.example.rep_max.entity.RotinaTreino;
import com.example.rep_max.repository.ExercicioRepository;
import com.example.rep_max.repository.ItemRotinaRepository;
import com.example.rep_max.repository.RotinaTreinoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ItemRotinaTreinoService {

    private final ItemRotinaRepository repository;
    private final ItemRotinaMapper mapper;
    private final RotinaTreinoRepository rotinaTreinoRepository;
    private final ExercicioRepository exercicioRepository;


    @Transactional
    public ItemRotinaResponse create(ItemRotinaRequest request, String email, Long rotinaId) {
        RotinaTreino rotinaTreino = rotinaTreinoRepository.
                findByIdAndAluno_EmailIgnoreCaseAndAtivaTrue(rotinaId, email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Rotina não encontrada"));


        Exercicio exercicio = exercicioRepository.findByIdAndAtivoTrue(request.exercicioId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Exercicio não encontrado ou n'ao ativo"));


        ItemRotina itemRotina = mapper.toEntity(request);
        itemRotina.setRotina(rotinaTreino);
        itemRotina.setExercicio(exercicio);

        repository.save(itemRotina);
        return  mapper.toResponse(itemRotina);
    }

}
