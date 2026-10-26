export interface ExercicioCatalogo {
    id: number
    slug: string
    nome: string
    grupoMuscular: string
    equipamento: string
    descricao: string
    instrucoesExecucao: string
    midia: {
        animacao: string
        animacaoLenta: string
        animacaoRapida: string
        creditos: string
        licenca: string
    }
    ativo: boolean
}
