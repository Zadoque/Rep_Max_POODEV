export interface RotinaDashboard {
    id: number
    nome: string
    descricao: string
    exercicios: ExercicioRotina[]
    ultimaExecucao: string | null
    atualizadoEm: string
}

export interface ExercicioRotina {
    exercicioId: number
    quantidadeSeries: number
}

export type RotinaDashboardInput = Pick<RotinaDashboard, "nome" | "descricao" | "exercicios">

export interface PontoEvolucao {
    label: string
    valor: number
}

export type TipoMetricaHistorico = "volume" | "oneRepMax" | "carga" | "seriesRepeticoes"

export interface SerieMetricaHistorico {
    id: TipoMetricaHistorico
    titulo: string
    descricao: string
    unidade: string
    pontos: PontoEvolucao[]
    variacao: number
}

export interface MetricaExercicioHistorico {
    exercicioId: number
    carga: SerieMetricaHistorico
    oneRepMax: SerieMetricaHistorico
}

export interface HistoricoAluno {
    metricas: SerieMetricaHistorico[]
    metricasPorExercicio: MetricaExercicioHistorico[]
    treinos: Array<{
        id: number
        rotina: string
        data: string
        duracao: string
        status: string
    }>
}

export interface PerfilDashboard {
    email: string
    fotoUrl: string | null
    pesoKg: number
    alturaCm: number
    unidadePeso: "KG" | "LB"
    unidadeAltura: "CM" | "FT"
    notificacoesAtivas: boolean
    preferenciaTema: "CLARO" | "ESCURO"
}
