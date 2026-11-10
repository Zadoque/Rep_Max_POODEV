import type { HistoricoAluno } from "../../types/aluno-dashboard"

export default function HistoricoTreinos({ treinos }: { treinos: HistoricoAluno["treinos"] }) {
    const formatarData = (valor: string) =>
        new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(valor))
    return (
        <section>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">Treinos realizados</h2>
            <div className="mt-4 space-y-3">
                {treinos.map((treino) => (
                    <article
                        key={treino.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div>
                            <h3 className="font-bold text-slate-950 dark:text-white">
                                {treino.rotina}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                {formatarData(treino.data)} · {treino.duracao}
                            </p>
                        </div>
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${treino.status === "Pausado" ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"}`}
                        >
                            {treino.status}
                        </span>
                    </article>
                ))}
            </div>
        </section>
    )
}
