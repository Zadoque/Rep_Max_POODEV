package com.example.rep_max.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "exercicios")
public class Exercicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(name = "grupo_muscular", nullable = false)
    private GrupoMuscular grupoMuscular;

    private String descricao;

    @Column(name = "instrucoes_execucao", nullable = false)
    private String instrucoesExecucao;

    @Column(name = "url_midia")
    private String urlMidia;

    @Column(nullable = false)
    private boolean ativo;
}
