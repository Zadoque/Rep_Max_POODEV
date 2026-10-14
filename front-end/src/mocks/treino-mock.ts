import type TreinoResumo from "../types/treino-resumo"

export interface TreinoMock extends TreinoResumo {
    alunoId: number
}

export const treinosMock: TreinoMock[] = [
    {
        id: 1,
        alunoId: 1,
        status: "PAUSADO",
        inicio: "2023-06-01T10:00:00Z",
        fim: null,
        nomeRotina: "Treino A"
    },
    {
        id: 2,
        alunoId: 1,
        status: "FINALIZADO",
        inicio: "2023-05-25T10:00:00Z",
        fim: "2023-05-25T11:00:00Z",
        nomeRotina: "Treino B"
    },
    {
        id: 3,
        alunoId: 3,
        status: "FINALIZADO_PARCIALMENTE",
        inicio: "2023-06-02T10:00:00Z",
        fim: "2023-06-02T10:30:00Z",
        nomeRotina: "Treino C"
    },
    {
        id: 4,
        alunoId: 3,
        status: "FINALIZADO_PARCIALMENTE",
        inicio: "2023-06-03T10:00:00Z",
        fim: "2023-06-03T10:30:00Z",
        nomeRotina: "Treino D"
    }

];  