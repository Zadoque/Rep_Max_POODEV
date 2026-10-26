import { rotinasDashboardMocksPorUsuario } from "../../mocks/aluno-dashboard-mock"

export default function TreinosTab({ usuarioId }: { usuarioId: number }) {
    const rotinas = rotinasDashboardMocksPorUsuario[usuarioId] ?? rotinasDashboardMocksPorUsuario[1]

    return (
        <div className="space-y-6">
            <section>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">Biblioteca</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Treinos salvos</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-300">Suas rotinas prontas para o próximo treino.</p>
            </section>

            <div className="grid gap-4 lg:grid-cols-2">
                {rotinas.map((rotina) => (
                    <article key={rotina.id} className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-950 dark:text-white">{rotina.nome}</h2>
                                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{rotina.descricao}</p>
                            </div>
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Ativo</span>
                        </div>
                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
                            <span className="text-slate-500 dark:text-slate-400">{rotina.quantidadeExercicios} exercícios</span>
                            <button type="button" className="font-bold text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300">Ver treino →</button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
}
