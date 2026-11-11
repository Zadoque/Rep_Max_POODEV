package com.example.rep_max.repository;

import com.example.rep_max.entity.RotinaTreino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RotinaTreinoRepository extends JpaRepository<RotinaTreino, Long> {

    List<RotinaTreino> findAllByAluno_EmailIgnoreCase(String email);
    
    Optional<RotinaTreino> findByIdAndAluno_EmailIgnoreCase(Long id, String email);

    List<RotinaTreino> findAllByAluno_EmailIgnoreCaseAndAtivaTrue(String email);
}
