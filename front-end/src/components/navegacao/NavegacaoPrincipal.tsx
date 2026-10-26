import type { ReactNode } from "react"
import { ChartNoAxesCombined, Dumbbell, House, UserRound } from "lucide-react"

export type AbaPrincipal = "inicio" | "treinos" | "historico" | "perfil"

interface NavegacaoPrincipalProps {
    abaAtiva: AbaPrincipal
    onSelecionar: (aba: AbaPrincipal) => void
}

const abas: { id: AbaPrincipal; label: string; icone: ReactNode }[] = [
    { id: "inicio", label: "Início", icone: <House size={19} strokeWidth={2} /> },
    { id: "treinos", label: "Treinos", icone: <Dumbbell size={19} strokeWidth={2} /> },
    { id: "historico", label: "Histórico", icone: <ChartNoAxesCombined size={19} strokeWidth={2} /> },
    { id: "perfil", label: "Perfil", icone: <UserRound size={19} strokeWidth={2} /> },
]

export default function NavegacaoPrincipal({ abaAtiva, onSelecionar }: NavegacaoPrincipalProps) {
    return (
        <nav aria-label="Navegação principal" className="hidden border-b border-slate-200 bg-white md:flex dark:border-slate-800 dark:bg-slate-950">
            <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-5 py-3 lg:px-8">
                {abas.map((aba) => (
                    <button
                        key={aba.id}
                        type="button"
                        onClick={() => onSelecionar(aba.id)}
                        aria-current={abaAtiva === aba.id ? "page" : undefined}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${abaAtiva === aba.id
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                            }`}
                    >
                        <span aria-hidden="true">{aba.icone}</span>
                        {aba.label}
                    </button>
                ))}
            </div>
        </nav>
    )
}

export function NavegacaoMobile({ abaAtiva, onSelecionar }: NavegacaoPrincipalProps) {
    return (
        <nav aria-label="Navegação principal mobile" className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden dark:border-slate-800 dark:bg-slate-950/95">
            <div className="mx-auto grid max-w-lg grid-cols-4 gap-1">
                {abas.map((aba) => (
                    <button
                        key={aba.id}
                        type="button"
                        onClick={() => onSelecionar(aba.id)}
                        aria-current={abaAtiva === aba.id ? "page" : undefined}
                        className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-xs font-semibold transition ${abaAtiva === aba.id
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
                            }`}
                    >
                        <span aria-hidden="true" className="text-lg leading-none">{aba.icone}</span>
                        {aba.label}
                    </button>
                ))}
            </div>
        </nav>
    )
}
