import { useEffect, useState } from "react"
import ExercicioAnimacao from "../exercicios/ExercicioAnimacao"
import { buscarHistoricoAluno } from "../../services/aluno-dashboard"
import { buscarExercicios } from "../../services/aluno-dashboard"
import type { HistoricoAluno, TipoMetricaHistorico } from "../../types/aluno-dashboard"
import type { ExercicioCatalogo } from "../../types/exercicio"

type SecaoHistorico = "metricas" | "treinos"

const formatarData = (valor: string) =>
    new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(valor))

const nomesMetricas: Record<TipoMetricaHistorico, string> = {
    volume: "Volume total",
    oneRepMax: "1RM estimado",
    carga: "Carga por exercício",
    seriesRepeticoes: "Séries e repetições",
}

export default function HistoricoTab({ usuarioId }: { usuarioId: number }) {
    const [secaoAtiva, setSecaoAtiva] = useState<SecaoHistorico>("metricas")
    const [metricaAtiva, setMetricaAtiva] = useState<TipoMetricaHistorico>("volume")
    const [historico, setHistorico] = useState<HistoricoAluno | null>(null)
    const [exercicios, setExercicios] = useState<ExercicioCatalogo[]>([])
    const [exercicioAtivo, setExercicioAtivo] = useState(1)

    useEffect(() => {
        let ativo = true

        Promise.all([buscarHistoricoAluno(usuarioId), buscarExercicios()]).then(([historicoResposta, exerciciosResposta]) => {
            if (ativo) {
                setHistorico(historicoResposta)
                setExercicios(exerciciosResposta)
                setExercicioAtivo(exerciciosResposta[0]?.id ?? 1)
            }
        })

        return () => {
            ativo = false
        }
    }, [usuarioId])

    if (!historico) {
        return <p className="text-slate-600 dark:text-slate-300">Carregando seu histórico...</p>
    }

    const exercicio = exercicios.find((item) => item.id === exercicioAtivo)
    const metricaPorExercicio = historico.metricasPorExercicio.find((item) => item.exercicioId === exercicioAtivo)
    const metrica = metricaAtiva === "carga"
        ? metricaPorExercicio?.carga
        : metricaAtiva === "oneRepMax"
            ? metricaPorExercicio?.oneRepMax
            : historico.metricas.find((item) => item.id === metricaAtiva)

    if (!metrica) {
        return <p className="text-slate-600 dark:text-slate-300">Não há dados para esta métrica.</p>
    }

    const maiorValor = Math.max(...metrica.pontos.map((ponto) => ponto.valor), 1)

    return (
        <div className="space-y-6">
            <div className="flex justify-center md:justify-start">
                <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900" role="tablist" aria-label="Seção do histórico">
                    {(["metricas", "treinos"] as SecaoHistorico[]).map((secao) => (
                        <button
                            key={secao}
                            type="button"
                            role="tab"
                            aria-selected={secaoAtiva === secao}
                            onClick={() => setSecaoAtiva(secao)}
                            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${secaoAtiva === secao
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                }`}
                        >
                            {secao === "metricas" ? "Métricas" : "Treinos realizados"}
                        </button>
                    ))}
                </div>
            </div>

            <section>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">Acompanhe sua evolução</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Histórico</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-300">Veja sua consistência e acompanhe a evolução do seu desempenho.</p>
            </section>

            {secaoAtiva === "metricas" ? (
                <>
                    <div className="flex justify-center md:justify-start">
                        <div className="flex max-w-full flex-wrap justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900" role="tablist" aria-label="Métrica do histórico">
                            {historico.metricas.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={metricaAtiva === item.id}
                                    onClick={() => setMetricaAtiva(item.id)}
                                    className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${metricaAtiva === item.id
                                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                        }`}
                                >
                                    {nomesMetricas[item.id]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {(metricaAtiva === "carga" || metricaAtiva === "oneRepMax") && (
                        <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                            <label htmlFor="exercicio-historico" className="text-sm font-bold text-slate-950 dark:text-white">Escolha o exercício</label>
                            <select
                                id="exercicio-historico"
                                value={exercicioAtivo}
                                onChange={(evento) => setExercicioAtivo(Number(evento.target.value))}
                                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-emerald-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white md:max-w-xl"
                            >
                                {exercicios.map((item) => <option key={item.id} value={item.id}>{item.nome} · {item.grupoMuscular}</option>)}
                            </select>
                            {exercicio && (
                                <div className="mt-4 flex items-center gap-4">
                                    <ExercicioAnimacao exercicio={exercicio} />
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-950 dark:text-white">{exercicio.nome}</h2>
                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{exercicio.grupoMuscular} · {exercicio.equipamento}</p>
                                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{exercicio.instrucoesExecucao}</p>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-950 dark:text-white">{metrica.titulo}</h2>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{metrica.descricao}</p>
                            </div>
                            <strong className="text-2xl text-emerald-700 dark:text-emerald-400">+{metrica.variacao}%</strong>
                        </div>
                        <div className="mt-8 flex h-48 items-end gap-3 border-b border-l border-slate-200 px-3 pb-2 dark:border-slate-700">
                            {metrica.pontos.map((ponto) => (
                                <div key={ponto.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{ponto.valor} {metrica.unidade}</span>
                                    <div className="w-full max-w-12 rounded-t-lg bg-emerald-500 dark:bg-emerald-600" style={{ height: `${(ponto.valor / maiorValor) * 78}%` }} />
                                    <span className="text-xs text-slate-500 dark:text-slate-400">{ponto.label}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            ) : (
                <section>
                    <h2 className="text-xl font-bold text-slate-950 dark:text-white">Treinos realizados</h2>
                    <div className="mt-4 space-y-3">
                        {historico.treinos.map((treino) => (
                            <article key={treino.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                                <div>
                                    <h3 className="font-bold text-slate-950 dark:text-white">{treino.rotina}</h3>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formatarData(treino.data)} · {treino.duracao}</p>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-bold ${treino.status === "Pausado" ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"}`}>{treino.status}</span>
                            </article>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}
