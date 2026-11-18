package com.example.rep_max.repository;


import com.example.rep_max.entity.ItemRotina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRotinaRepository extends JpaRepository<ItemRotina, Long> {

    List<ItemRotina> findAllByRotina_IdAndRotina_Aluno_EmailIgnoreCaseOrderByOrdemAsc(
            Long rotinaId,
            String email
    );

    Optional<ItemRotina> findByIdAndRotina_IdAndRotina_Aluno_EmailIgnoreCase(
            Long idItem,
            Long idRotina,
            String email
            );
}