export default interface ResumoHomeAluno {
    treinoAtual: {
      id: number
      status: "EM_ANDAMENTO" | "PAUSADO" | "NAO_INICIADO"
      inicio: string
      nomeRotina: string | null
    } | null

    rotinasAtivas: {
      id: number
      nome: string
      quantidadeExercicios: number
    }[]

    ultimoTreino: {
      id: number
      data: string
      nomeRotina: string | null
    } | null
  }