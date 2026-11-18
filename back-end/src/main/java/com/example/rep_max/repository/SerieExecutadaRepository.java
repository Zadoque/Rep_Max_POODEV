package com.example.rep_max.repository;

import com.example.rep_max.entity.SerieExecutada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SerieExecutadaRepository extends JpaRepository<SerieExecutada, Long> {

    List<SerieExecutada>
    findAllByTreino_IdAndTreino_Aluno_EmailIgnoreCaseOrderByOrdemExecucaoAsc(
            Long treinoId,
            String email
    );

    Optional<SerieExecutada>
    findByIdAndTreino_IdAndTreino_Aluno_EmailIgnoreCase(
            Long serieId,
            Long treinoId,
            String email
    );
}