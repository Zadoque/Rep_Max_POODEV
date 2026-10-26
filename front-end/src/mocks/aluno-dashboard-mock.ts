import type { PerfilDashboard, PontoEvolucao, RotinaDashboard } from "../types/aluno-dashboard"

export const rotinasDashboardMock: RotinaDashboard[] = [
    {
        id: 1,
        nome: "Treino A — Peito e tríceps",
        descricao: "Foco em força e volume para membros superiores.",
        quantidadeExercicios: 6,
        ultimaExecucao: "2026-10-12T20:05:00",
    },
    {
        id: 2,
        nome: "Treino B — Costas e bíceps",
        descricao: "Puxadas, remadas e exercícios complementares.",
        quantidadeExercicios: 5,
        ultimaExecucao: "2026-10-09T19:20:00",
    },
    {
        id: 3,
        nome: "Treino C — Pernas",
        descricao: "Rotina completa para quadríceps, posteriores e glúteos.",
        quantidadeExercicios: 7,
        ultimaExecucao: null,
    },
]

export const evolucaoMock: PontoEvolucao[] = [
    { label: "Jun", valor: 62 },
    { label: "Jul", valor: 68 },
    { label: "Ago", valor: 71 },
    { label: "Set", valor: 77 },
    { label: "Out", valor: 84 },
]

export const historicoTreinosMock = [
    { id: 101, rotina: "Treino A — Peito e tríceps", data: "2026-10-14T18:30:00", duracao: "42 min", status: "Pausado" },
    { id: 99, rotina: "Treino B — Costas e bíceps", data: "2026-10-12T19:10:00", duracao: "55 min", status: "Finalizado" },
    { id: 98, rotina: "Treino A — Peito e tríceps", data: "2026-10-09T18:45:00", duracao: "35 min", status: "Finalizado" },
]

export const perfilDashboardMock: PerfilDashboard = {
    email: "joao.silva@example.com",
    fotoUrl: null,
    pesoKg: 78.5,
    alturaCm: 178,
    unidadePeso: "KG",
    unidadeAltura: "CM",
    notificacoesAtivas: true,
    preferenciaTema: "CLARO",
}

export const rotinasDashboardMocksPorUsuario: Record<number, RotinaDashboard[]> = {
    1: rotinasDashboardMock,
    3: [
        { id: 4, nome: "Treino C — Pernas", descricao: "Rotina completa para quadríceps, posteriores e glúteos.", quantidadeExercicios: 7, ultimaExecucao: "2026-10-23T19:30:00" },
        { id: 5, nome: "Treino D — Ombros e abdômen", descricao: "Foco em estabilidade, ombros e fortalecimento do core.", quantidadeExercicios: 4, ultimaExecucao: null },
    ],
}

export const evolucoesMockPorUsuario: Record<number, PontoEvolucao[]> = {
    1: evolucaoMock,
    3: [
        { label: "Jun", valor: 48 },
        { label: "Jul", valor: 54 },
        { label: "Ago", valor: 51 },
        { label: "Set", valor: 63 },
        { label: "Out", valor: 70 },
    ],
}

export const historicosTreinosMockPorUsuario: Record<number, typeof historicoTreinosMock> = {
    1: historicoTreinosMock,
    3: [
        { id: 201, rotina: "Treino C — Pernas", data: "2026-10-26T18:00:00", duracao: "Próximo treino", status: "Agendado" },
        { id: 202, rotina: "Treino B — Costas e bíceps", data: "2026-10-23T18:40:00", duracao: "50 min", status: "Finalizado" },
    ],
}

export const perfisDashboardMockPorUsuario: Record<number, PerfilDashboard> = {
    1: perfilDashboardMock,
    3: {
        email: "carlos.oliveira@example.com",
        fotoUrl: null,
        pesoKg: 82,
        alturaCm: 181,
        unidadePeso: "KG",
        unidadeAltura: "CM",
        notificacoesAtivas: false,
        preferenciaTema: "ESCURO",
    },
}
