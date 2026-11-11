import { useEffect, useState } from "react"

import { buscarExercicios, buscarHistoricoAluno } from "../../services/aluno-dashboard"
import type { HistoricoAluno, TipoMetricaHistorico } from "../../types/aluno-dashboard"
import type { ExercicioCatalogo } from "../../types/exercicio"
import HistoricoMetricas from "../historico/HistoricoMetricas"
import HistoricoSecaoTabs, { type SecaoHistorico } from "../historico/HistoricoSecaoTabs"
import HistoricoTreinos from "../historico/HistoricoTreinos"

export default function HistoricoTab({ usuarioId }: { usuarioId: number }) {
    const [secaoAtiva, setSecaoAtiva] = useState<SecaoHistorico>("metricas")
    const [metricaAtiva, setMetricaAtiva] = useState<TipoMetricaHistorico>("volume")
    const [historico, setHistorico] = useState<HistoricoAluno | null>(null)
    const [exercicios, setExercicios] = useState<ExercicioCatalogo[]>([])
    const [exercicioAtivo, setExercicioAtivo] = useState(1)

    useEffect(() => {
        let ativo = true
        Promise.all([buscarHistoricoAluno(usuarioId), buscarExercicios()]).then(
            ([historicoResposta, exerciciosResposta]) => {
                if (!ativo) return
                setHistorico(historicoResposta)
                setExercicios(exerciciosResposta)
                setExercicioAtivo(exerciciosResposta[0]?.id ?? 1)
            },
        )
        return () => {
            ativo = false
        }
    }, [usuarioId])

    if (!historico)
        return <p className="text-slate-600 dark:text-slate-300">Carregando seu histórico...</p>
    return (
        <div className="space-y-6">
            <HistoricoSecaoTabs ativa={secaoAtiva} onChange={setSecaoAtiva} />
            <section>
                <p className="text-sm font-semibold uppercase tracking-brand text-emerald-700 dark:text-emerald-400">
                    Acompanhe sua evolução
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                    Histórico
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-300">
                    Veja sua consistência e acompanhe a evolução do seu desempenho.
                </p>
            </section>
            {secaoAtiva === "metricas" ? (
                <HistoricoMetricas
                    historico={historico}
                    metricaAtiva={metricaAtiva}
                    setMetricaAtiva={setMetricaAtiva}
                    exercicios={exercicios}
                    exercicioAtivo={exercicioAtivo}
                    setExercicioAtivo={setExercicioAtivo}
                />
            ) : (
                <HistoricoTreinos treinos={historico.treinos} />
            )}
        </div>
    )
}
