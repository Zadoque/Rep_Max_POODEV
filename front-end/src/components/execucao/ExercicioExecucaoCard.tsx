import type { ExercicioCatalogo } from "../../types/exercicio"
import type { ExercicioTreino } from "../../types/treino-resumo"
import ExercicioAnimacao from "../exercicios/ExercicioAnimacao"
import SerieExecucaoRow from "./SerieExecucaoRow"

interface Props {
    exercicio: ExercicioTreino
    catalogo: ExercicioCatalogo | undefined
    itemAtivo: boolean
    mostrarSeries?: boolean
    serieLiberada?: (numero: number) => boolean
    onAlterarSerie: (
        numero: number,
        alteracoes: Partial<Pick<ExercicioTreino["series"][number], "repeticoes" | "cargaKg">>,
    ) => void
    onRegistrarSerie: (numero: number) => void
}

export default function ExercicioExecucaoCard({
    exercicio,
    catalogo,
    itemAtivo,
    mostrarSeries = true,
    serieLiberada,
    onAlterarSerie,
    onRegistrarSerie,
}: Props) {
    return (
        <article
            className={`rounded-3xl border p-4 shadow-card transition-colors sm:p-6 ${
                itemAtivo
                    ? "border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/20"
                    : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            } motion-reduce:transition-none`}
        >
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                        {exercicio.nome}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {exercicio.grupoMuscular}
                        {catalogo?.equipamento ? ` · equipamento: ${catalogo.equipamento}` : ""}
                    </p>
                </div>
                {mostrarSeries && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {exercicio.series.filter((serie) => serie.concluida).length}/
                        {exercicio.series.length} séries
                    </span>
                )}
            </div>

            {catalogo && (
                <div className="mt-4">
                    <ExercicioAnimacao exercicio={catalogo} />
                </div>
            )}

            {mostrarSeries && (
                <div className="mt-4 space-y-3">
                    {exercicio.series.map((serie, indice) => (
                        <SerieExecucaoRow
                            key={serie.numero}
                            serie={serie}
                            bloqueada={
                                serieLiberada
                                    ? !serieLiberada(serie.numero)
                                    : indice > 0 && !exercicio.series[indice - 1].concluida
                            }
                            herdouRepeticoes={
                                indice > 0 &&
                                serie.repeticoes === exercicio.series[indice - 1].repeticoes
                            }
                            onAlterarRepeticoes={(variacao) =>
                                onAlterarSerie(serie.numero, {
                                    repeticoes: Math.max(1, serie.repeticoes + variacao),
                                })
                            }
                            onAlterarCarga={(variacao) =>
                                onAlterarSerie(serie.numero, {
                                    cargaKg: Math.max(0, serie.cargaKg + variacao),
                                })
                            }
                            onDigitarCarga={(valor) =>
                                onAlterarSerie(serie.numero, {
                                    cargaKg: Number.isFinite(valor) ? valor : 0,
                                })
                            }
                            onRegistrar={() => onRegistrarSerie(serie.numero)}
                        />
                    ))}
                </div>
            )}
        </article>
    )
}
