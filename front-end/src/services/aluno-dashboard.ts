import {
    historicosDashboardMockPorUsuario,
    perfilDashboardMock,
    rotinasDashboardMock,
    rotinasDashboardMocksPorUsuario,
} from "../mocks/aluno-dashboard-mock"
import { resumoHomeAlunoMock } from "../mocks/aluno-home-page-mock"
import { exerciciosMock } from "../mocks/exercicios-mock"
import type {
    HistoricoAluno,
    RotinaDashboard,
    RotinaDashboardInput,
} from "../types/aluno-dashboard"
import type { ExercicioCatalogo } from "../types/exercicio"

const ROTINAS_STORAGE_KEY = "rep-max:rotinas-estruturadas"

type RotinasSalvas = Record<string, RotinaDashboard[]>

function lerRotinasMock(usuarioId: number): RotinaDashboard[] {
    const rotinasIniciais =
        rotinasDashboardMocksPorUsuario[usuarioId] ?? rotinasDashboardMocksPorUsuario[1]
    const rotinasSalvas = localStorage.getItem(ROTINAS_STORAGE_KEY)

    if (!rotinasSalvas) {
        const dadosIniciais: RotinasSalvas = { [usuarioId]: rotinasIniciais }
        localStorage.setItem(ROTINAS_STORAGE_KEY, JSON.stringify(dadosIniciais))
        return rotinasIniciais
    }

    const dados = JSON.parse(rotinasSalvas) as RotinasSalvas

    if (!dados[usuarioId]) {
        dados[usuarioId] = rotinasIniciais
        localStorage.setItem(ROTINAS_STORAGE_KEY, JSON.stringify(dados))
    }

    return dados[usuarioId]
}

function salvarRotinasMock(usuarioId: number, rotinas: RotinaDashboard[]) {
    const rotinasSalvas = localStorage.getItem(ROTINAS_STORAGE_KEY)
    const dados = rotinasSalvas ? (JSON.parse(rotinasSalvas) as RotinasSalvas) : {}
    dados[usuarioId] = rotinas
    localStorage.setItem(ROTINAS_STORAGE_KEY, JSON.stringify(dados))
}

export async function buscarResumoAluno() {
    if (import.meta.env.VITE_USE_MOCK === "true") {
        return resumoHomeAlunoMock
    }

    // API futura: GET /api/alunos/{id}/resumo
    return resumoHomeAlunoMock
}

export async function buscarRotinasAluno(usuarioId: number): Promise<RotinaDashboard[]> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
        return lerRotinasMock(usuarioId)
    }

    // API futura: GET /api/alunos/{id}/rotinas
    return rotinasDashboardMocksPorUsuario[usuarioId] ?? rotinasDashboardMock
}

export async function criarRotinaAluno(
    usuarioId: number,
    dadosRotina: RotinaDashboardInput,
): Promise<RotinaDashboard> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
        const rotinas = lerRotinasMock(usuarioId)
        const agora = new Date().toISOString()
        const novaRotina: RotinaDashboard = {
            id: Date.now(),
            ...dadosRotina,
            ultimaExecucao: null,
            atualizadoEm: agora,
        }
        salvarRotinasMock(usuarioId, [...rotinas, novaRotina])
        return novaRotina
    }

    // API futura: POST /api/alunos/{id}/rotinas
    return {
        id: Date.now(),
        ...dadosRotina,
        ultimaExecucao: null,
        atualizadoEm: new Date().toISOString(),
    }
}

export async function atualizarRotinaAluno(
    usuarioId: number,
    rotinaId: number,
    dadosRotina: RotinaDashboardInput,
): Promise<RotinaDashboard> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
        const rotinas = lerRotinasMock(usuarioId)
        const rotinaAtual = rotinas.find((rotina) => rotina.id === rotinaId)

        if (!rotinaAtual) {
            throw new Error("Treino não encontrado")
        }

        const rotinaAtualizada: RotinaDashboard = {
            ...rotinaAtual,
            ...dadosRotina,
            atualizadoEm: new Date().toISOString(),
        }
        salvarRotinasMock(
            usuarioId,
            rotinas.map((rotina) => (rotina.id === rotinaId ? rotinaAtualizada : rotina)),
        )
        return rotinaAtualizada
    }

    // API futura: PUT /api/alunos/{id}/rotinas/{rotinaId}
    return {
        id: rotinaId,
        ...dadosRotina,
        ultimaExecucao: null,
        atualizadoEm: new Date().toISOString(),
    }
}

export async function buscarHistoricoAluno(usuarioId: number): Promise<HistoricoAluno> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
        return historicosDashboardMockPorUsuario[usuarioId] ?? historicosDashboardMockPorUsuario[1]
    }

    // API futura: GET /api/alunos/{id}/historico e /api/alunos/{id}/progresso
    return historicosDashboardMockPorUsuario[usuarioId] ?? historicosDashboardMockPorUsuario[1]
}

export async function buscarExercicios(): Promise<ExercicioCatalogo[]> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
        return exerciciosMock
    }

    // API futura: GET /api/exercicios
    return exerciciosMock
}

export async function buscarPerfilAluno() {
    if (import.meta.env.VITE_USE_MOCK === "true") {
        return perfilDashboardMock
    }

    // API futura: GET /api/alunos/{id}/perfil
    return perfilDashboardMock
}
