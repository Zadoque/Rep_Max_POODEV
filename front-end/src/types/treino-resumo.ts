export type StatusTreino = "EM_ANDAMENTO" | "PAUSADO" | "FINALIZADO"

export type ConclusaoTreino = "COMPLETA" | "PARCIAL"

export type TipoTecnica = "NORMAL" | "BI_SET" | "TRI_SET" | "MONSTER_SET" | "DROP_SET"

export type TipoTecnicaCombinada = Exclude<TipoTecnica, "NORMAL" | "DROP_SET">

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

export interface ItemTreinoExercicio {
    tipoItem: "EXERCICIO"
    exercicio: ExercicioTreino
}

export interface ItemTreinoTecnica {
    tipoItem: "TECNICA"
    tipoTecnica: TipoTecnicaCombinada
    quantidadeSeries: number
    exercicios: ExercicioTreino[]
}

export type ItemTreino = ItemTreinoExercicio | ItemTreinoTecnica

export default interface TreinoResumo {
    id: number
    alunoId: number
    status: StatusTreino
    inicio: string
    fim: string | null
    nomeRotina: string | null
    conclusao: ConclusaoTreino | null
    itens: ItemTreino[]
}
