import { evolucaoMock, historicoTreinosMock, perfilDashboardMock, rotinasDashboardMock } from "../mocks/aluno-dashboard-mock"
import { resumoHomeAlunoMock } from "../mocks/aluno-home-page-mock"

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

export async function buscarHistoricoAluno() {
    if (import.meta.env.VITE_USE_MOCK === "true") {
        return { evolucao: evolucaoMock, treinos: historicoTreinosMock }
    }

    // API futura: GET /api/alunos/{id}/historico e /api/alunos/{id}/progresso
    return { evolucao: evolucaoMock, treinos: historicoTreinosMock }
}

export async function buscarPerfilAluno() {
    if (import.meta.env.VITE_USE_MOCK === "true") {
        return perfilDashboardMock
    }

    // API futura: GET /api/alunos/{id}/perfil
    return perfilDashboardMock
}
