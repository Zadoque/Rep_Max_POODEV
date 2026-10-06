package com.example.rep_max.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
        name = "series_executadas",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_serie_treino_ordem_execucao",
                columnNames = {"treino_id", "ordem_execucao"}
        )
)
public class SerieExecutada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "treino_id", nullable = false)
    private Treino treino;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "exercicio_id", nullable = false)
    private Exercicio exercicio;

    @Column(name = "numero_serie", nullable = false)
    private Integer numeroSerie;

    @Column(nullable = false)
    private Integer repeticoes;

    @Column(name = "carga_kg", nullable = false, precision = 10, scale = 2)
    private BigDecimal cargaKg;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_tecnica", nullable = false)
    private TipoTecnica tipoTecnica;

    @Column(name = "grupo_sequencia")
    private Integer grupoSequencia;

    @Column(name = "ordem_execucao", nullable = false)
    private Integer ordemExecucao;

    @Column(name = "etapa_drop")
    private Integer etapaDrop;
}
