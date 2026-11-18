package com.example.rep_max.DTO.mapper;

import com.example.rep_max.DTO.request.TreinoRequest;
import com.example.rep_max.DTO.request.TreinoUpdateRequest;
import com.example.rep_max.DTO.response.TreinoResponse;
import com.example.rep_max.entity.Treino;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.ERROR
)
public interface TreinoMapper {

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "observacoes", source = "observacoes")
    Treino toEntity(TreinoRequest request);

    @Mapping(target = "rotinaOrigemId", source = "rotinaOrigem.id")
    @Mapping(target = "rotinaOrigemNome", source = "rotinaOrigem.nome")
    TreinoResponse toResponse(Treino treino);

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "observacoes", source = "observacoes")
    void updateEntity(
            TreinoUpdateRequest request,
            @MappingTarget Treino treino
    );
}