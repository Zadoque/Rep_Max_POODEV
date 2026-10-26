export interface ExercicioCatalogo {
    id: number
    slug: string
    nome: string
    grupoMuscular: string
    equipamento: string
    descricao: string
    instrucoesExecucao: string
    midia: {
        frames: [string, string, string]
        creditos: string
        licenca: string
    }
    ativo: boolean
}
