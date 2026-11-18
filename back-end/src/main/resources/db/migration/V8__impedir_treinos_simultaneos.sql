CREATE UNIQUE INDEX uk_treinos_aluno_aberto
    ON treinos (aluno_id)
    WHERE status IN ('EM_ANDAMENTO', 'PAUSADO');