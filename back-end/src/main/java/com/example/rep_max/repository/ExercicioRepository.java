package com.example.rep_max.repository;

import com.example.rep_max.entity.Exercicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExercicioRepository extends JpaRepository<Exercicio, Long> {

    List<Exercicio> findAllByAtivoTrue();

    Optional<Exercicio> findByIdAndAtivoTrue(Long id);


}
