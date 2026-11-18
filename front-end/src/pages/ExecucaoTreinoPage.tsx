import { type FormEvent, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router"

import { aplicarRotinaAoTreino, treinoParaRotina } from "../components/execucao/execucao-editor"
import {
    encontrarProximoItem,
    seriesConcluidas,
    seriesPlanejadas,
} from "../components/execucao/execucao-utils"
import ExecucaoCabecalho from "../components/execucao/ExecucaoCabecalho"
import ExecucaoTreinoConteudo from "../components/execucao/ExecucaoTreinoConteudo"
import ModalTreino from "../components/treinos/ModalTreino"
import { useAutenticacao } from "../hooks/use-autenticacao"
import { useExecucaoTreino } from "../hooks/use-execucao-treino"
import { buscarExercicios } from "../services/aluno-dashboard"
import { buscarTreinoExecucao } from "../services/execucao-treino"
import type { RotinaDashboardInput } from "../types/aluno-dashboard"
import type TreinoResumo from "../types/treino-resumo"

export default function ExecucaoTreinoPage() {
    const { usuario } = useAutenticacao()
    const { treinoId } = useParams()
    const navigate = useNavigate()
    const [treino, setTreino] = useState<TreinoResumo | null>(null)
    const [exercicios, setExercicios] = useState<Awaited<ReturnType<typeof buscarExercicios>>>([])
    const [mensagem, setMensagem] = useState<string | null>(null)
    const [menuAberto, setMenuAberto] = useState(false)
    const [rotinaEdicao, setRotinaEdicao] = useState<RotinaDashboardInput | null>(null)
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

    const {
        atualizarExercicio,
        registrarSerie,
        registrarSeries,
        alternarPausa,
        concluir,
        persistir,
    } = useExecucaoTreino({
        treino,
        concluidas,
        planejadas,
        setTreino,
        setMensagem,
        fecharMenu: () => setMenuAberto(false),
    })

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

    function abrirEdicao() {
        if (!treino) return
        setRotinaEdicao(treinoParaRotina(treino))
        setMenuAberto(false)
    }

    async function salvarEdicao(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault()
        if (!treino || !rotinaEdicao) return
        const atualizado = aplicarRotinaAoTreino(treino, rotinaEdicao, exercicios)
        await persistir(atualizado, "Treino atualizado")
        setRotinaEdicao(null)
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
                onEditar={abrirEdicao}
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
                onRegistrarGrupoSerie={registrarSeries}
            />
            {rotinaEdicao && (
                <ModalTreino
                    modo="editar"
                    rotina={rotinaEdicao}
                    exercicios={exercicios}
                    atualizadoEm={treino.inicio}
                    onChange={setRotinaEdicao}
                    onClose={() => setRotinaEdicao(null)}
                    onSave={salvarEdicao}
                />
            )}
        </div>
    )
}
