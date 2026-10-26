import { evolucoesMockPorUsuario, historicosTreinosMockPorUsuario } from "../../mocks/aluno-dashboard-mock"

const formatarData = (valor: string) =>
    new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(valor))

export default function HistoricoTab({ usuarioId }: { usuarioId: number }) {
    const evolucao = evolucoesMockPorUsuario[usuarioId] ?? evolucoesMockPorUsuario[1]
    const historicoTreinos = historicosTreinosMockPorUsuario[usuarioId] ?? historicosTreinosMockPorUsuario[1]
    const maiorValor = Math.max(...evolucao.map((ponto) => ponto.valor))

    return (
        <div className="space-y-6">
            <section>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">Acompanhe sua evolução</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Histórico</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-300">Veja sua consistência e acompanhe a evolução do seu desempenho.</p>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-950 dark:text-white">Volume total</h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Evolução dos últimos meses</p>
                    </div>
                    <strong className="text-2xl text-emerald-700 dark:text-emerald-400">+35%</strong>
                </div>
                <div className="mt-8 flex h-48 items-end gap-3 border-b border-l border-slate-200 px-3 pb-2 dark:border-slate-700">
                    {evolucao.map((ponto) => (
                        <div key={ponto.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{ponto.valor}</span>
                            <div className="w-full max-w-12 rounded-t-lg bg-emerald-500 dark:bg-emerald-600" style={{ height: `${(ponto.valor / maiorValor) * 78}%` }} />
                            <span className="text-xs text-slate-500 dark:text-slate-400">{ponto.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-bold text-slate-950 dark:text-white">Treinos realizados</h2>
                <div className="mt-4 space-y-3">
                    {historicoTreinos.map((treino) => (
                        <article key={treino.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                            <div>
                                <h3 className="font-bold text-slate-950 dark:text-white">{treino.rotina}</h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formatarData(treino.data)} · {treino.duracao}</p>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${treino.status === "Pausado" ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"}`}>{treino.status}</span>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    )
}
