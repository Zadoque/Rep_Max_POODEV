export interface RotinaDashboard {
    id: number
    nome: string
    descricao: string
    quantidadeExercicios: number
    ultimaExecucao: string | null
}

export interface PontoEvolucao {
    label: string
    valor: number
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
