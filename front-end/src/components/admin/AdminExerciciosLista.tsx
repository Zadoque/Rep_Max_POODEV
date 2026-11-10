import { Pencil, Trash2 } from "lucide-react"

import type { ExercicioCatalogo } from "../../types/exercicio"

export default function AdminExerciciosLista({
    exercicios,
    onEditar,
    onRemover,
}: {
    exercicios: ExercicioCatalogo[]
    onEditar: (item: ExercicioCatalogo) => void
    onRemover: (item: ExercicioCatalogo) => void
}) {
    return (
        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {exercicios.map((item) => (
                <article
                    key={item.id}
                    className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                >
                    <img
                        src={item.midia.animacao}
                        alt={`Demonstração de ${item.nome}`}
                        className="aspect-video w-full rounded-2xl bg-slate-950 object-contain"
                    />
                    <div className="mt-4 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h2 className="truncate font-bold text-slate-950 dark:text-white">
                                {item.nome}
                            </h2>
                            <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                                {item.grupoMuscular} · {item.equipamento}
                            </p>
                        </div>
                        <div className="flex shrink-0 gap-1">
                            <button
                                type="button"
                                onClick={() => onEditar(item)}
                                title="Editar exercício"
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-emerald-700 dark:hover:bg-slate-800"
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={() => onRemover(item)}
                                title="Remover exercício"
                                className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-950"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </article>
            ))}
            {exercicios.length === 0 && (
                <p className="text-slate-600 dark:text-slate-300">Nenhum exercício encontrado.</p>
            )}
        </section>
    )
}
