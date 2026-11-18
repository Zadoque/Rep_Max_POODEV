# Contrato desejado da API do RepMax

Este documento foi levantado a partir de todas as funcoes publicas dos services em `front-end/src/services`. Ele descreve, por funcionalidade, a requisicao que cada service deve fazer quando `VITE_USE_MOCK=false`, o retorno que os componentes esperam e as validacoes necessarias antes da resposta.

Enquanto `VITE_USE_MOCK=true`, os services simulam as mesmas operacoes e persistem mutacoes no `localStorage`. A interface nao deve precisar saber se recebeu mock ou API.

## Regras gerais

- Base sugerida: `/api`.
- Respostas JSON devem usar `Content-Type: application/json`.
- A autenticacao pode usar cookie de sessao ou token; o service deve ocultar esse detalhe dos componentes.
- Erros devem retornar `{ "status": number, "code": string, "message": string, "fieldErrors"?: object }`.
- `401` significa sessao ausente/expirada; `403`, falta de permissao; `404`, recurso inexistente ou fora do escopo do usuario; `409`, conflito; `422`, dados invalidos.
- O servidor deve verificar autenticacao e autorizacao antes de consultar ou alterar dados.
- Escritas de series devem aceitar um `clientEventId` ou `Idempotency-Key`, evitando duplicacao em retry.
- Datas devem ser ISO 8601 em UTC.

## Mapa dos services

| Service | Funcao | Operacao desejada |
| --- | --- | --- |
| `autenticacao.ts` | `autenticarUsuario` | autenticar credenciais e retornar usuario/sessao |
| `admin.ts` | `buscarUsuariosAdmin` | pesquisar usuarios para o administrador |
| `admin.ts` | `cadastrarUsuarioAdmin` | criar aluno ou administrador |
| `admin.ts` | `alterarStatusUsuarioAdmin` | ativar ou desativar conta |
| `admin.ts` | `alterarStatusUsuarioAdmin` | desativar ou reativar a conta do aluno |
| `admin.ts` | `enviarCodigoRedefinicaoAdmin` | solicitar codigo de redefinicao |
| `admin.ts` | `buscarExerciciosAdmin` | pesquisar exercicios para administracao |
| `admin.ts` | `salvarExercicioAdmin` | cadastrar ou editar exercicio |
| `admin.ts` | `removerExercicioAdmin` | remover/inativar exercicio |
| `aluno-dashboard.ts` | `buscarResumoAluno` | carregar resumo da tela inicial |
| `aluno-dashboard.ts` | `buscarRotinasAluno` | listar rotinas do aluno |
| `aluno-dashboard.ts` | `criarRotinaAluno` | criar rotina |
| `aluno-dashboard.ts` | `atualizarRotinaAluno` | editar rotina |
| `aluno-dashboard.ts` | `buscarHistoricoAluno` | carregar metricas e treinos realizados |
| `aluno-dashboard.ts` | `buscarExercicios` | consultar catalogo para selecao |
| `aluno-dashboard.ts` | `buscarPerfilAluno` | carregar perfil exibido no dashboard |
| `execucao-treino.ts` | `buscarTreinoExecucao` | carregar treino e series da execucao |
| `execucao-treino.ts` | `salvarTreinoExecucao` | sincronizar o treino inteiro |
| `execucao-treino.ts` | `atualizarStatusTreino` | pausar ou alterar status |
| `execucao-treino.ts` | `finalizarTreino` | finalizar sessao, completa ou parcial |
| `preferencias-usuario.ts` | `atualizarPreferenciaTema` | salvar tema preferido |

`atualizarSerie` e helpers de leitura/escrita do mock sao operacoes locais e nao devem gerar requisicao isolada. O registro da serie acontece quando `salvarTreinoExecucao` ou o endpoint granular de series for chamado.

## Autenticacao

### `autenticarUsuario(credenciais)`

**Requisicao:** `POST /api/auth/login` com `{ "email": string, "senha": string }`.

**Retorno esperado:** sucesso com `{ "sucesso": true, "usuarioLogado": { "id", "nome", "email", "tipo", "ativo", "preferenciaTema" } }`; falha com `{ "sucesso": false, "codigoErroLogin": "LOGIN_INVALIDO" | "CONTA_DESATIVADA" }`.

O service deve normalizar o email para minusculas antes do envio. A API deve repetir essa normalizacao, validar credenciais, verificar `ativo` e nunca devolver senha ou `senhaHash`. Conta desativada deve ser distinguida de credencial invalida para que a tela correta seja exibida.

O contrato tambem precisa de `POST /api/auth/logout`, sem retorno de dados, para encerrar a sessao quando o usuario sair. Se houver `GET /api/auth/me`, ele deve retornar o mesmo usuario autenticado e as sessoes de treino pendentes.

## Administracao de usuarios

### `buscarUsuariosAdmin()`

**Requisicao:** `GET /api/usuarios` com filtros opcionais `search`, `tipo`, `ativo`, `page` e `pageSize`.

**Retorno esperado:** `UsuarioMock[]` ou, preferencialmente, `{ "items": Usuario[], "page", "pageSize", "total" }`. Cada usuario deve conter `id`, `nome`, `email`, `tipo`, `ativo` e `preferenciaTema`, sem senha.

Antes de retornar, a API deve exigir perfil administrador, aplicar filtros e paginacao no servidor e ocultar contas fora do escopo permitido.

### `cadastrarUsuarioAdmin(dados)`

**Requisicao:** `POST /api/usuarios` com `nome`, `email` e `tipo` (`ALUNO` ou `ADMIN`).

**Retorno esperado:** usuario criado, ativo, com `id`, nome, email normalizado, tipo e preferencia inicial. A senha inicial ou um fluxo de convite deve ser tratado pelo back-end, nunca pelo componente.

Validar permissao para criar administrador, nome nao vazio, email valido e unico e tipo permitido. O retorno nao pode conter segredo.

### `alterarStatusUsuarioAdmin(usuarioId, ativo)`

**Requisicao:** `PATCH /api/usuarios/{usuarioId}/status` com `{ "ativo": boolean }`.

**Retorno esperado:** usuario atualizado com o novo `ativo`.

Validar administrador solicitante, existencia do alvo e regra de nao remover o proprio acesso. Ao desativar, invalidar sessoes futuras e, conforme a politica, sessoes atuais.

### Desativacao de aluno

A conta do aluno nunca e removida fisicamente pela administracao. O campo `ativo: boolean` permanece na entidade `USUARIO` e controla se a conta pode autenticar e usar a aplicacao.

**Requisicao:** `PATCH /api/usuarios/{usuarioId}/status` com `{ "ativo": false }`, usando `alterarStatusUsuarioAdmin(usuarioId, false)`.

**Retorno esperado:** usuario atualizado, mantendo `id`, nome, email, tipo, `ativo: false` e demais dados persistentes.

Validar que o alvo e um aluno, que pertence ao escopo do administrador e que o administrador nao esta desativando a propria conta. A desativacao deve invalidar novas autenticacoes e, conforme a politica de sessao, acessos ativos. A reativacao usa a mesma requisicao com `{ "ativo": true }`.

### `enviarCodigoRedefinicaoAdmin(usuario)`

**Requisicao:** `POST /api/usuarios/{usuario.id}/redefinicao-senha`.

**Retorno esperado:** confirmacao generica, por exemplo `{ "processado": true }`. O codigo nao deve ser retornado em producao; o mock apenas registra no console o envio.

Validar autorizacao, expirar o codigo, permitir uso unico e nao revelar ao administrador se o email existe quando essa informacao for sensivel.

## Administracao de exercicios

### `buscarExerciciosAdmin()` e `buscarExercicios()`

**Requisicao:** `GET /api/exercicios` com `search`, `grupoMuscular`, `ativo`, `page` e `pageSize` opcionais.

**Retorno esperado:** lista de `ExercicioCatalogo`, contendo `id`, `slug`, `nome`, `grupoMuscular`, `equipamento`, `descricao`, `instrucoesExecucao`, `midia` e `ativo`. A `midia` deve conter `animacao`, `animacaoLenta`, `animacaoRapida`, `creditos` e `licenca` quando houver.

Para a selecao de aluno, a API deve retornar somente exercicios ativos e disponiveis. Para o administrador, pode incluir inativos. Validar paginacao e nao expor arquivos que nao estejam autorizados.

### `salvarExercicioAdmin(dados, id?)`

**Requisicao:** `POST /api/exercicios` quando `id` nao existir; `PUT /api/exercicios/{id}` quando houver `id`. O corpo segue `Omit<ExercicioCatalogo, "id">`.

**Retorno esperado:** exercicio persistido completo, incluindo `id`, `slug` calculado/validado e estado `ativo`.

Validar nome, grupo muscular, equipamento, instrucoes, URLs/midia, licenca e unicidade de slug. Na edicao, verificar existencia e conflitos de concorrencia.

### `removerExercicioAdmin(exercicioId)`

**Requisicao:** `DELETE /api/exercicios/{exercicioId}`.

**Retorno esperado:** `204 No Content` ou exercicio com `ativo=false` se a politica for inativacao.

Antes de excluir, verificar referencias em rotinas e historico. Se houver dados historicos, preferir inativar sem quebrar series ja registradas.

## Dashboard do aluno

### `buscarResumoAluno()`

**Requisicao:** `GET /api/alunos/me/resumo`.

**Retorno esperado:** `ResumoHomeAluno` com `treinoAtual` (ou `null`), `rotinasAtivas`, `ultimoTreino` (ou `null`) e quantidade de exercicios por rotina.

O servidor deve calcular a proxima rotina pela ordem do aluno e retornar sessao atual somente quando houver treino aberto. Nao deve marcar como em andamento uma sessao que nao tenha serie registrada.

### `buscarRotinasAluno(usuarioId)`

**Requisicao preferencial:** `GET /api/rotinas`. O `usuarioId` deve ser derivado da sessao; nao confiar em id arbitrario enviado pelo cliente. O back-end remoto atual possui esse CRUD em `/rotinas`.

**Retorno esperado:** `RotinaDashboard[]`, com `id`, `nome`, `descricao`, `itens`, `ultimaExecucao` e `atualizadoEm`. Cada item deve ser simples ou tecnica combinada.

Validar proprietario, ordenar itens, garantir ordens unicas e carregar exercicios existentes. Nao retornar rotina de outro aluno.

### `criarRotinaAluno(usuarioId, dadosRotina)`

**Requisicao:** `POST /api/rotinas` com `nome`, `descricao` e itens ordenados.

**Retorno esperado:** rotina criada completa, com `id`, `ultimaExecucao: null`, `atualizadoEm` e itens persistidos.

Validar nome, limites, exercicios ativos, ordem sem duplicidade, numero positivo de series e composicao valida de tecnicas. A escrita deve ser transacional.

### `atualizarRotinaAluno(usuarioId, rotinaId, dadosRotina)`

**Requisicao:** `PUT /api/rotinas/{rotinaId}` com o mesmo corpo de criacao.

**Retorno esperado:** rotina completa apos a alteracao, com `atualizadoEm` novo.

Validar proprietario, versao/conflito, todos os itens antes de gravar, ordem dos exercicios dentro de grupos e regras de BI_SET, TRI_SET e MONSTER_SET. A API nao deve apagar historico de treinos ao alterar a rotina.

### `buscarPerfilAluno()`

**Requisicao:** `GET /api/alunos/me/perfil` ou `GET /api/usuarios/me`.

**Retorno esperado:** `PerfilDashboard` com email, foto, peso, altura, unidades, notificacoes e tema.

Validar autenticacao e retornar somente o perfil do usuario. Campos ausentes devem ter valores nulos ou defaults explicitamente tipados, nunca formatos diferentes por tela.

## Preferencia de tema

### `atualizarPreferenciaTema(usuario, preferenciaTema)`

**Requisicao:** `PATCH /api/usuarios/me/preferencia-tema` com `{ "preferenciaTema": "CLARO" | "ESCURO" }`.

**Retorno esperado:** `UsuarioLogado` atualizado, contendo o mesmo id, nome, email, tipo, ativo e o novo tema.

Validar autenticacao e enum. O front pode atualizar imediatamente a aparencia, mas deve persistir a preferencia local apos resposta valida; em erro, deve restaurar ou informar o estado anterior.

## Execucao detalhada do treino - contrato desejado

Esta secao descreve o estado desejado da API para a tela de execucao. A tela pode usar `salvarTreinoExecucao` como sincronizacao agregada no mock, mas a API deve permitir eventos granulares para reduzir requisicoes e evitar perda de dados.

### `buscarTreinoExecucao(usuarioId, treinoId)`

**Requisicao:** `GET /api/treinos/{treinoId}/execucao`. O usuario deve vir da sessao, mesmo que o service ainda receba `usuarioId` para selecionar o mock.

**Retorno esperado:** `TreinoResumo` com `id`, `alunoId`, `status`, `inicio`, `fim`, `nomeRotina`, `conclusao` e `itens`. Cada item deve trazer exercicio simples ou tecnica, series, repeticoes, carga e estado de conclusao.

Validar proprietario, existencia, status permitido e pertencimento dos itens a uma rotina. Para grupos, retornar uma quantidade de series compartilhada visualmente e os exercicios lado a lado.

### `salvarTreinoExecucao(treino)`

**Requisicao agregada:** `PATCH /api/treinos/{treino.id}/execucao` com o snapshot validado e uma versao/client event id.

**Requisicao granular preferencial:** `POST /api/treinos/{treino.id}/series` para cada serie confirmada. O corpo deve conter `itemRotinaId`, `numeroSerie`, `exercicios`, `repeticoes`, `cargaKg`, `ordemExecucao`, `registradoEm` e `clientEventId`.

**Retorno esperado:** treino atualizado, status atual, serie aceita, proximo item e eventos ainda pendentes. Uma serie de BI_SET, TRI_SET ou MONSTER_SET e uma unidade para o usuario; internamente pode retornar uma linha por exercicio, todas ligadas por `grupoSerieId`.

Validar autenticacao, rotina, exercicio, ordem, numero sequencial, limites de repeticoes/carga, tecnicas e idempotencia. Uma falha de rede nao pode fazer o cliente duplicar a serie no retry.

### `atualizarStatusTreino(treino, status)`

**Requisicao:** `PATCH /api/treinos/{treino.id}/status` com `{ "status": "EM_ANDAMENTO" | "PAUSADO" | "FINALIZADO" }` e versao.

**Retorno esperado:** `TreinoResumo` atualizado.

Transicoes desejadas: sessao sem serie nao deve ficar em andamento; `EM_ANDAMENTO` pode ir para `PAUSADO` ou `FINALIZADO`; `PAUSADO` pode voltar a andamento ou ir para finalizado; finalizado e terminal. Validar proprietario e concorrencia.

### `finalizarTreino(treino, conclusao)`

**Requisicao:** `POST /api/treinos/{treino.id}/finalizar` com `{ "conclusao": "COMPLETA" | "PARCIAL", "fim": ISODate }`.

**Retorno esperado:** treino finalizado com `status: "FINALIZADO"`, `conclusao`, `fim` e todas as series aceitas.

`PARCIAL` e valido quando a pessoa sair antes do fim; o historico deve preservar exatamente o que foi feito. A API deve rejeitar finalizacao sem nenhuma serie se o produto nao permitir sessoes vazias e deve ser idempotente.

### Sessoes abertas no login

**Requisicao:** `GET /api/treinos/abertos`.

**Retorno esperado:** sessoes do usuario com series registradas e status aberto, incluindo rotina, ultima serie e tempo desde o ultimo evento.

No login, o front pergunta se a pessoa quer retomar, pausar ou finalizar. Se o usuario saiu por dias ou voltou para outra rotina, a sessao anterior continua disponivel e nao bloqueia o inicio de outro treino. Regras de recuperacao e conflito muscular podem ser alertas de produto, nao apagamento automatico.

### Ordem adaptada durante a execucao

**Requisicao:** `POST /api/treinos/{treino.id}/ordem` com a ordem usada na sessao.

**Retorno esperado:** sessao com ordem efetiva atualizada.

A API deve validar que os itens pertencem a rotina, que a ordem e completa e sem repeticao e que a alteracao nao reescreve series anteriores. Para tornar a mudanca permanente, usar uma requisicao separada:

`POST /api/treinos/{treino.id}/salvar-ordem-na-rotina`.

## Tecnicas combinadas - contrato desejado

Um item da rotina e um exercicio simples ou uma tecnica. Para tecnica, a resposta deve conter `tipoTecnica`, `quantidadeSeries` compartilhada e `exercicios` com `exercicioId` e `ordemNoGrupo`.

Regras antes de responder:

- `BI_SET` tem exatamente dois exercicios; `TRI_SET`, tres; `MONSTER_SET`, quatro ou mais conforme a regra do produto.
- Todos os exercicios existem, estao ativos e aparecem uma unica vez no grupo.
- A quantidade de series e positiva e pertence ao grupo, nao a cada card individual.
- Ao adicionar ou remover membro, o tipo retornado corresponde ao novo tamanho do grupo.
- Durante a execucao, uma serie de grupo possui um `grupoSerieId` comum e pode gerar uma serie interna por exercicio para metricas.
- A interface deve contabilizar uma vez a serie do grupo, nunca `numeroDeExercicios * quantidadeDeSeries`.

## Historico e metricas

### `buscarHistoricoAluno(usuarioId)`

**Requisicao:** `GET /api/alunos/me/historico` ou, preferencialmente, endpoints separados:

- `GET /api/historico/treinos` para treinos realizados;
- `GET /api/historico/metricas` para indicadores agregados;
- `GET /api/historico/metricas/exercicios` para evolucao por exercicio.

**Retorno esperado:** `HistoricoAluno` com `metricas`, `metricasPorExercicio` e `treinos`. Cada serie de metrica possui id, titulo, descricao, unidade, pontos e variacao; cada treino possui id, rotina, data, duracao e status.

Validar proprietario, periodo, paginacao e filtros. Usar somente series aceitas, nao duplicar grupos e preservar sessoes finalizadas parcialmente.

Metricas desejadas: volume total, volume por exercicio, carga, one-rep max estimado, repeticoes, series, frequencia e evolucao temporal. A consulta deve indicar unidade e periodo para que o front nao precise inferir.

## Persistencia do mock e troca pela API

No ramo de mock, os services usam estas responsabilidades:

- `admin.ts`: usuarios em `rep_max_admin_usuarios` e exercicios em `rep_max_admin_exercicios`.
- `aluno-dashboard.ts`: rotinas por usuario em `rep-max:rotinas-estruturadas`.
- `execucao-treino.ts`: treinos por usuario em `rep-max:treinos-execucao`.
- `preferencias-usuario.ts`: tema do usuario e estado local da sessao.

Ao implementar a API real, manter os mesmos tipos de retorno, as mesmas validacoes de dominio e os mesmos estados de carregamento/erro. O `localStorage` nao deve ser usado como fonte de verdade no ramo real, e nenhuma tela deve chamar `fetch` diretamente.
