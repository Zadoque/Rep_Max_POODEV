package com.example.rep_max.DTO.mapper;

import com.example.rep_max.DTO.request.ExercicioRequest;
import com.example.rep_max.DTO.response.ExercicioResponse;
import com.example.rep_max.entity.Exercicio;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface ExercicioMapper {

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "nome", source = "nome")
    @Mapping(target = "grupoMuscular", source = "grupoMuscular")
    @Mapping(target = "descricao", source = "descricao")
    @Mapping(target = "instrucoesExecucao", source = "instrucoesExecucao")
    @Mapping(target = "urlMidia", source = "urlMidia")
    Exercicio toEntity(ExercicioRequest request);

    ExercicioResponse toResponse(Exercicio exercicio);

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "nome", source = "nome")
    @Mapping(target = "grupoMuscular", source = "grupoMuscular")
    @Mapping(target = "descricao", source = "descricao")
    @Mapping(target = "instrucoesExecucao", source = "instrucoesExecucao")
    @Mapping(target = "urlMidia", source = "urlMidia")
    void updateEntity(ExercicioRequest request, @MappingTarget Exercicio exercicio);
}
