import type ResumoHomeAluno from "../types/resumo-home-aluno"

export const resumosHomeAlunoMock: Record<number, ResumoHomeAluno> = {
    1: {
        treinoAtual: {
            id: 101,
            status: "PAUSADO",
            inicio: "2026-10-14T18:30:00",
            nomeRotina: "Treino A — Peito e tríceps",
        },
        rotinasAtivas: [
            { id: 1, nome: "Treino A — Peito e tríceps", quantidadeExercicios: 6 },
            { id: 2, nome: "Treino B — Costas e bíceps", quantidadeExercicios: 5 },
            { id: 3, nome: "Treino C — Pernas", quantidadeExercicios: 7 },
        ],
        ultimoTreino: {
            id: 99,
            data: "2026-10-12T20:05:00",
            nomeRotina: "Treino B — Costas e bíceps",
        },
    },
    3: {
        treinoAtual: null,
        rotinasAtivas: [
            { id: 4, nome: "Treino C — Pernas", quantidadeExercicios: 7 },
            { id: 5, nome: "Treino D — Ombros e abdômen", quantidadeExercicios: 4 },
        ],
        ultimoTreino: {
            id: 202,
            data: "2026-10-23T19:30:00",
            nomeRotina: "Treino B — Costas e bíceps",
        },
    },
}

export const resumoHomeAlunoMock = resumosHomeAlunoMock[1]
