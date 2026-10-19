package com.example.rep_max.service;

import com.example.rep_max.DTO.mapper.UsuarioMapper;
import com.example.rep_max.DTO.request.UsuarioRequest;
import com.example.rep_max.DTO.response.UsuarioResponse;
import com.example.rep_max.entity.TipoPerfil;
import com.example.rep_max.entity.Usuario;
import com.example.rep_max.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper mapper;
    private final PasswordEncoder passwordEncoder;


    public UsuarioResponse saveUsuario(UsuarioRequest request) {
        Usuario usuario = mapper.toEntity(request);

        usuario.setPerfil(TipoPerfil.ALUNO);

        usuario.setSenhaHash(passwordEncoder.encode(request.senha()));

        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        return mapper.toResponse(usuarioSalvo);
    }




}
