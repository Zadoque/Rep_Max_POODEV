import type { ExercicioCatalogo } from "../../types/exercicio"
import type TreinoResumo from "../../types/treino-resumo"
import type { ExercicioTreino, ItemTreino } from "../../types/treino-resumo"
import ExecucaoResumo from "./ExecucaoResumo"
import ExercicioExecucaoCard from "./ExercicioExecucaoCard"
import TecnicaExecucaoCard from "./TecnicaExecucaoCard"

type AlteracoesSerie = Partial<Pick<ExercicioTreino["series"][number], "repeticoes" | "cargaKg">>

interface Props {
    treino: TreinoResumo
    exercicios: ExercicioCatalogo[]
    proximo: string
    concluidas: number
    planejadas: number
    mensagem: string | null
    onAlterarSerie: (exercicioId: number, numero: number, alteracoes: AlteracoesSerie) => void
    onRegistrarSerie: (exercicioId: number, numero: number) => void
}

function chaveItem(item: ItemTreino, indice: number) {
    if (item.tipoItem === "EXERCICIO") return item.exercicio.id
    return `${item.tipoTecnica}-${item.exercicios.map((exercicio) => exercicio.id).join("-")}-${indice}`
}

export default function ExecucaoTreinoConteudo({
    treino,
    exercicios,
    proximo,
    concluidas,
    planejadas,
    mensagem,
    onAlterarSerie,
    onRegistrarSerie,
}: Props) {
    return (
        <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8">
            <section className="space-y-5">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900 sm:p-6">
                    <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                        Próximo item
                    </p>
                    <h1 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
                        {proximo}
                    </h1>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        Registre cada série na sua própria linha. A próxima série sugere as
                        repetições anteriores.
                    </p>
                </div>
                {treino.itens.map((item, indice) =>
                    item.tipoItem === "EXERCICIO" ? (
                        <ExercicioExecucaoCard
                            key={chaveItem(item, indice)}
                            exercicio={item.exercicio}
                            catalogo={exercicios.find(
                                (exercicio) => exercicio.id === item.exercicio.id,
                            )}
                            itemAtivo={proximo.startsWith(item.exercicio.nome)}
                            onAlterarSerie={(numero, alteracoes) =>
                                onAlterarSerie(item.exercicio.id, numero, alteracoes)
                            }
                            onRegistrarSerie={(numero) =>
                                onRegistrarSerie(item.exercicio.id, numero)
                            }
                        />
                    ) : (
                        <TecnicaExecucaoCard
                            key={chaveItem(item, indice)}
                            item={item}
                            catalogo={exercicios}
                            itemAtivo={proximo.includes(item.tipoTecnica.replace("_", "-"))}
                            membroAtivoId={
                                item.exercicios.find((exercicio) =>
                                    proximo.startsWith(
                                        `${item.tipoTecnica.replace("_", "-")} · ${exercicio.nome}`,
                                    ),
                                )?.id ?? null
                            }
                            onAlterarSerie={onAlterarSerie}
                            onRegistrarSerie={onRegistrarSerie}
                        />
                    ),
                )}
            </section>
            <ExecucaoResumo
                nome={treino.nomeRotina ?? "Treino"}
                concluidas={concluidas}
                planejadas={planejadas}
                proximo={proximo}
                mensagem={mensagem}
            />
        </main>
    )
}
