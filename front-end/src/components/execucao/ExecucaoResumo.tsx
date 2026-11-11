interface Props {
    nome: string
    concluidas: number
    planejadas: number
    proximo: string
    mensagem: string | null
}

export default function ExecucaoResumo({ nome, concluidas, planejadas, proximo, mensagem }: Props) {
    const percentual = planejadas ? Math.round((concluidas / planejadas) * 100) : 0

    return (
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                    Progresso
                </p>
                <h2 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">{nome}</h2>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                        className="h-full rounded-full bg-emerald-500 transition-[width] duration-300 motion-reduce:transition-none"
                        style={{ width: `${percentual}%` }}
                    />
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {concluidas} de {planejadas} séries · {percentual}%
                </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Próximo item
                </p>
                <p className="mt-2 font-bold text-slate-950 dark:text-white">{proximo}</p>
            </div>
            {mensagem && (
                <p
                    className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                    role="status"
                >
                    {mensagem}
                </p>
            )}
        </aside>
    )
}
