import { useCallback } from "react"

import {
    atualizarSerie,
    atualizarStatusTreino,
    finalizarTreino,
    salvarTreinoExecucao,
} from "../services/execucao-treino"
import type TreinoResumo from "../types/treino-resumo"

type AlteracoesSerie = { repeticoes?: number; cargaKg?: number }

interface Opcoes {
    treino: TreinoResumo | null
    concluidas: number
    planejadas: number
    setTreino: (treino: TreinoResumo) => void
    setMensagem: (mensagem: string | null) => void
    fecharMenu: () => void
}

export function useExecucaoTreino({
    treino,
    concluidas,
    planejadas,
    setTreino,
    setMensagem,
    fecharMenu,
}: Opcoes) {
    const persistir = useCallback(
        async (atualizado: TreinoResumo, texto: string) => {
            const salvo = await salvarTreinoExecucao(atualizado)
            setTreino(salvo)
            setMensagem(texto)
            window.setTimeout(() => setMensagem(null), 2200)
        },
        [setMensagem, setTreino],
    )

    const atualizarExercicio = useCallback(
        (exercicioId: number, numero: number, alteracoes: AlteracoesSerie) => {
            if (!treino) return
            const itens = treino.itens.map((item) => {
                if (item.tipoItem === "EXERCICIO" && item.exercicio.id === exercicioId) {
                    return {
                        ...item,
                        exercicio: {
                            ...item.exercicio,
                            series: item.exercicio.series.map((serie) =>
                                serie.numero === numero ? atualizarSerie(serie, alteracoes) : serie,
                            ),
                        },
                    }
                }
                if (item.tipoItem === "TECNICA") {
                    return {
                        ...item,
                        exercicios: item.exercicios.map((exercicio) =>
                            exercicio.id !== exercicioId
                                ? exercicio
                                : {
                                      ...exercicio,
                                      series: exercicio.series.map((serie) =>
                                          serie.numero === numero
                                              ? atualizarSerie(serie, alteracoes)
                                              : serie,
                                      ),
                                  },
                        ),
                    }
                }
                return item
            })
            setTreino({ ...treino, itens })
        },
        [setTreino, treino],
    )

    const registrarSeries = useCallback(
        async (exercicioIds: number[], numero: number) => {
            if (!treino) return
            const ids = new Set(exercicioIds)
            const itens = treino.itens.map((item) => {
                if (item.tipoItem === "EXERCICIO" && ids.has(item.exercicio.id)) {
                    return {
                        ...item,
                        exercicio: {
                            ...item.exercicio,
                            series: item.exercicio.series.map((serie, indice) =>
                                serie.numero === numero
                                    ? { ...serie, concluida: true }
                                    : indice === numero && !serie.concluida
                                      ? {
                                            ...serie,
                                            repeticoes:
                                                item.exercicio.series[numero - 1]?.repeticoes ??
                                                serie.repeticoes,
                                        }
                                      : serie,
                            ),
                        },
                    }
                }
                if (item.tipoItem === "TECNICA") {
                    return {
                        ...item,
                        exercicios: item.exercicios.map((exercicio) =>
                            !ids.has(exercicio.id)
                                ? exercicio
                                : {
                                      ...exercicio,
                                      series: exercicio.series.map((serie, indice) =>
                                          serie.numero === numero
                                              ? { ...serie, concluida: true }
                                              : indice === numero && !serie.concluida
                                                ? {
                                                      ...serie,
                                                      repeticoes:
                                                          exercicio.series[numero - 1]
                                                              ?.repeticoes ?? serie.repeticoes,
                                                  }
                                                : serie,
                                      ),
                                  },
                        ),
                    }
                }
                return item
            })
            await persistir({ ...treino, itens, status: "EM_ANDAMENTO" }, `Série ${numero} salva`)
        },
        [persistir, treino],
    )

    const registrarSerie = useCallback(
        (exercicioId: number, numero: number) => registrarSeries([exercicioId], numero),
        [registrarSeries],
    )

    const alternarPausa = useCallback(async () => {
        if (!treino) return
        const status = treino.status === "PAUSADO" ? "EM_ANDAMENTO" : "PAUSADO"
        const atualizado = await atualizarStatusTreino(treino, status)
        setTreino(atualizado)
        setMensagem(status === "PAUSADO" ? "Treino pausado" : "Treino retomado")
    }, [setMensagem, setTreino, treino])

    const concluir = useCallback(async () => {
        if (!treino) return
        const conclusao = concluidas >= planejadas ? "COMPLETA" : "PARCIAL"
        const atualizado = await finalizarTreino(treino, conclusao)
        setTreino(atualizado)
        setMensagem(
            conclusao === "COMPLETA" ? "Treino concluído" : "Treino finalizado parcialmente",
        )
        fecharMenu()
    }, [concluidas, fecharMenu, planejadas, setMensagem, setTreino, treino])

    return {
        atualizarExercicio,
        registrarSerie,
        registrarSeries,
        alternarPausa,
        concluir,
        persistir,
    }
}
