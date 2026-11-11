import { treinosMock } from "../mocks/treino-mock"
import type TreinoResumo from "../types/treino-resumo"
import type { SerieTreino } from "../types/treino-resumo"

const TREINOS_EXECUCAO_STORAGE_KEY = "rep-max:treinos-execucao"

type TreinosSalvos = Record<string, TreinoResumo[]>

function clonar<T>(valor: T): T {
    return structuredClone(valor)
}

function lerTreinosMock(): TreinosSalvos {
    const armazenados = localStorage.getItem(TREINOS_EXECUCAO_STORAGE_KEY)
    return armazenados ? (JSON.parse(armazenados) as TreinosSalvos) : {}
}

function salvarTreinosMock(treinos: TreinosSalvos) {
    localStorage.setItem(TREINOS_EXECUCAO_STORAGE_KEY, JSON.stringify(treinos))
}

export async function buscarTreinoExecucao(
    usuarioId: number,
    treinoId: number,
): Promise<TreinoResumo | null> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
        const salvos = lerTreinosMock()
        const salvo = salvos[String(usuarioId)]?.find((treino) => treino.id === treinoId)
        const mock = treinosMock.find(
            (treino) => treino.id === treinoId && treino.alunoId === usuarioId,
        )
        return salvo ? clonar(salvo) : mock ? clonar(mock) : null
    }

    // API futura: GET /api/alunos/{usuarioId}/treinos/{treinoId}/execucao
    return null
}

export async function salvarTreinoExecucao(treino: TreinoResumo): Promise<TreinoResumo> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
        const salvos = lerTreinosMock()
        const treinosUsuario = salvos[String(treino.alunoId)] ?? []
        salvos[String(treino.alunoId)] = [
            ...treinosUsuario.filter((atual) => atual.id !== treino.id),
            clonar(treino),
        ]
        salvarTreinosMock(salvos)
        return clonar(treino)
    }

    // API futura: PATCH /api/treinos/{treino.id}/execucao
    return treino
}

export function atualizarSerie(
    serie: SerieTreino,
    alteracoes: Partial<Pick<SerieTreino, "repeticoes" | "cargaKg" | "concluida">>,
): SerieTreino {
    return { ...serie, ...alteracoes }
}

export async function atualizarStatusTreino(
    treino: TreinoResumo,
    status: TreinoResumo["status"],
): Promise<TreinoResumo> {
    const atualizado = { ...treino, status }

    if (import.meta.env.VITE_USE_MOCK === "true") {
        return salvarTreinoExecucao(atualizado)
    }

    // API futura: PATCH /api/treinos/{treino.id}/status
    return atualizado
}

export async function finalizarTreino(
    treino: TreinoResumo,
    conclusao: NonNullable<TreinoResumo["conclusao"]>,
): Promise<TreinoResumo> {
    const atualizado = {
        ...treino,
        status: "FINALIZADO" as const,
        conclusao,
        fim: new Date().toISOString(),
    }

    if (import.meta.env.VITE_USE_MOCK === "true") {
        return salvarTreinoExecucao(atualizado)
    }

    // API futura: POST /api/treinos/{treino.id}/finalizar
    return atualizado
}
