import type TreinoResumo from "../types/treino-resumo"
import type { ExercicioTreino, ItemTreino, TipoTecnica } from "../types/treino-resumo"

const serie = (
    numero: number,
    repeticoes: number,
    cargaKg: number,
    concluida: boolean,
    tipoTecnica: TipoTecnica = "NORMAL",
) => ({ numero, repeticoes, cargaKg, concluida, tipoTecnica })
const exercicio = (
    id: number,
    nome: string,
    grupoMuscular: string,
    series: ExercicioTreino["series"],
): ExercicioTreino => ({ id, nome, grupoMuscular, series })
const normal = (itemExercicio: ExercicioTreino): ItemTreino => ({
    tipoItem: "EXERCICIO",
    exercicio: itemExercicio,
})
const tecnica = (
    tipoTecnica: "BI_SET" | "TRI_SET" | "MONSTER_SET",
    quantidadeSeries: number,
    exercicios: ExercicioTreino[],
): ItemTreino => ({ tipoItem: "TECNICA", tipoTecnica, quantidadeSeries, exercicios })

export const treinosMock: TreinoResumo[] = [
    {
        id: 101,
        alunoId: 1,
        status: "PAUSADO",
        inicio: "2026-10-14T18:30:00",
        fim: null,
        nomeRotina: "Treino A — Peito e tríceps",
        conclusao: null,
        itens: [
            normal(
                exercicio(1, "Supino reto", "Peito", [
                    serie(1, 12, 20, true),
                    serie(2, 10, 25, true),
                    serie(3, 8, 25, false),
                ]),
            ),
            tecnica("BI_SET", 3, [
                exercicio(2, "Crucifixo", "Peito", [
                    serie(1, 12, 15, true, "BI_SET"),
                    serie(2, 10, 15, false, "BI_SET"),
                    serie(3, 10, 15, false, "BI_SET"),
                ]),
                exercicio(9, "Tríceps pulley", "Tríceps", [
                    serie(1, 12, 15, true, "BI_SET"),
                    serie(2, 10, 15, false, "BI_SET"),
                    serie(3, 10, 15, false, "BI_SET"),
                ]),
            ]),
        ],
    },
    {
        id: 99,
        alunoId: 1,
        status: "FINALIZADO",
        inicio: "2026-10-12T19:10:00",
        fim: "2026-10-12T20:05:00",
        nomeRotina: "Treino B — Costas e bíceps",
        conclusao: "COMPLETA",
        itens: [
            normal(
                exercicio(3, "Puxada frontal", "Costas", [
                    serie(1, 12, 35, true),
                    serie(2, 10, 40, true),
                ]),
            ),
        ],
    },
    {
        id: 98,
        alunoId: 1,
        status: "FINALIZADO",
        inicio: "2026-10-09T18:45:00",
        fim: "2026-10-09T19:20:00",
        nomeRotina: "Treino A — Peito e tríceps",
        conclusao: "PARCIAL",
        itens: [normal(exercicio(1, "Supino reto", "Peito", [serie(1, 10, 20, true)]))],
    },
    {
        id: 202,
        alunoId: 3,
        status: "FINALIZADO",
        inicio: "2026-10-23T18:40:00",
        fim: "2026-10-23T19:30:00",
        nomeRotina: "Treino B — Costas e bíceps",
        conclusao: "COMPLETA",
        itens: [],
    },
]
