package com.example.rep_max.DTO.mapper;

import com.example.rep_max.DTO.request.ItemRotinaRequest;
import com.example.rep_max.DTO.response.ItemRotinaResponse;
import com.example.rep_max.entity.ItemRotina;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.ERROR
)
public interface ItemRotinaMapper {

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "ordem", source = "ordem")
    @Mapping(target = "quantidadeSeries", source = "quantidadeSeries")
    ItemRotina toEntity(ItemRotinaRequest request);

    @Mapping(target = "exercicioId", source = "exercicio.id")
    @Mapping(target = "exercicioNome", source = "exercicio.nome")
    ItemRotinaResponse toResponse(ItemRotina itemRotina);

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "ordem", source = "ordem")
    @Mapping(target = "quantidadeSeries", source = "quantidadeSeries")
    void updateEntity(
            ItemRotinaRequest request,
            @MappingTarget ItemRotina itemRotina
    );
}