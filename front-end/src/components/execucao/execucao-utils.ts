import type { ItemTreino, ItemTreinoTecnica } from "../../types/treino-resumo"

export function seriesPlanejadas(itens: ItemTreino[]) {
    return itens.reduce(
        (total, item) =>
            total +
            (item.tipoItem === "EXERCICIO" ? item.exercicio.series.length : item.quantidadeSeries),
        0,
    )
}

export function seriesConcluidas(itens: ItemTreino[]) {
    return itens.reduce((total, item) => {
        if (item.tipoItem === "EXERCICIO") {
            return total + item.exercicio.series.filter((serie) => serie.concluida).length
        }

        return total + contarSeriesCompletasDoGrupo(item)
    }, 0)
}

export function contarSeriesCompletasDoGrupo(item: ItemTreinoTecnica) {
    return Array.from({ length: item.quantidadeSeries }, (_, indice) => indice + 1).filter(
        (numero) =>
            item.exercicios.every((exercicio) =>
                exercicio.series.some((serie) => serie.numero === numero && serie.concluida),
            ),
    ).length
}

export function encontrarProximoItem(itens: ItemTreino[]) {
    for (const item of itens) {
        if (item.tipoItem === "EXERCICIO") {
            const serie = item.exercicio.series.find((opcao) => !opcao.concluida)
            if (serie) {
                return `${item.exercicio.nome} · série ${serie.numero} de ${item.exercicio.series.length}`
            }
            continue
        }

        const numero = Array.from(
            { length: item.quantidadeSeries },
            (_, indice) => indice + 1,
        ).find(
            (serieAtual) =>
                !item.exercicios.every((exercicio) =>
                    exercicio.series.some(
                        (serie) => serie.numero === serieAtual && serie.concluida,
                    ),
                ),
        )
        if (numero) {
            const pendente = item.exercicios.find((exercicio) =>
                exercicio.series.some((serie) => serie.numero === numero && !serie.concluida),
            )
            return `${item.tipoTecnica.replace("_", "-")} · ${pendente?.nome ?? "próximo membro"} · série ${numero} de ${item.quantidadeSeries}`
        }
    }

    return "Treino completo"
}
