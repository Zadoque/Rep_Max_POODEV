export type SecaoHistorico = "metricas" | "treinos"

export default function HistoricoSecaoTabs({
    ativa,
    onChange,
}: {
    ativa: SecaoHistorico
    onChange: (valor: SecaoHistorico) => void
}) {
    return (
        <div className="flex justify-center md:justify-start">
            <div
                className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900"
                role="tablist"
                aria-label="Seção do histórico"
            >
                {(["metricas", "treinos"] as const).map((secao) => (
                    <button
                        key={secao}
                        type="button"
                        role="tab"
                        aria-selected={ativa === secao}
                        onClick={() => onChange(secao)}
                        className={`rounded-xl px-4 py-2 text-sm font-bold transition ${ativa === secao ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                    >
                        {secao === "metricas" ? "Métricas" : "Treinos realizados"}
                    </button>
                ))}
            </div>
        </div>
    )
}
