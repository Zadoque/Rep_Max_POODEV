import type { ItemRotina, RotinaDashboardInput } from "../../types/aluno-dashboard"
import type { ExercicioCatalogo } from "../../types/exercicio"
import type TreinoResumo from "../../types/treino-resumo"
import type {
    ExercicioTreino,
    ItemTreino,
    SerieTreino,
    TipoTecnica,
} from "../../types/treino-resumo"

const seriePadrao = (
    numero: number,
    anterior?: SerieTreino,
    tipoTecnica: TipoTecnica = "NORMAL",
) => ({
    numero,
    repeticoes: anterior?.repeticoes ?? 10,
    cargaKg: anterior?.cargaKg ?? 0,
    concluida: anterior?.concluida ?? false,
    tipoTecnica,
})

function ajustarSeries(series: SerieTreino[], quantidade: number, tipoTecnica: TipoTecnica) {
    return Array.from({ length: quantidade }, (_, indice) =>
        seriePadrao(indice + 1, series[indice], tipoTecnica),
    )
}

function criarExercicio(
    exercicioId: number,
    series: SerieTreino[],
    quantidade: number,
    tipoTecnica: TipoTecnica,
    catalogo: ExercicioCatalogo[],
): ExercicioTreino {
    const encontrado = catalogo.find((exercicio) => exercicio.id === exercicioId)
    return {
        id: exercicioId,
        nome: encontrado?.nome ?? `Exercício ${exercicioId}`,
        grupoMuscular: encontrado?.grupoMuscular ?? "Não informado",
        series: ajustarSeries(series, quantidade, tipoTecnica),
    }
}

function buscarExercicioAnterior(itens: ItemTreino[], exercicioId: number) {
    for (const item of itens) {
        if (item.tipoItem === "EXERCICIO" && item.exercicio.id === exercicioId) {
            return item.exercicio
        }
        if (item.tipoItem === "TECNICA") {
            const exercicio = item.exercicios.find((membro) => membro.id === exercicioId)
            if (exercicio) return exercicio
        }
    }
    return undefined
}

function converterItem(
    item: ItemRotina,
    itensAnteriores: ItemTreino[],
    catalogo: ExercicioCatalogo[],
): ItemTreino {
    if (item.tipoItem === "EXERCICIO") {
        const anterior = buscarExercicioAnterior(itensAnteriores, item.exercicioId)
        return {
            tipoItem: "EXERCICIO",
            exercicio: criarExercicio(
                item.exercicioId,
                anterior?.series ?? [],
                item.quantidadeSeries,
                item.tipoTecnica,
                catalogo,
            ),
        }
    }

    return {
        tipoItem: "TECNICA",
        tipoTecnica: item.tipoTecnica,
        quantidadeSeries: item.quantidadeSeries,
        exercicios: item.exercicios.map((membro) => {
            const anterior = buscarExercicioAnterior(itensAnteriores, membro.exercicioId)
            return criarExercicio(
                membro.exercicioId,
                anterior?.series ?? [],
                item.quantidadeSeries,
                item.tipoTecnica,
                catalogo,
            )
        }),
    }
}

export function treinoParaRotina(treino: TreinoResumo): RotinaDashboardInput {
    return {
        nome: treino.nomeRotina ?? "Treino em execução",
        descricao: "",
        itens: treino.itens.map((item, indice) => {
            if (item.tipoItem === "EXERCICIO") {
                return {
                    id: indice + 1,
                    tipoItem: "EXERCICIO",
                    exercicioId: item.exercicio.id,
                    quantidadeSeries: item.exercicio.series.length,
                    tipoTecnica: "NORMAL",
                }
            }
            return {
                id: indice + 1,
                tipoItem: "TECNICA",
                tipoTecnica: item.tipoTecnica,
                quantidadeSeries: item.quantidadeSeries,
                exercicios: item.exercicios.map((exercicio, ordemNoGrupo) => ({
                    exercicioId: exercicio.id,
                    ordemNoGrupo: ordemNoGrupo + 1,
                })),
            }
        }),
    }
}

export function aplicarRotinaAoTreino(
    treino: TreinoResumo,
    rotina: RotinaDashboardInput,
    catalogo: ExercicioCatalogo[],
): TreinoResumo {
    return {
        ...treino,
        nomeRotina: rotina.nome,
        itens: rotina.itens.map((item) => converterItem(item, treino.itens, catalogo)),
    }
}
