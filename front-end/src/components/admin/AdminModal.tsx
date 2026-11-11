import { X } from "lucide-react"
import type { ReactNode } from "react"

export const inputClassName =
    "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-emerald-950"

export function AdminModal({
    children,
    onClose,
    titulo,
}: {
    children: ReactNode
    onClose: () => void
    titulo: string
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
            role="presentation"
            onMouseDown={onClose}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby={titulo}
                onMouseDown={(evento) => evento.stopPropagation()}
                className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 sm:p-8"
            >
                {children}
            </section>
        </div>
    )
}

export function CabecalhoAdminModal({
    titulo,
    subtitulo,
    onClose,
}: {
    titulo: string
    subtitulo: string
    onClose: () => void
}) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <p className="text-sm font-bold uppercase tracking-brand text-emerald-700 dark:text-emerald-400">
                    {subtitulo}
                </p>
                <h2 id={titulo} className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
                    {titulo}
                </h2>
            </div>
            <button
                type="button"
                onClick={onClose}
                aria-label="Fechar modal"
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            >
                <X size={20} />
            </button>
        </div>
    )
}
