package com.example.rep_max.service;

import com.example.rep_max.DTO.mapper.TreinoMapper;
import com.example.rep_max.DTO.request.TreinoRequest;
import com.example.rep_max.DTO.request.TreinoUpdateRequest;
import com.example.rep_max.DTO.response.TreinoResponse;
import com.example.rep_max.entity.RotinaTreino;
import com.example.rep_max.entity.StatusTreino;
import com.example.rep_max.entity.Treino;
import com.example.rep_max.entity.Usuario;
import com.example.rep_max.exception.RegraNegocioException;
import com.example.rep_max.repository.RotinaTreinoRepository;
import com.example.rep_max.repository.TreinoRepository;
import com.example.rep_max.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TreinoService {

    private final TreinoMapper mapper;
    private final TreinoRepository repository;
    private final RotinaTreinoRepository rotinaTreinoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public TreinoResponse create(String email, TreinoRequest request) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário não encontrado"
                ));

        RotinaTreino rotinaTreino = rotinaTreinoRepository.
                findByIdAndAluno_EmailIgnoreCaseAndAtivaTrue(request.rotinaOrigemId(), email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Rotina não encontrada"));


        boolean possuiTreinoAberto = repository.existsByAluno_IdAndStatusIn(
                usuario.getId(),
                List.of(StatusTreino.EM_ANDAMENTO, StatusTreino.PAUSADO)
        );

        if (possuiTreinoAberto) {
            throw new RegraNegocioException(
                    "Você já possui um treino em andamento ou pausado."
            );
        }
        Treino treino = mapper.toEntity(request);
        treino.setAluno(usuario);
        treino.setRotinaOrigem(rotinaTreino);
        treino.setInicio(LocalDateTime.now());
        treino.setStatus(StatusTreino.EM_ANDAMENTO);
        Treino treinoSalvo = repository.save(treino);
        return mapper.toResponse(treinoSalvo);


    }

    @Transactional(readOnly = true)
    public List<TreinoResponse> findAll(String email) {

        return repository
                .findAllByAluno_EmailIgnoreCaseOrderByInicioDesc(email)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    // 3. Buscar um treino pelo ID
    @Transactional(readOnly = true)
    public TreinoResponse getById(Long treinoId, String email) {

        Treino treino = buscarTreinoDoAluno(treinoId, email);

        return mapper.toResponse(treino);
    }

    // 9. Excluir um treino
    @Transactional
    public void delete(Long treinoId, String email) {

        Treino treino = buscarTreinoDoAluno(treinoId, email);

        repository.delete(treino);
    }
    // 5. Atualizar as observações do treino
    @Transactional
    public TreinoResponse update(
            Long treinoId,
            TreinoUpdateRequest request,
            String email
    ) {

        Treino treino = buscarTreinoDoAluno(treinoId, email);

        mapper.updateEntity(request, treino);

        return mapper.toResponse(treino);
    }
    @Transactional
    public void pause(Long treinoId, String email){
        Treino treino = buscarTreinoDoAluno(treinoId, email);
        if (treino.getStatus() != StatusTreino.EM_ANDAMENTO) {
            throw new RegraNegocioException("Somente treinos em andamento podem ser pausados.");
        }
        treino.setStatus(StatusTreino.PAUSADO);

    }

    @Transactional
    public void resume(Long treinoId, String email) {
        Treino treino = buscarTreinoDoAluno(treinoId, email);
        if (treino.getStatus() != StatusTreino.PAUSADO) {
            throw new RegraNegocioException("Somente treinos pausados podem ser retomados.");
        }
        treino.setStatus(StatusTreino.EM_ANDAMENTO);
    }

    @Transactional
    public void finish(Long treinoId, String email) {
        Treino treino = buscarTreinoDoAluno(treinoId, email);
        if (treino.getStatus() != StatusTreino.EM_ANDAMENTO
                && treino.getStatus() != StatusTreino.PAUSADO) {
            throw new RegraNegocioException
                    ("Somente treinos pausados ou em andamento podem ser finalizados.");
        }
        treino.setFim(LocalDateTime.now());
        treino.setStatus(StatusTreino.FINALIZADO);
    }

    // Método auxiliar para evitar repetir a mesma consulta
    private Treino buscarTreinoDoAluno(Long treinoId, String email) {

        return repository
                .findByIdAndAluno_EmailIgnoreCase(treinoId, email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Treino não encontrado"
                ));
    }
}
