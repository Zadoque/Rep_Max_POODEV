import type { ExercicioCatalogo } from "../../types/exercicio"
import ExercicioAnimacao from "../exercicios/ExercicioAnimacao"
import type { GrupoTecnica } from "./treino-editor"
import { quantidadeTecnica } from "./treino-editor"

interface Props {
    grupo: GrupoTecnica
    exercicios: ExercicioCatalogo[]
    onAdicionar: (id: number) => void
    onClose: () => void
}

export default function ModalAdicionarExercicioGrupo({
    grupo,
    exercicios,
    onAdicionar,
    onClose,
}: Props) {
    return (
        <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 p-5"
            role="presentation"
            onMouseDown={onClose}
        >
            <section
                role="dialog"
                aria-modal="true"
                className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900"
                onMouseDown={(evento) => evento.stopPropagation()}
            >
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                            {quantidadeTecnica[grupo.tipoTecnica].rotulo}
                        </p>
                        <h3 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
                            Adicionar exercício ao grupo
                        </h3>
                    </div>
                    <button type="button" onClick={onClose} className="text-xl text-slate-500">
                        ×
                    </button>
                </div>
                <div className="mt-5 max-h-[55vh] space-y-2 overflow-y-auto">
                    {exercicios.map((exercicio) => (
                        <button
                            type="button"
                            key={exercicio.id}
                            onClick={() => onAdicionar(exercicio.id)}
                            className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-3 text-left hover:border-emerald-500 dark:border-slate-800"
                        >
                            <ExercicioAnimacao exercicio={exercicio} />
                            <span>
                                <strong className="text-slate-950 dark:text-white">
                                    {exercicio.nome}
                                </strong>
                                <span className="block text-sm text-slate-500 dark:text-slate-400">
                                    {exercicio.grupoMuscular}
                                </span>
                            </span>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    )
}
