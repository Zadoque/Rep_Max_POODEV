import { useState } from "react"

import type { ExercicioCatalogo } from "../../types/exercicio"
import ExercicioAnimacao from "../exercicios/ExercicioAnimacao"

interface Props {
    exercicioAtual: ExercicioCatalogo
    exerciciosDisponiveis: ExercicioCatalogo[]
    onClose: () => void
    onConfirmar: (id: number) => void
}

export default function ModalTrocaExercicio({
    exercicioAtual,
    exerciciosDisponiveis,
    onClose,
    onConfirmar,
}: Props) {
    const [novoId, setNovoId] = useState("")
    const novo = exerciciosDisponiveis.find((exercicio) => exercicio.id === Number(novoId))
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-5"
            role="presentation"
            onMouseDown={onClose}
        >
            <section
                role="dialog"
                aria-modal="true"
                className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900"
                onMouseDown={(evento) => evento.stopPropagation()}
            >
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                    Editar exercício
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
                    Trocar exercício
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Substitua {exercicioAtual.nome} por outro exercício.
                </p>
                <select
                    value={novoId}
                    onChange={(evento) => setNovoId(evento.target.value)}
                    className="mt-6 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                    <option value="">Selecione o novo exercício</option>
                    {exerciciosDisponiveis.map((exercicio) => (
                        <option key={exercicio.id} value={exercicio.id}>
                            {exercicio.nome} · {exercicio.grupoMuscular}
                        </option>
                    ))}
                </select>
                {novo && (
                    <div className="mt-4 flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                        <ExercicioAnimacao exercicio={novo} />
                        <div>
                            <strong>{novo.nome}</strong>
                            <p className="text-sm text-slate-600">
                                {novo.grupoMuscular} · {novo.equipamento}
                            </p>
                        </div>
                    </div>
                )}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl px-4 py-2 font-semibold text-slate-600"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        disabled={!novo}
                        onClick={() => novo && onConfirmar(novo.id)}
                        className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white disabled:opacity-50"
                    >
                        Trocar exercício
                    </button>
                </div>
            </section>
        </div>
    )
}
