package com.example.rep_max.service;


import com.example.rep_max.DTO.mapper.RotinaTreinoMapper;
import com.example.rep_max.DTO.request.RotinaTreinoRequest;
import com.example.rep_max.DTO.response.RotinaTreinoResponse;
import com.example.rep_max.entity.RotinaTreino;
import com.example.rep_max.entity.Usuario;
import com.example.rep_max.repository.RotinaTreinoRepository;
import com.example.rep_max.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RotinaTreinoService {

    private final RotinaTreinoMapper mapper;
    private final RotinaTreinoRepository rotinaTreinoRepository;
    private final UsuarioRepository usuarioRepository;


    @Transactional
    public RotinaTreinoResponse create(RotinaTreinoRequest request, String email){
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário não encontrado"
                ));
        RotinaTreino rotinaTreino = mapper.toEntity(request);
        rotinaTreino.setAluno(usuario);
        RotinaTreino rotinaSalva = rotinaTreinoRepository.save(rotinaTreino);
        return mapper.toResponse(rotinaSalva);
    }
    @Transactional(readOnly = true)
    public List<RotinaTreinoResponse> findALlAtiva(String email) {
        return rotinaTreinoRepository.
                findAllByAluno_EmailIgnoreCaseAndAtivaTrue(email)
                .stream()
                .map(mapper::toResponse)
                .toList();

    }

    @Transactional(readOnly = true)
    public  RotinaTreinoResponse findById(Long id, String email){
        RotinaTreino rotinaTreino = rotinaTreinoRepository.findByIdAndAluno_EmailIgnoreCase(id, email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Rotina não encontrada"
                ));

        return mapper.toResponse(rotinaTreino);
    }

    @Transactional
    public RotinaTreinoResponse update(
            Long id,
            RotinaTreinoRequest request,
            String email
    ) {
        RotinaTreino rotinaTreino = rotinaTreinoRepository
                .findByIdAndAluno_EmailIgnoreCase(id, email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Rotina não encontrada"
                ));

        mapper.updateEntity(request, rotinaTreino);
        return mapper.toResponse(rotinaTreino);
    }

    @Transactional
    public void desativar(Long id, String email) {
        RotinaTreino rotinaTreino = rotinaTreinoRepository
                .findByIdAndAluno_EmailIgnoreCase(id, email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Rotina não encontrada"
                ));
        rotinaTreino.setAtiva(false);
    }





}
