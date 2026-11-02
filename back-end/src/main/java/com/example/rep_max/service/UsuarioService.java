package com.example.rep_max.service;

import com.example.rep_max.DTO.mapper.UsuarioMapper;
import com.example.rep_max.DTO.request.UsuarioRequest;
import com.example.rep_max.DTO.response.UsuarioResponse;
import com.example.rep_max.entity.TipoPerfil;
import com.example.rep_max.entity.Usuario;
import com.example.rep_max.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper mapper;
    private final PasswordEncoder passwordEncoder;


    public UsuarioResponse saveUsuario(UsuarioRequest request) {
        String email = request.email().trim();

        if (usuarioRepository.existsByEmailIgnoreCase(email)){
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Email já cadastrado"
            );
        }

        Usuario usuario = mapper.toEntity(request);
        usuario.setEmail(email);
        usuario.setPerfil(TipoPerfil.ALUNO);

        usuario.setSenhaHash(passwordEncoder.encode(request.senha()));

        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        return mapper.toResponse(usuarioSalvo);
    }

    public List<UsuarioResponse> getAll() {
        return usuarioRepository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public Optional<UsuarioResponse> getById(Long id) {
        return usuarioRepository.findById(id)
                .map(mapper::toResponse);
    }
    @Transactional
    public void desativarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário não encontrado"
                ));
        usuario.setAtivo(false);

    }

    public UsuarioResponse getByEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário não encontrado"
                ));
        return mapper.toResponse(usuario);
    }






}
