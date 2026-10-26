import { useEffect, useState } from "react"
import type { ExercicioCatalogo } from "../../types/exercicio"

export default function ExercicioAnimacao({ exercicio }: { exercicio: ExercicioCatalogo }) {
    const [frame, setFrame] = useState(0)

    useEffect(() => {
        const intervalo = window.setInterval(() => {
            setFrame((atual) => (atual + 1) % exercicio.midia.frames.length)
        }, 420)

        return () => window.clearInterval(intervalo)
    }, [exercicio])

    return (
        <figure className="w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
            <img
                src={exercicio.midia.frames[frame]}
                alt={`Demonstração ilustrada de ${exercicio.nome}`}
                className="aspect-square w-full object-contain"
            />
            <figcaption className="px-2 pb-2 text-center text-[10px] text-slate-500 dark:text-slate-400">
                Ilustração · {exercicio.midia.licenca}
            </figcaption>
        </figure>
    )
}
