import { useState } from "react"
import type { ExercicioCatalogo } from "../../types/exercicio"

const velocidades = ["Lenta", "Normal", "Rápida"] as const

export default function ExercicioAnimacao({ exercicio }: { exercicio: ExercicioCatalogo }) {
    const [expandida, setExpandida] = useState(false)
    const [velocidade, setVelocidade] = useState(0)
    const animacao = velocidade === 0
        ? exercicio.midia.animacaoLenta
        : velocidade === 1
            ? exercicio.midia.animacao
            : exercicio.midia.animacaoRapida

    const alternarVelocidade = () => setVelocidade((atual) => (atual + 1) % velocidades.length)

    return (
        <>
            <div className="flex items-start gap-3">
                <figure className="w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                    <img src={animacao} alt={`Demonstração ilustrada de ${exercicio.nome}`} className="aspect-square w-full object-contain" />
                    <figcaption className="px-2 pb-2 text-center text-[10px] text-slate-500 dark:text-slate-400">Ilustração · {exercicio.midia.licenca}</figcaption>
                </figure>
                <div className="flex flex-col gap-2">
                    <button type="button" onClick={() => setExpandida(true)} className="rounded-xl border border-emerald-200 px-3 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 active:scale-95 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950">Expandir animação</button>
                    <button type="button" onClick={alternarVelocidade} className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 active:scale-95 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Velocidade: {velocidades[velocidade]}</button>
                </div>
            </div>

            {expandida && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-5" role="presentation" onMouseDown={() => setExpandida(false)}>
                    <section className="relative flex items-center justify-center rounded-3xl bg-slate-100 p-4 shadow-2xl dark:bg-slate-900" style={{ width: "min(70vw, 70vh)", height: "min(70vw, 70vh)" }} role="dialog" aria-modal="true" aria-label={`Animação ampliada de ${exercicio.nome}`} onMouseDown={(evento) => evento.stopPropagation()}>
                        <img src={animacao} alt={`Animação ampliada de ${exercicio.nome}`} className="h-full w-full object-contain" />
                        <button type="button" onClick={alternarVelocidade} className="absolute bottom-3 left-3 rounded-xl bg-white/90 px-3 py-2 text-xs font-bold text-slate-700 shadow transition hover:bg-white active:scale-95 dark:bg-slate-950/90 dark:text-slate-200 dark:hover:bg-slate-950">Velocidade: {velocidades[velocidade]}</button>
                        <button type="button" onClick={() => setExpandida(false)} aria-label="Fechar animação ampliada" className="absolute right-3 top-3 rounded-xl bg-white/90 px-3 py-2 text-xl text-slate-700 shadow transition hover:bg-white active:scale-95 dark:bg-slate-950/90 dark:text-slate-200 dark:hover:bg-slate-950">×</button>
                    </section>
                </div>
            )}
        </>
    )
}
