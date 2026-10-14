export type StatusTreino =
    | "EM_ANDAMENTO"
    | "PAUSADO"
    | "NAO_INICIADO"
    | "FINALIZADO"
    | "FINALIZADO_PARCIALMENTE"
    

export default interface TreinoResumo {
    id: number
    status: StatusTreino
    inicio: string
    fim: string | null
    nomeRotina: string | null
}