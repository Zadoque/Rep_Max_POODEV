import { resumosHomeAlunoMock } from "../../mocks/aluno-home-page-mock"
import { treinosMock } from "../../mocks/treino-mock"
import type { StatusTreino } from "../../types/treino-resumo"

const formatarData = (valor: string) =>
    new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(valor))

interface InicioTabProps {
    usuarioId: number
}

const mensagensPorStatus: Record<StatusTreino, { titulo: string; descricao: string }> = {
    PAUSADO: {
        titulo: "Continue seu treino",
        descricao: "Você tem um treino pausado esperando para ser concluído.",
    },
    NAO_INICIADO: {
        titulo: "Seu próximo treino",
        descricao: "Sua próxima rotina está pronta para você começar.",
    },
    EM_ANDAMENTO: {
        titulo: "Treino em andamento",
        descricao: "Continue de onde parou para concluir sua rotina.",
    },
    FINALIZADO: {
        titulo: "Treino concluído",
        descricao: "Seu último treino foi concluído. Prepare-se para o próximo.",
    },
    FINALIZADO_PARCIALMENTE: {
        titulo: "Retome seu treino",
        descricao: "Existe um treino parcialmente concluído para continuar.",
    },
}

export default function InicioTab({ usuarioId }: InicioTabProps) {
    const resumo = resumosHomeAlunoMock[usuarioId] ?? resumosHomeAlunoMock[1]
    const treinoAtual = resumo.treinoAtual
    const treinoDetalhado = treinoAtual
        ? treinosMock.find((treino) => treino.id === treinoAtual.id)
        : undefined
    const mensagem = treinoAtual ? mensagensPorStatus[treinoAtual.status] : {
        titulo: "Tudo pronto para o próximo treino",
        descricao: "Escolha uma rotina na aba Treinos para começar.",
    }

    return (
        <div className="space-y-6">
            <section>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">Seu próximo passo</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{mensagem.titulo}</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-300">{mensagem.descricao}</p>
            </section>

            <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/40">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">{treinoAtual?.status === "PAUSADO" ? "Treino pausado" : "Próximo treino"}</p>
                        <h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">{treinoAtual?.nomeRotina ?? "Nenhum treino selecionado"}</h2>
                        {treinoAtual && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Iniciado em {formatarData(treinoAtual.inicio)}</p>}
                    </div>
                        <button type="button" className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600">
                        {treinoAtual?.status === "PAUSADO" ? "Continuar treino" : "Começar treino"}
                    </button>
                </div>

                {treinoDetalhado && (
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {treinoDetalhado.exercicios.map((exercicio) => (
                            <div key={exercicio.id} className="rounded-2xl bg-white/80 p-4 dark:bg-slate-950/50">
                                <p className="font-semibold text-slate-950 dark:text-white">{exercicio.nome}</p>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{exercicio.series.length} séries · {exercicio.grupoMuscular}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

        </div>
    )
}
