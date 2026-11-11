import { useState } from "react"

import type {
    ItemRotina,
    ItemRotinaExercicio,
    ItemRotinaTecnica,
    RotinaDashboardInput,
} from "../../types/aluno-dashboard"
import type { ExercicioCatalogo } from "../../types/exercicio"
import type { TipoTecnicaCombinada } from "../../types/treino-resumo"

export type GrupoTecnica = ItemRotinaTecnica
export type BlocoTreino =
    { tipo: "normal"; item: ItemRotinaExercicio } | { tipo: "grupo"; item: ItemRotinaTecnica }

export const tecnicasCombinadas: Array<{ valor: TipoTecnicaCombinada; rotulo: string }> = [
    { valor: "BI_SET", rotulo: "Bi-set" },
    { valor: "TRI_SET", rotulo: "Tri-set" },
    { valor: "MONSTER_SET", rotulo: "Monster set" },
]

export const quantidadeTecnica: Record<
    TipoTecnicaCombinada,
    { minimo: number; maximo?: number; rotulo: string }
> = {
    BI_SET: { minimo: 2, maximo: 2, rotulo: "bi-set" },
    TRI_SET: { minimo: 3, maximo: 3, rotulo: "tri-set" },
    MONSTER_SET: { minimo: 4, rotulo: "monster set" },
}

function tecnicaPorQuantidade(
    tipo: TipoTecnicaCombinada,
    quantidade: number,
): TipoTecnicaCombinada {
    if (quantidade >= 4) return "MONSTER_SET"
    if (quantidade === 3) return "TRI_SET"
    if (quantidade === 2) return "BI_SET"
    return tipo
}

function validarTecnicas(itens: ItemRotina[]) {
    for (const item of itens) {
        if (item.tipoItem !== "TECNICA") continue
        const regra = quantidadeTecnica[item.tipoTecnica]
        if (
            item.exercicios.length < regra.minimo ||
            (regra.maximo && item.exercicios.length > regra.maximo)
        ) {
            return `O ${regra.rotulo} precisa ter ${regra.maximo ? `exatamente ${regra.minimo}` : `${regra.minimo} ou mais`} exercícios.`
        }
    }
    return null
}

function proximoId() {
    return Date.now() + Math.floor(Math.random() * 1000)
}

export function useTreinoEditor(
    rotina: RotinaDashboardInput,
    exercicios: ExercicioCatalogo[],
    onChange: (rotina: RotinaDashboardInput) => void,
) {
    const [selecaoAdicionar, setSelecaoAdicionar] = useState("")
    const [grupoParaAdicionar, setGrupoParaAdicionar] = useState<GrupoTecnica | null>(null)
    const [exercicioParaTrocar, setExercicioParaTrocar] = useState<{
        exercicioId: number
        grupoId?: number
    } | null>(null)
    const [erroTecnica, setErroTecnica] = useState<string | null>(null)
    const [movimentoAnimado, setMovimentoAnimado] = useState<{
        itemId?: number
        exercicioId?: number
        direcao: "cima" | "baixo" | "esquerda" | "direita"
    } | null>(null)
    const exerciciosUsados = new Set(
        rotina.itens.flatMap((item) =>
            item.tipoItem === "EXERCICIO"
                ? [item.exercicioId]
                : item.exercicios.map((membro) => membro.exercicioId),
        ),
    )
    const exerciciosDisponiveis = exercicios.filter((item) => !exerciciosUsados.has(item.id))

    function adicionarSelecao() {
        if (!selecaoAdicionar) return
        const itens = [...rotina.itens]
        if (selecaoAdicionar.startsWith("TECNICA:")) {
            itens.push({
                id: proximoId(),
                tipoItem: "TECNICA",
                tipoTecnica: selecaoAdicionar.replace("TECNICA:", "") as TipoTecnicaCombinada,
                quantidadeSeries: 3,
                exercicios: [],
            })
        } else {
            itens.push({
                id: proximoId(),
                tipoItem: "EXERCICIO",
                exercicioId: Number(selecaoAdicionar),
                quantidadeSeries: 3,
                tipoTecnica: "NORMAL",
            })
        }
        onChange({ ...rotina, itens })
        setSelecaoAdicionar("")
    }

    function adicionarAoGrupo(exercicioId: number) {
        if (!grupoParaAdicionar) return
        const quantidade = grupoParaAdicionar.exercicios.length + 1
        const grupoAtualizado: ItemRotinaTecnica = {
            ...grupoParaAdicionar,
            tipoTecnica: tecnicaPorQuantidade(grupoParaAdicionar.tipoTecnica, quantidade),
            exercicios: [
                ...grupoParaAdicionar.exercicios,
                { exercicioId, ordemNoGrupo: quantidade },
            ],
        }
        onChange({
            ...rotina,
            itens: rotina.itens.map((item) =>
                item.id === grupoParaAdicionar.id ? grupoAtualizado : item,
            ),
        })
        setGrupoParaAdicionar(null)
    }

    function alterarSeries(itemId: number, variacao: number) {
        onChange({
            ...rotina,
            itens: rotina.itens.map((item) =>
                item.id === itemId
                    ? { ...item, quantidadeSeries: Math.max(1, item.quantidadeSeries + variacao) }
                    : item,
            ),
        })
    }

    function removerExercicio(exercicioId: number, grupoId?: number) {
        if (!grupoId) {
            onChange({ ...rotina, itens: rotina.itens.filter((item) => item.id !== exercicioId) })
            return
        }
        onChange({
            ...rotina,
            itens: rotina.itens.map((item) => {
                if (item.id !== grupoId || item.tipoItem !== "TECNICA") return item
                const membros = item.exercicios
                    .filter((membro) => membro.exercicioId !== exercicioId)
                    .map((membro, indice) => ({ ...membro, ordemNoGrupo: indice + 1 }))
                return {
                    ...item,
                    tipoTecnica: tecnicaPorQuantidade(item.tipoTecnica, membros.length),
                    exercicios: membros,
                }
            }),
        })
    }

    function trocarExercicio(exercicioAtualId: number, novoExercicioId: number, grupoId?: number) {
        onChange({
            ...rotina,
            itens: rotina.itens.map((item) => {
                if (!grupoId && item.tipoItem === "EXERCICIO" && item.id === exercicioAtualId)
                    return { ...item, exercicioId: novoExercicioId }
                if (grupoId && item.tipoItem === "TECNICA" && item.id === grupoId)
                    return {
                        ...item,
                        exercicios: item.exercicios.map((membro) =>
                            membro.exercicioId === exercicioAtualId
                                ? { ...membro, exercicioId: novoExercicioId }
                                : membro,
                        ),
                    }
                return item
            }),
        })
        setExercicioParaTrocar(null)
    }

    function moverNormal(itemId: number, direcao: "cima" | "baixo") {
        const indices = rotina.itens
            .map((item, indice) => (item.tipoItem === "EXERCICIO" ? indice : -1))
            .filter((indice) => indice >= 0)
        const atual = indices.findIndex((indice) => rotina.itens[indice].id === itemId)
        const destino = direcao === "cima" ? atual - 1 : atual + 1
        if (atual < 0 || destino < 0 || destino >= indices.length) return
        const itens = [...rotina.itens]
        ;[itens[indices[atual]], itens[indices[destino]]] = [
            itens[indices[destino]],
            itens[indices[atual]],
        ]
        setMovimentoAnimado({ itemId, direcao })
        window.setTimeout(() => {
            onChange({ ...rotina, itens })
            setMovimentoAnimado(null)
        }, 180)
    }

    function moverNoGrupo(exercicioId: number, grupoId: number, direcao: "esquerda" | "direita") {
        const grupo = rotina.itens.find(
            (item): item is ItemRotinaTecnica => item.tipoItem === "TECNICA" && item.id === grupoId,
        )
        if (!grupo) return
        const atual = grupo.exercicios.findIndex((item) => item.exercicioId === exercicioId)
        const destino = direcao === "esquerda" ? atual - 1 : atual + 1
        if (atual < 0 || destino < 0 || destino >= grupo.exercicios.length) return
        const membros = [...grupo.exercicios]
        ;[membros[atual], membros[destino]] = [membros[destino], membros[atual]]
        const ordenados = membros.map((item, indice) => ({ ...item, ordemNoGrupo: indice + 1 }))
        setMovimentoAnimado({ exercicioId, direcao })
        window.setTimeout(() => {
            onChange({
                ...rotina,
                itens: rotina.itens.map((item) =>
                    item.id === grupoId ? { ...grupo, exercicios: ordenados } : item,
                ),
            })
            setMovimentoAnimado(null)
        }, 180)
    }

    function moverGrupo(grupoId: number, direcao: "cima" | "baixo") {
        const atual = rotina.itens.findIndex((item) => item.id === grupoId)
        const destino = direcao === "cima" ? atual - 1 : atual + 1
        if (atual < 0 || destino < 0 || destino >= rotina.itens.length) return
        const itens = [...rotina.itens]
        ;[itens[atual], itens[destino]] = [itens[destino], itens[atual]]
        setMovimentoAnimado({ itemId: grupoId, direcao })
        window.setTimeout(() => {
            onChange({ ...rotina, itens })
            setMovimentoAnimado(null)
        }, 180)
    }

    function submeterTreino(
        evento: React.FormEvent<HTMLFormElement>,
        onSave: (evento: React.FormEvent<HTMLFormElement>) => void,
    ) {
        const erro = validarTecnicas(rotina.itens)
        if (erro) {
            evento.preventDefault()
            setErroTecnica(erro)
            return
        }
        setErroTecnica(null)
        onSave(evento)
    }

    return {
        selecaoAdicionar,
        setSelecaoAdicionar,
        grupoParaAdicionar,
        setGrupoParaAdicionar,
        exercicioParaTrocar,
        setExercicioParaTrocar,
        erroTecnica,
        movimentoAnimado,
        exerciciosDisponiveis,
        blocos: rotina.itens.map((item): BlocoTreino =>
            item.tipoItem === "TECNICA" ? { tipo: "grupo", item } : { tipo: "normal", item },
        ),
        adicionarSelecao,
        adicionarAoGrupo,
        alterarSeries,
        removerExercicio,
        trocarExercicio,
        moverNormal,
        moverNoGrupo,
        moverGrupo,
        submeterTreino,
    }
}

export type TreinoEditor = ReturnType<typeof useTreinoEditor>
