import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router"

import {
    encontrarProximoItem,
    seriesConcluidas,
    seriesPlanejadas,
} from "../components/execucao/execucao-utils"
import ExecucaoCabecalho from "../components/execucao/ExecucaoCabecalho"
import ExecucaoTreinoConteudo from "../components/execucao/ExecucaoTreinoConteudo"
import { useAutenticacao } from "../hooks/use-autenticacao"
import { buscarExercicios } from "../services/aluno-dashboard"
import {
    atualizarSerie,
    atualizarStatusTreino,
    buscarTreinoExecucao,
    finalizarTreino,
    salvarTreinoExecucao,
} from "../services/execucao-treino"
import type TreinoResumo from "../types/treino-resumo"

export default function ExecucaoTreinoPage() {
    const { usuario } = useAutenticacao()
    const { treinoId } = useParams()
    const navigate = useNavigate()
    const [treino, setTreino] = useState<TreinoResumo | null>(null)
    const [exercicios, setExercicios] = useState<Awaited<ReturnType<typeof buscarExercicios>>>([])
    const [mensagem, setMensagem] = useState<string | null>(null)
    const [menuAberto, setMenuAberto] = useState(false)
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        if (!usuario || !treinoId) return
        Promise.all([buscarTreinoExecucao(usuario.id, Number(treinoId)), buscarExercicios()]).then(
            ([treinoResposta, exerciciosResposta]) => {
                setTreino(treinoResposta)
                setExercicios(exerciciosResposta)
                setCarregando(false)
            },
        )
    }, [treinoId, usuario])

    const planejadas = useMemo(() => (treino ? seriesPlanejadas(treino.itens) : 0), [treino])
    const concluidas = useMemo(() => (treino ? seriesConcluidas(treino.itens) : 0), [treino])
    const proximo = useMemo(
        () => (treino ? encontrarProximoItem(treino.itens) : "Carregando treino"),
        [treino],
    )

    if (carregando) {
        return (
            <main className="p-6 text-center text-slate-600 dark:text-slate-300">
                Carregando treino...
            </main>
        )
    }

    if (!treino) {
        return (
            <main className="mx-auto max-w-xl p-6 text-center">
                <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
                    Treino não encontrado
                </h1>
                <button
                    type="button"
                    onClick={() => navigate("/app")}
                    className="mt-5 min-h-11 rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 motion-reduce:transition-none"
                >
                    Voltar para o início
                </button>
            </main>
        )
    }

    async function persistir(atualizado: TreinoResumo, texto: string) {
        const salvo = await salvarTreinoExecucao(atualizado)
        setTreino(salvo)
        setMensagem(texto)
        window.setTimeout(() => setMensagem(null), 2200)
    }

    function atualizarExercicio(
        exercicioId: number,
        numero: number,
        alteracoes: { repeticoes?: number; cargaKg?: number },
    ) {
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
    }

    async function registrarSerie(exercicioId: number, numero: number) {
        if (!treino) return
        const itens = treino.itens.map((item) => {
            if (item.tipoItem === "EXERCICIO" && item.exercicio.id === exercicioId) {
                const series = item.exercicio.series.map((serie, indice) =>
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
                )
                return { ...item, exercicio: { ...item.exercicio, series } }
            }
            if (item.tipoItem === "TECNICA") {
                return {
                    ...item,
                    exercicios: item.exercicios.map((exercicio) =>
                        exercicio.id !== exercicioId
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
                                                      exercicio.series[numero - 1]?.repeticoes ??
                                                      serie.repeticoes,
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
    }

    async function alternarPausa() {
        if (!treino) return
        const status = treino.status === "PAUSADO" ? "EM_ANDAMENTO" : "PAUSADO"
        const atualizado = await atualizarStatusTreino(treino, status)
        setTreino(atualizado)
        setMensagem(status === "PAUSADO" ? "Treino pausado" : "Treino retomado")
    }

    async function concluir() {
        if (!treino) return
        const conclusao = concluidas >= planejadas ? "COMPLETA" : "PARCIAL"
        const atualizado = await finalizarTreino(treino, conclusao)
        setTreino(atualizado)
        setMensagem(
            conclusao === "COMPLETA" ? "Treino concluído" : "Treino finalizado parcialmente",
        )
        setMenuAberto(false)
    }

    return (
        <div className="min-h-screen min-w-0 overflow-x-hidden bg-brand-ice text-slate-900 dark:bg-brand-night dark:text-slate-100">
            <ExecucaoCabecalho
                nome={treino.nomeRotina ?? "Treino"}
                status={treino.status}
                menuAberto={menuAberto}
                onVoltar={() => navigate("/app")}
                onPausar={alternarPausa}
                onRetomar={alternarPausa}
                onFinalizar={concluir}
                onAlternarMenu={() => setMenuAberto((aberto) => !aberto)}
            />
            <ExecucaoTreinoConteudo
                treino={treino}
                exercicios={exercicios}
                proximo={proximo}
                concluidas={concluidas}
                planejadas={planejadas}
                mensagem={mensagem}
                onAlterarSerie={atualizarExercicio}
                onRegistrarSerie={registrarSerie}
            />
        </div>
    )
}
