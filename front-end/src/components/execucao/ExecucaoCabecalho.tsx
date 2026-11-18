import { ArrowLeft, Check, EllipsisVertical, Pause, Pencil, Play } from "lucide-react"

interface Props {
    nome: string
    status: "EM_ANDAMENTO" | "PAUSADO" | "FINALIZADO"
    menuAberto: boolean
    onVoltar: () => void
    onPausar: () => void
    onRetomar: () => void
    onFinalizar: () => void
    onEditar: () => void
    onAlternarMenu: () => void
}

export default function ExecucaoCabecalho({
    nome,
    status,
    menuAberto,
    onVoltar,
    onPausar,
    onRetomar,
    onFinalizar,
    onEditar,
    onAlternarMenu,
}: Props) {
    const pausado = status === "PAUSADO"
    const finalizado = status === "FINALIZADO"
    const rotuloStatus = finalizado ? "Finalizado" : pausado ? "Pausado" : "Em andamento"
    return (
        <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
                <button
                    type="button"
                    onClick={onVoltar}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-slate-200 dark:hover:bg-slate-900 motion-reduce:transition-none"
                >
                    <ArrowLeft size={18} aria-hidden="true" />
                    <span className="hidden sm:inline">Treinos</span>
                </button>
                <div className="min-w-0 text-center">
                    <p className="truncate text-base font-bold text-slate-950 dark:text-white">
                        {nome}
                    </p>
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        {rotuloStatus}
                    </span>
                </div>
                <div className="relative flex items-center gap-2">
                    <button
                        type="button"
                        onClick={pausado ? onRetomar : onPausar}
                        aria-label={pausado ? "Retomar treino" : "Pausar treino"}
                        disabled={finalizado}
                        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-emerald-100 px-3 text-emerald-800 transition hover:bg-emerald-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900 motion-reduce:transition-none motion-reduce:active:scale-100"
                    >
                        {pausado ? (
                            <Play size={18} aria-hidden="true" />
                        ) : (
                            <Pause size={18} aria-hidden="true" />
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={onAlternarMenu}
                        aria-label="Mais opções"
                        aria-expanded={menuAberto}
                        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-slate-300 text-slate-700 transition hover:bg-slate-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900 motion-reduce:transition-none motion-reduce:active:scale-100"
                    >
                        <EllipsisVertical size={19} aria-hidden="true" />
                    </button>
                    {menuAberto && (
                        <div className="absolute right-0 top-14 z-20 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-card dark:border-slate-800 dark:bg-slate-900">
                            <button
                                type="button"
                                onClick={onEditar}
                                disabled={finalizado}
                                className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-200 dark:hover:bg-emerald-950/40 motion-reduce:transition-none"
                            >
                                <Pencil size={17} aria-hidden="true" />
                                Editar treino
                            </button>
                            <button
                                type="button"
                                onClick={onFinalizar}
                                disabled={finalizado}
                                className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-slate-200 dark:hover:bg-emerald-950/40 motion-reduce:transition-none"
                            >
                                <Check size={17} aria-hidden="true" />
                                Finalizar treino
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
