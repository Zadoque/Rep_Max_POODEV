import type { SerieTreino } from "../../types/treino-resumo"

interface Props {
    serie: SerieTreino
    herdouRepeticoes: boolean
    bloqueada: boolean
    onAlterarRepeticoes: (variacao: number) => void
    onAlterarCarga: (variacao: number) => void
    onDigitarCarga: (valor: number) => void
    onRegistrar: () => void
}

const botaoControle =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-2 text-lg font-bold text-emerald-700 transition hover:bg-emerald-50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:text-emerald-400 dark:hover:bg-emerald-950 motion-reduce:transition-none motion-reduce:active:scale-100"

export default function SerieExecucaoRow({
    serie,
    herdouRepeticoes,
    bloqueada,
    onAlterarRepeticoes,
    onAlterarCarga,
    onDigitarCarga,
    onRegistrar,
}: Props) {
    return (
        <div
            className={`grid gap-3 rounded-2xl border p-3 transition-colors sm:grid-cols-[auto_1fr_1fr_auto] sm:items-center ${
                serie.concluida
                    ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/30"
                    : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
            } motion-reduce:transition-none`}
        >
            <div className="flex items-center justify-between gap-2 sm:block">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Série {serie.numero}
                </span>
                {serie.concluida && (
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        Salva
                    </span>
                )}
                {bloqueada && (
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Aguarde a série anterior
                    </span>
                )}
            </div>

            <div>
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Repetições
                </span>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className={botaoControle}
                        aria-label={`Diminuir repetições da série ${serie.numero}`}
                        onClick={() => onAlterarRepeticoes(-1)}
                        disabled={bloqueada || serie.concluida || serie.repeticoes <= 1}
                    >
                        −
                    </button>
                    <strong className="min-w-12 text-center text-lg text-slate-950 dark:text-white">
                        {serie.repeticoes}
                    </strong>
                    <button
                        type="button"
                        className={botaoControle}
                        aria-label={`Aumentar repetições da série ${serie.numero}`}
                        onClick={() => onAlterarRepeticoes(1)}
                        disabled={bloqueada || serie.concluida}
                    >
                        +
                    </button>
                </div>
                {herdouRepeticoes && !serie.concluida && (
                    <span className="mt-1 block text-xs text-emerald-700 dark:text-emerald-300">
                        Herdada da série anterior
                    </span>
                )}
            </div>

            <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Peso (kg)
                </span>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className={botaoControle}
                        aria-label={`Diminuir peso da série ${serie.numero}`}
                        onClick={() => onAlterarCarga(-2.5)}
                        disabled={serie.concluida || serie.cargaKg <= 0}
                    >
                        −
                    </button>
                    <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={serie.cargaKg}
                        onChange={(evento) => onDigitarCarga(Number(evento.target.value))}
                        disabled={bloqueada || serie.concluida}
                        aria-label={`Peso da série ${serie.numero}`}
                        className="min-w-0 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-center text-sm font-bold text-slate-950 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:disabled:bg-slate-900"
                    />
                    <button
                        type="button"
                        className={botaoControle}
                        aria-label={`Aumentar peso da série ${serie.numero}`}
                        onClick={() => onAlterarCarga(2.5)}
                        disabled={bloqueada || serie.concluida}
                    >
                        +
                    </button>
                </div>
            </label>

            <button
                type="button"
                onClick={onRegistrar}
                disabled={bloqueada || serie.concluida}
                className="min-h-10 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-default disabled:bg-emerald-200 dark:bg-emerald-700 dark:hover:bg-emerald-600 dark:disabled:bg-emerald-950 dark:disabled:text-emerald-700 motion-reduce:transition-none motion-reduce:active:scale-100"
            >
                {serie.concluida ? "Salva" : "Registrar série"}
            </button>
        </div>
    )
}
