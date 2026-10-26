import { useAutenticacao } from '../hooks/use-autenticacao'
import { useNavigate } from 'react-router'
import { resumoHomeAlunoMock } from '../mocks/aluno-home-page-mock'
import { treinosMock } from '../mocks/treino-mock'

const formatarData = (valor: string) =>
    new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(new Date(valor))

export default function AlunoHomePage() {
   const { usuario, sair } = useAutenticacao()
   const navigate = useNavigate()

    if (!usuario || usuario.tipo !== "ALUNO") {
        return (
            <div>
                <h1>Acesso restrito</h1>
                <p>Apenas alunos podem acessar esta página.</p>
            </div>
        )
    }

    const treinoAtual = resumoHomeAlunoMock.treinoAtual
    const treinoAtualDetalhado = treinoAtual
        ? treinosMock.find((treino) => treino.id === treinoAtual.id)
        : undefined

    return (    
        <div>
            <div>
                <div>REP º MAX</div>
                <div>
                    <span>Seja bem-vindo, {usuario.nome}!</span>
                    <button type="button" onClick={() => {
                        sair()
                        navigate("/login")
                    }}>
                        Sair
                    </button>
                </div>
            </div>

            <main>
                <h1>Início</h1>

                <section>
                    <h2>Treino atual</h2>
                    {treinoAtual ? (
                        <div>
                            <p>Rotina: {treinoAtual.nomeRotina ?? 'Sem rotina'}</p>
                            <p>Status: {treinoAtual.status}</p>
                            <p>Início: {formatarData(treinoAtual.inicio)}</p>

                            {treinoAtualDetalhado && (
                                <div>
                                    <h3>Exercícios</h3>
                                    {treinoAtualDetalhado.exercicios.map((exercicio) => (
                                        <article key={exercicio.id}>
                                            <h4>{exercicio.nome}</h4>
                                            <p>Grupo muscular: {exercicio.grupoMuscular}</p>
                                            <ul>
                                                {exercicio.series.map((serie) => (
                                                    <li key={serie.numero}>
                                                        Série {serie.numero}: {serie.repeticoes} repetições, {serie.cargaKg} kg — {serie.tipoTecnica}
                                                        {serie.concluida ? ' (concluída)' : ' (pendente)'}
                                                    </li>
                                                ))}
                                            </ul>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>Nenhum treino em andamento.</p>
                    )}
                </section>

                <section>
                    <h2>Rotinas ativas</h2>
                    <ul>
                        {resumoHomeAlunoMock.rotinasAtivas.map((rotina) => (
                            <li key={rotina.id}>
                                {rotina.nome} — {rotina.quantidadeExercicios} exercícios
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2>Último treino</h2>
                    {resumoHomeAlunoMock.ultimoTreino ? (
                        <p>
                            {resumoHomeAlunoMock.ultimoTreino.nomeRotina ?? 'Sem rotina'} — concluído em {formatarData(resumoHomeAlunoMock.ultimoTreino.data)}
                        </p>
                    ) : (
                        <p>Nenhum treino registrado.</p>
                    )}
                </section>
            </main>
        </div>
    )
}
