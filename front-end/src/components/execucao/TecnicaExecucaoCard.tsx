import type { ExercicioCatalogo } from "../../types/exercicio"
import type { ItemTreinoTecnica } from "../../types/treino-resumo"
import ExercicioExecucaoCard from "./ExercicioExecucaoCard"

interface Props {
    item: ItemTreinoTecnica
    catalogo: ExercicioCatalogo[]
    itemAtivo: boolean
    membroAtivoId: number | null
    onAlterarSerie: (
        exercicioId: number,
        numero: number,
        alteracoes: { repeticoes?: number; cargaKg?: number },
    ) => void
    onRegistrarSerie: (exercicioId: number, numero: number) => void
}

const rotulos: Record<ItemTreinoTecnica["tipoTecnica"], string> = {
    BI_SET: "Bi-set",
    TRI_SET: "Tri-set",
    MONSTER_SET: "Monster-set",
}

export default function TecnicaExecucaoCard({
    item,
    catalogo,
    itemAtivo,
    membroAtivoId,
    onAlterarSerie,
    onRegistrarSerie,
}: Props) {
    const membrosConcluidos = item.exercicios.filter((exercicio) =>
        exercicio.series.every((serie) => serie.concluida),
    ).length

    return (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-card dark:border-emerald-900 dark:bg-emerald-950/20 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                        {rotulos[item.tipoTecnica]}
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
                        Sequência do grupo
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        Uma série só completa após todos os {item.exercicios.length} membros.
                    </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {membrosConcluidos}/{item.exercicios.length} membros completos
                </span>
            </div>

            <div className="mt-5 space-y-4">
                {item.exercicios.map((exercicio) => (
                    <ExercicioExecucaoCard
                        key={exercicio.id}
                        exercicio={exercicio}
                        catalogo={catalogo.find((itemCatalogo) => itemCatalogo.id === exercicio.id)}
                        itemAtivo={itemAtivo && membroAtivoId === exercicio.id}
                        serieLiberada={(numero) =>
                            numero === 1 ||
                            item.exercicios.every((membro) =>
                                membro.series.some(
                                    (serie) => serie.numero === numero - 1 && serie.concluida,
                                ),
                            )
                        }
                        onAlterarSerie={(numero, alteracoes) =>
                            onAlterarSerie(exercicio.id, numero, alteracoes)
                        }
                        onRegistrarSerie={(numero) => onRegistrarSerie(exercicio.id, numero)}
                    />
                ))}
            </div>
        </section>
    )
}
