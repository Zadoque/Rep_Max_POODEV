import type TreinoResumo from "../types/treino-resumo"

export const treinosMock: TreinoResumo[] = [
    {
        id: 101,
        alunoId: 1,
        status: "PAUSADO",
        inicio: "2026-10-14T18:30:00",
        fim: null,
        nomeRotina: "Treino A — Peito e tríceps",
        exercicios: [
            {
                id: 1,
                nome: "Supino reto",
                grupoMuscular: "Peito",
                series: [
                    { numero: 1, repeticoes: 12, cargaKg: 20, concluida: true, tipoTecnica: "NORMAL" },
                    { numero: 2, repeticoes: 10, cargaKg: 25, concluida: true, tipoTecnica: "NORMAL" },
                    { numero: 3, repeticoes: 8, cargaKg: 25, concluida: false, tipoTecnica: "NORMAL" },
                ],
            },
            {
                id: 2,
                nome: "Tríceps pulley",
                grupoMuscular: "Tríceps",
                series: [
                    { numero: 1, repeticoes: 12, cargaKg: 15, concluida: true, tipoTecnica: "BI_SET" },
                    { numero: 2, repeticoes: 10, cargaKg: 15, concluida: false, tipoTecnica: "BI_SET" },
                ],
            },
        ],
    },
    {
        id: 99,
        alunoId: 1,
        status: "FINALIZADO",
        inicio: "2026-10-12T19:10:00",
        fim: "2026-10-12T20:05:00",
        nomeRotina: "Treino B — Costas e bíceps",
        exercicios: [
            {
                id: 3,
                nome: "Puxada frontal",
                grupoMuscular: "Costas",
                series: [
                    { numero: 1, repeticoes: 12, cargaKg: 35, concluida: true, tipoTecnica: "NORMAL" },
                    { numero: 2, repeticoes: 10, cargaKg: 40, concluida: true, tipoTecnica: "NORMAL" },
                ],
            },
        ],
    },
    {
        id: 98,
        alunoId: 1,
        status: "FINALIZADO_PARCIALMENTE",
        inicio: "2026-10-09T18:45:00",
        fim: "2026-10-09T19:20:00",
        nomeRotina: "Treino A — Peito e tríceps",
        exercicios: [],
    },
]
