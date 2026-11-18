package com.example.rep_max.DTO.mapper;

import com.example.rep_max.DTO.request.SerieExecutadaRequest;
import com.example.rep_max.DTO.response.SerieExecutadaResponse;
import com.example.rep_max.entity.SerieExecutada;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.ERROR
)
public interface SerieExecutadaMapper {

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "numeroSerie", source = "numeroSerie")
    @Mapping(target = "repeticoes", source = "repeticoes")
    @Mapping(target = "cargaKg", source = "cargaKg")
    @Mapping(target = "ordemExecucao", source = "ordemExecucao")
    SerieExecutada toEntity(SerieExecutadaRequest request);

    @Mapping(target = "treinoId", source = "treino.id")
    @Mapping(target = "exercicioId", source = "exercicio.id")
    @Mapping(target = "exercicioNome", source = "exercicio.nome")
    SerieExecutadaResponse toResponse(SerieExecutada serie);

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "numeroSerie", source = "numeroSerie")
    @Mapping(target = "repeticoes", source = "repeticoes")
    @Mapping(target = "cargaKg", source = "cargaKg")
    @Mapping(target = "ordemExecucao", source = "ordemExecucao")
    void updateEntity(
            SerieExecutadaRequest request,
            @MappingTarget SerieExecutada serie
    );
}
