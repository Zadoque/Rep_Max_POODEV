import type { HistoricoAluno, TipoMetricaHistorico } from "../../types/aluno-dashboard"
import type { ExercicioCatalogo } from "../../types/exercicio"
import ExercicioAnimacao from "../exercicios/ExercicioAnimacao"

const nomesMetricas: Record<TipoMetricaHistorico, string> = {
    volume: "Volume total",
    oneRepMax: "1RM estimado",
    carga: "Carga por exercício",
    seriesRepeticoes: "Séries e repetições",
}

export default function HistoricoMetricas({
    historico,
    metricaAtiva,
    setMetricaAtiva,
    exercicios,
    exercicioAtivo,
    setExercicioAtivo,
}: {
    historico: HistoricoAluno
    metricaAtiva: TipoMetricaHistorico
    setMetricaAtiva: (valor: TipoMetricaHistorico) => void
    exercicios: ExercicioCatalogo[]
    exercicioAtivo: number
    setExercicioAtivo: (valor: number) => void
}) {
    const exercicio = exercicios.find((item) => item.id === exercicioAtivo)
    const porExercicio = historico.metricasPorExercicio.find(
        (item) => item.exercicioId === exercicioAtivo,
    )
    const metrica =
        metricaAtiva === "carga"
            ? porExercicio?.carga
            : metricaAtiva === "oneRepMax"
              ? porExercicio?.oneRepMax
              : historico.metricas.find((item) => item.id === metricaAtiva)
    if (!metrica)
        return <p className="text-slate-600 dark:text-slate-300">Não há dados para esta métrica.</p>
    const maiorValor = Math.max(...metrica.pontos.map((ponto) => ponto.valor), 1)
    return (
        <>
            <div className="flex justify-center md:justify-start">
                <div
                    className="flex max-w-full flex-wrap justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900"
                    role="tablist"
                    aria-label="Métrica do histórico"
                >
                    {historico.metricas.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            role="tab"
                            aria-selected={metricaAtiva === item.id}
                            onClick={() => setMetricaAtiva(item.id)}
                            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${metricaAtiva === item.id ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                        >
                            {nomesMetricas[item.id]}
                        </button>
                    ))}
                </div>
            </div>
            {(metricaAtiva === "carga" || metricaAtiva === "oneRepMax") && (
                <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                    <label
                        htmlFor="exercicio-historico"
                        className="text-sm font-bold text-slate-950 dark:text-white"
                    >
                        Escolha o exercício
                    </label>
                    <select
                        id="exercicio-historico"
                        value={exercicioAtivo}
                        onChange={(e) => setExercicioAtivo(Number(e.target.value))}
                        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-emerald-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white md:max-w-xl"
                    >
                        {exercicios.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.nome} · {item.grupoMuscular}
                            </option>
                        ))}
                    </select>
                    {exercicio && (
                        <div className="mt-4 flex items-center gap-4">
                            <ExercicioAnimacao exercicio={exercicio} />
                            <div>
                                <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                                    {exercicio.nome}
                                </h2>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {exercicio.grupoMuscular} · {exercicio.equipamento}
                                </p>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                    {exercicio.instrucoesExecucao}
                                </p>
                            </div>
                        </div>
                    )}
                </section>
            )}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                            {metrica.titulo}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {metrica.descricao}
                        </p>
                    </div>
                    <strong className="text-2xl text-emerald-700 dark:text-emerald-400">
                        +{metrica.variacao}%
                    </strong>
                </div>
                <div className="mt-8 flex h-48 items-end gap-3 border-b border-l border-slate-200 px-3 pb-2 dark:border-slate-700">
                    {metrica.pontos.map((ponto) => (
                        <div
                            key={ponto.label}
                            className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                        >
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                {ponto.valor} {metrica.unidade}
                            </span>
                            <div
                                className="w-full max-w-12 rounded-t-lg bg-emerald-500 dark:bg-emerald-600"
                                style={{ height: `${(ponto.valor / maiorValor) * 78}%` }}
                            />
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                {ponto.label}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}
