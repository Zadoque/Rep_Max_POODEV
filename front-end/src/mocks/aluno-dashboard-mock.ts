import type { HistoricoAluno, MetricaExercicioHistorico, PerfilDashboard, PontoEvolucao, RotinaDashboard, SerieMetricaHistorico } from "../types/aluno-dashboard"
import { exerciciosMock } from "./exercicios-mock"

export const rotinasDashboardMock: RotinaDashboard[] = [
    {
        id: 1,
        nome: "Treino A — Peito e tríceps",
        descricao: "Foco em força e volume para membros superiores.",
        exercicios: [
            { exercicioId: 1, quantidadeSeries: 4 },
            { exercicioId: 2, quantidadeSeries: 3 },
            { exercicioId: 6, quantidadeSeries: 3 },
            { exercicioId: 9, quantidadeSeries: 3 },
            { exercicioId: 26, quantidadeSeries: 3 },
            { exercicioId: 27, quantidadeSeries: 3 },
        ],
        ultimaExecucao: "2026-10-12T20:05:00",
        atualizadoEm: "2026-10-12T20:05:00",
    },
    {
        id: 2,
        nome: "Treino B — Costas e bíceps",
        descricao: "Puxadas, remadas e exercícios complementares.",
        exercicios: [
            { exercicioId: 10, quantidadeSeries: 4 },
            { exercicioId: 12, quantidadeSeries: 3 },
            { exercicioId: 13, quantidadeSeries: 3 },
            { exercicioId: 14, quantidadeSeries: 3 },
            { exercicioId: 21, quantidadeSeries: 3 },
        ],
        ultimaExecucao: "2026-10-09T19:20:00",
        atualizadoEm: "2026-10-09T19:20:00",
    },
    {
        id: 3,
        nome: "Treino C — Pernas",
        descricao: "Rotina completa para quadríceps, posteriores e glúteos.",
        exercicios: [
            { exercicioId: 36, quantidadeSeries: 4 },
            { exercicioId: 37, quantidadeSeries: 4 },
            { exercicioId: 38, quantidadeSeries: 3 },
            { exercicioId: 39, quantidadeSeries: 3 },
            { exercicioId: 40, quantidadeSeries: 3 },
            { exercicioId: 41, quantidadeSeries: 3 },
            { exercicioId: 42, quantidadeSeries: 3 },
        ],
        ultimaExecucao: null,
        atualizadoEm: "2026-10-01T12:00:00",
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
        { id: 4, nome: "Treino C — Pernas", descricao: "Rotina completa para quadríceps, posteriores e glúteos.", exercicios: [{ exercicioId: 36, quantidadeSeries: 4 }, { exercicioId: 39, quantidadeSeries: 4 }, { exercicioId: 42, quantidadeSeries: 3 }], ultimaExecucao: "2026-10-23T19:30:00", atualizadoEm: "2026-10-23T19:30:00" },
        { id: 5, nome: "Treino D — Ombros e abdômen", descricao: "Foco em estabilidade, ombros e fortalecimento do core.", exercicios: [{ exercicioId: 30, quantidadeSeries: 3 }, { exercicioId: 32, quantidadeSeries: 3 }, { exercicioId: 49, quantidadeSeries: 3 }], ultimaExecucao: null, atualizadoEm: "2026-10-03T08:00:00" },
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

const metricasHistoricoMock: SerieMetricaHistorico[] = [
    {
        id: "volume",
        titulo: "Volume total",
        descricao: "Soma das cargas levantadas nos últimos meses.",
        unidade: "kg",
        pontos: evolucaoMock,
        variacao: 35,
    },
    {
        id: "oneRepMax",
        titulo: "1RM estimado",
        descricao: "Estimativa da sua repetição máxima por sessão.",
        unidade: "kg",
        pontos: [
            { label: "Jun", valor: 82 }, { label: "Jul", valor: 86 }, { label: "Ago", valor: 88 }, { label: "Set", valor: 94 }, { label: "Out", valor: 98 },
        ],
        variacao: 19,
    },
    {
        id: "carga",
        titulo: "Carga por exercício",
        descricao: "Maior carga registrada por sessão nos exercícios acompanhados.",
        unidade: "kg",
        pontos: [
            { label: "Jun", valor: 40 }, { label: "Jul", valor: 42 }, { label: "Ago", valor: 45 }, { label: "Set", valor: 47 }, { label: "Out", valor: 50 },
        ],
        variacao: 25,
    },
    {
        id: "seriesRepeticoes",
        titulo: "Séries e repetições",
        descricao: "Quantidade de séries e repetições concluídas por sessão.",
        unidade: "reps",
        pontos: [
            { label: "Jun", valor: 54 }, { label: "Jul", valor: 61 }, { label: "Ago", valor: 58 }, { label: "Set", valor: 69 }, { label: "Out", valor: 74 },
        ],
        variacao: 37,
    },
]

const metricasHistoricoMockCarlos: SerieMetricaHistorico[] = metricasHistoricoMock.map((metrica, indice) => ({
    ...metrica,
    pontos: metrica.pontos.map((ponto, pontoIndice) => ({
        ...ponto,
        valor: Math.max(1, ponto.valor - 12 + indice * 3 + pontoIndice),
    })),
    variacao: [46, 24, 18, 31][indice],
}))

const criarMetricasPorExercicio = (multiplicador: number): MetricaExercicioHistorico[] => exerciciosMock.map((exercicio) => {
    const base = 20 + ((exercicio.id * 7) % 80)
    const pontosCarga = [0, 1, 2, 3, 4].map((mes) => ({ label: ["Jun", "Jul", "Ago", "Set", "Out"][mes], valor: base + mes * multiplicador }))
    const pontosOneRepMax = pontosCarga.map((ponto) => ({ ...ponto, valor: Math.round(ponto.valor * 1.25) }))

    return {
        exercicioId: exercicio.id,
        carga: {
            id: "carga",
            titulo: `Carga — ${exercicio.nome}`,
            descricao: `Maior carga registrada mensalmente em ${exercicio.nome}.`,
            unidade: "kg",
            pontos: pontosCarga,
            variacao: Math.round((multiplicador / base) * 400),
        },
        oneRepMax: {
            id: "oneRepMax",
            titulo: `1RM estimado — ${exercicio.nome}`,
            descricao: `Evolução mensal do 1RM estimado em ${exercicio.nome}, pela fórmula de Epley.`,
            unidade: "kg",
            pontos: pontosOneRepMax,
            variacao: Math.round((multiplicador / base) * 400),
        },
    }
})

export const historicosDashboardMockPorUsuario: Record<number, HistoricoAluno> = {
    1: { metricas: metricasHistoricoMock, metricasPorExercicio: criarMetricasPorExercicio(4), treinos: historicoTreinosMock },
    3: { metricas: metricasHistoricoMockCarlos, metricasPorExercicio: criarMetricasPorExercicio(3), treinos: historicosTreinosMockPorUsuario[3] },
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
