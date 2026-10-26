import { historicosDashboardMockPorUsuario, perfilDashboardMock, rotinasDashboardMock } from "../mocks/aluno-dashboard-mock"
import { exerciciosMock } from "../mocks/exercicios-mock"
import { resumoHomeAlunoMock } from "../mocks/aluno-home-page-mock"
import type { ExercicioCatalogo } from "../types/exercicio"
import type { HistoricoAluno } from "../types/aluno-dashboard"

export async function buscarResumoAluno() {
    if (import.meta.env.VITE_USE_MOCK === "true") {
        return resumoHomeAlunoMock
    }

    // API futura: GET /api/alunos/{id}/resumo
    return resumoHomeAlunoMock
}

export async function buscarRotinasAluno() {
    if (import.meta.env.VITE_USE_MOCK === "true") {
        return rotinasDashboardMock
    }

    // API futura: GET /api/alunos/{id}/rotinas
    return rotinasDashboardMock
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
