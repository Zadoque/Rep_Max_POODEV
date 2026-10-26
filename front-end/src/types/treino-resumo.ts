export type StatusTreino =
    | "EM_ANDAMENTO"
    | "PAUSADO"
    | "NAO_INICIADO"
    | "FINALIZADO"
    | "FINALIZADO_PARCIALMENTE"

export type TipoTecnica =
    | "NORMAL"
    | "BI_SET"
    | "TRI_SET"
    | "MONSTER_SET"
    | "DROP_SET"

export interface SerieTreino {
    numero: number
    repeticoes: number
    cargaKg: number
    concluida: boolean
    tipoTecnica: TipoTecnica
}

export interface ExercicioTreino {
    id: number
    nome: string
    grupoMuscular: string
    series: SerieTreino[]
}

export default interface TreinoResumo {
    id: number
    alunoId: number
    status: StatusTreino
    inicio: string
    fim: string | null
    nomeRotina: string | null
    exercicios: ExercicioTreino[]
}
