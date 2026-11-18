import type { ExercicioCatalogo } from "../../types/exercicio"
import type { ItemTreinoTecnica } from "../../types/treino-resumo"
import ExercicioExecucaoCard from "./ExercicioExecucaoCard"
import SerieExecucaoRow from "./SerieExecucaoRow"

interface Props {
    item: ItemTreinoTecnica
    catalogo: ExercicioCatalogo[]
    itemAtivo: boolean
    membroAtivoId: number | null
    onAlterarSerie: (
        exercicioId: number,
        numero: number,
        alteracoes: { repeticoes?: number; cargaKg?: number },
    ) => void
    onRegistrarSerie: (exercicioId: number, numero: number) => void
    onRegistrarGrupoSerie: (exercicioIds: number[], numero: number) => void
}

const rotulos: Record<ItemTreinoTecnica["tipoTecnica"], string> = {
    BI_SET: "Bi-set",
    TRI_SET: "Tri-set",
    MONSTER_SET: "Monster-set",
}

export default function TecnicaExecucaoCard({
    item,
    catalogo,
    itemAtivo,
    membroAtivoId,
    onAlterarSerie,
    onRegistrarSerie,
    onRegistrarGrupoSerie,
}: Props) {
    const primeiroExercicio = item.exercicios[0]
    const seriesConcluidas =
        primeiroExercicio?.series.filter((serie) => serie.concluida).length ?? 0
    const serieLiberada = (numero: number) =>
        numero === 1 ||
        item.exercicios.every((membro) =>
            membro.series.some((serie) => serie.numero === numero - 1 && serie.concluida),
        )

    if (!primeiroExercicio) {
        return null
    }

    return (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-card dark:border-emerald-900 dark:bg-emerald-950/20 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                        {rotulos[item.tipoTecnica]}
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
                        Exercícios do grupo
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        Faça os exercícios em sequência. As séries são preenchidas uma vez para o
                        grupo.
                    </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {seriesConcluidas}/{item.quantidadeSeries} séries do grupo
                </span>
            </div>

            <div className="scrollbar-group mt-5 flex min-w-0 snap-x gap-4 overflow-x-scroll border-y border-emerald-300 py-3 dark:border-emerald-700">
                {item.exercicios.map((exercicio) => (
                    <div
                        key={exercicio.id}
                        className="w-[min(78vw,20rem)] min-w-[min(78vw,20rem)] snap-start sm:w-80 sm:min-w-80"
                    >
                        <ExercicioExecucaoCard
                            exercicio={exercicio}
                            catalogo={catalogo.find(
                                (itemCatalogo) => itemCatalogo.id === exercicio.id,
                            )}
                            itemAtivo={itemAtivo && membroAtivoId === exercicio.id}
                            mostrarSeries={false}
                            onAlterarSerie={(numero, alteracoes) =>
                                onAlterarSerie(exercicio.id, numero, alteracoes)
                            }
                            onRegistrarSerie={(numero) => onRegistrarSerie(exercicio.id, numero)}
                        />
                    </div>
                ))}
            </div>

            <div className="mt-3 space-y-3">
                {primeiroExercicio.series.map((serie, indice) => (
                    <SerieExecucaoRow
                        key={serie.numero}
                        serie={serie}
                        bloqueada={!serieLiberada(serie.numero)}
                        herdouRepeticoes={
                            indice > 0 &&
                            serie.repeticoes === primeiroExercicio.series[indice - 1].repeticoes
                        }
                        onAlterarRepeticoes={(variacao) =>
                            item.exercicios.forEach((exercicio) =>
                                onAlterarSerie(exercicio.id, serie.numero, {
                                    repeticoes: Math.max(1, serie.repeticoes + variacao),
                                }),
                            )
                        }
                        onAlterarCarga={(variacao) =>
                            item.exercicios.forEach((exercicio) =>
                                onAlterarSerie(exercicio.id, serie.numero, {
                                    cargaKg: Math.max(0, serie.cargaKg + variacao),
                                }),
                            )
                        }
                        onDigitarCarga={(valor) =>
                            item.exercicios.forEach((exercicio) =>
                                onAlterarSerie(exercicio.id, serie.numero, {
                                    cargaKg: Number.isFinite(valor) ? valor : 0,
                                }),
                            )
                        }
                        onRegistrar={() =>
                            onRegistrarGrupoSerie(
                                item.exercicios.map((exercicio) => exercicio.id),
                                serie.numero,
                            )
                        }
                    />
                ))}
            </div>
        </section>
    )
}
