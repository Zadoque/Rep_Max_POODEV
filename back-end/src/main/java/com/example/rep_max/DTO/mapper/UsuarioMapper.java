package com.example.rep_max.DTO.mapper;

import com.example.rep_max.DTO.request.UsuarioRequest;
import com.example.rep_max.DTO.request.UsuarioUpdateRequest;
import com.example.rep_max.DTO.response.UsuarioResponse;
import com.example.rep_max.entity.Usuario;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.ERROR
)
public interface UsuarioMapper {

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "nome", source = "nome")
    @Mapping(target = "email", source = "email")
    Usuario toEntity(UsuarioRequest request);

    UsuarioResponse toResponse(Usuario usuario);

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "nome", source = "nome")
    @Mapping(target = "email", source = "email")
    void updateEntity(
            UsuarioUpdateRequest request,
            @MappingTarget Usuario usuario
    );
}