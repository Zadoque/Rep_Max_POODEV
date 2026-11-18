import type { FormEvent } from "react"

import type { RotinaDashboardInput } from "../../types/aluno-dashboard"
import type { ExercicioCatalogo } from "../../types/exercicio"
import ModalAdicionarExercicioGrupo from "./ModalAdicionarExercicioGrupo"
import ModalTrocaExercicio from "./ModalTrocaExercicio"
import { useTreinoEditor } from "./treino-editor"
import TreinoBlocos from "./TreinoBlocos"
import TreinoCampos from "./TreinoCampos"

interface Props {
    modo: "criar" | "editar"
    rotina: RotinaDashboardInput
    exercicios: ExercicioCatalogo[]
    atualizadoEm?: string
    onChange: (rotina: RotinaDashboardInput) => void
    onClose: () => void
    onSave: (evento: FormEvent<HTMLFormElement>) => void
}
const formatarData = (valor: string) =>
    new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(
        new Date(valor),
    )

export default function ModalTreino({
    modo,
    rotina,
    exercicios,
    atualizadoEm,
    onChange,
    onClose,
    onSave,
}: Props) {
    const editor = useTreinoEditor(rotina, exercicios, onChange)
    const exercicioAtualId = editor.exercicioParaTrocar?.exercicioId
    const exercicioAtual = exercicios.find((item) => item.id === exercicioAtualId)
    const idsUsados = new Set(
        rotina.itens.flatMap((item) =>
            item.tipoItem === "EXERCICIO"
                ? [item.exercicioId]
                : item.exercicios.map((membro) => membro.exercicioId),
        ),
    )
    return (
        <div
            className="fixed inset-0 z-30 flex items-start justify-center overflow-y-auto bg-slate-950/60 p-3 sm:items-center sm:p-6"
            role="presentation"
            onMouseDown={onClose}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-modal-treino"
                className="my-3 max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl sm:my-6 sm:max-h-[92vh] sm:p-8 dark:bg-slate-900"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-brand text-emerald-700 dark:text-emerald-400">
                            Biblioteca
                        </p>
                        <h2
                            id="titulo-modal-treino"
                            className="mt-2 text-2xl font-bold text-slate-950 dark:text-white"
                        >
                            {modo === "criar" ? "Criar treino" : "Editar treino"}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar modal"
                        className="rounded-xl px-3 py-2 text-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                    >
                        ×
                    </button>
                </div>
                <form className="mt-6 space-y-6" onSubmit={(e) => editor.submeterTreino(e, onSave)}>
                    <TreinoCampos rotina={rotina} onChange={onChange} editor={editor} />
                    <TreinoBlocos rotina={rotina} exercicios={exercicios} editor={editor} />
                    {editor.erroTecnica && (
                        <p
                            role="alert"
                            className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900"
                        >
                            {editor.erroTecnica}
                        </p>
                    )}
                    {atualizadoEm && (
                        <p className="text-xs text-slate-500">
                            Atualizado em {formatarData(atualizadoEm)}
                        </p>
                    )}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full rounded-xl px-4 py-3 font-semibold text-slate-600 sm:w-auto sm:py-2"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={rotina.itens.length === 0}
                            className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white disabled:opacity-50 sm:w-auto sm:py-2"
                        >
                            {modo === "criar" ? "Criar treino" : "Salvar alterações"}
                        </button>
                    </div>
                </form>
            </section>
            {editor.grupoParaAdicionar && (
                <ModalAdicionarExercicioGrupo
                    grupo={editor.grupoParaAdicionar}
                    exercicios={editor.exerciciosDisponiveis}
                    onAdicionar={editor.adicionarAoGrupo}
                    onClose={() => editor.setGrupoParaAdicionar(null)}
                />
            )}
            {exercicioAtual && (
                <ModalTrocaExercicio
                    exercicioAtual={exercicioAtual}
                    exerciciosDisponiveis={exercicios.filter(
                        (item) => item.id !== exercicioAtual.id && !idsUsados.has(item.id),
                    )}
                    onClose={() => editor.setExercicioParaTrocar(null)}
                    onConfirmar={(novoId) =>
                        editor.trocarExercicio(
                            exercicioAtual.id,
                            novoId,
                            editor.exercicioParaTrocar?.grupoId,
                        )
                    }
                />
            )}
        </div>
    )
}
