package com.example.rep_max.repository;

import com.example.rep_max.entity.StatusTreino;
import com.example.rep_max.entity.Treino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TreinoRepository extends JpaRepository<Treino, Long> {

    List<Treino> findAllByAluno_EmailIgnoreCaseOrderByInicioDesc(String email);

    Optional<Treino> findByIdAndAluno_EmailIgnoreCase(Long id, String email);

    List<Treino> findAllByAluno_EmailIgnoreCaseAndStatus(StatusTreino statusTreino, String email);




}
