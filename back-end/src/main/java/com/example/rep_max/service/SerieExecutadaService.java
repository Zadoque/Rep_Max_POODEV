package com.example.rep_max.service;

import com.example.rep_max.DTO.mapper.SerieExecutadaMapper;
import com.example.rep_max.DTO.request.SerieExecutadaRequest;
import com.example.rep_max.DTO.response.SerieExecutadaResponse;
import com.example.rep_max.entity.*;
import com.example.rep_max.exception.RegraNegocioException;
import com.example.rep_max.repository.ExercicioRepository;
import com.example.rep_max.repository.SerieExecutadaRepository;
import com.example.rep_max.repository.TreinoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SerieExecutadaService {

    private final SerieExecutadaRepository repository;
    private final TreinoRepository treinoRepository;
    private final ExercicioRepository exercicioRepository;
    private final SerieExecutadaMapper mapper;

    @Transactional
    public SerieExecutadaResponse create(
            Long treinoId,
            SerieExecutadaRequest request,
            String email
    ) {
        Treino treino = buscarTreino(treinoId, email);
        exigirEmAndamento(treino);

        Exercicio exercicio = buscarExercicio(request.exercicioId());

        SerieExecutada serie = mapper.toEntity(request);
        serie.setTreino(treino);
        serie.setExercicio(exercicio);
        serie.setTipoTecnica(TipoTecnica.NORMAL);

        SerieExecutada salva = repository.save(serie);

        return mapper.toResponse(salva);
    }

    @Transactional(readOnly = true)
    public List<SerieExecutadaResponse> findAll(
            Long treinoId,
            String email
    ) {
        buscarTreino(treinoId, email);

        return repository
                .findAllByTreino_IdAndTreino_Aluno_EmailIgnoreCaseOrderByOrdemExecucaoAsc(
                        treinoId, email
                )
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public SerieExecutadaResponse getById(
            Long treinoId,
            Long serieId,
            String email
    ) {
        SerieExecutada serie = buscarSerie(treinoId, serieId, email);
        return mapper.toResponse(serie);
    }

    @Transactional
    public SerieExecutadaResponse update(
            Long treinoId,
            Long serieId,
            SerieExecutadaRequest request,
            String email
    ) {
        SerieExecutada serie = buscarSerie(treinoId, serieId, email);
        exigirEmAndamento(serie.getTreino());

        Exercicio exercicio = buscarExercicio(request.exercicioId());

        mapper.updateEntity(request, serie);
        serie.setExercicio(exercicio);

        return mapper.toResponse(serie);
    }

    @Transactional
    public void delete(
            Long treinoId,
            Long serieId,
            String email
    ) {
        SerieExecutada serie = buscarSerie(treinoId, serieId, email);
        exigirEmAndamento(serie.getTreino());

        repository.delete(serie);
    }

    private Treino buscarTreino(Long treinoId, String email) {
        return treinoRepository
                .findByIdAndAluno_EmailIgnoreCase(treinoId, email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Treino não encontrado"
                ));
    }

    private SerieExecutada buscarSerie(
            Long treinoId,
            Long serieId,
            String email
    ) {
        return repository
                .findByIdAndTreino_IdAndTreino_Aluno_EmailIgnoreCase(
                        serieId, treinoId, email
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Série não encontrada"
                ));
    }

    private Exercicio buscarExercicio(Long exercicioId) {
        return exercicioRepository
                .findByIdAndAtivoTrue(exercicioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Exercício não encontrado ou inativo"
                ));
    }

    private void exigirEmAndamento(Treino treino) {
        if (treino.getStatus() != StatusTreino.EM_ANDAMENTO) {
            throw new RegraNegocioException("O treino precisa estar em andamento");
        }
    }
}
