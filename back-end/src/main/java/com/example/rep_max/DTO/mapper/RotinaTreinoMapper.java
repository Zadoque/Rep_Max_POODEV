package com.example.rep_max.DTO.mapper;


import com.example.rep_max.DTO.request.RotinaTreinoRequest;
import com.example.rep_max.DTO.response.RotinaTreinoResponse;
import com.example.rep_max.entity.RotinaTreino;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface RotinaTreinoMapper {

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "nome", source = "nome")
    RotinaTreino toEntity(RotinaTreinoRequest Request);

    RotinaTreinoResponse toResponse(RotinaTreino rotinaTreino);

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "nome", source = "nome")

    void updateEntity(
            RotinaTreinoRequest request,
            @MappingTarget RotinaTreino rotinaTreino
    );
}
