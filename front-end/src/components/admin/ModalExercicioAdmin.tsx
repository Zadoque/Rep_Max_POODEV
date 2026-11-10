import { type FormEvent, useState } from "react"

import type { ExercicioCatalogo } from "../../types/exercicio"
import { AdminModal, CabecalhoAdminModal, inputClassName } from "./AdminModal"

export default function ModalExercicioAdmin({
    exercicio,
    modeloMidia,
    onClose,
    onSave,
}: {
    exercicio?: ExercicioCatalogo
    modeloMidia?: ExercicioCatalogo["midia"]
    onClose: () => void
    onSave: (dados: Omit<ExercicioCatalogo, "id">, id?: number) => Promise<void>
}) {
    const [nome, setNome] = useState(exercicio?.nome ?? "")
    const [grupoMuscular, setGrupoMuscular] = useState(exercicio?.grupoMuscular ?? "")
    const [equipamento, setEquipamento] = useState(exercicio?.equipamento ?? "")
    const [descricao, setDescricao] = useState(exercicio?.descricao ?? "")
    const [instrucoesExecucao, setInstrucoesExecucao] = useState(
        exercicio?.instrucoesExecucao ?? "",
    )
    const [salvando, setSalvando] = useState(false)

    async function salvar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault()
        if (!modeloMidia && !exercicio) return
        setSalvando(true)
        try {
            await onSave(
                {
                    slug: exercicio?.slug ?? nome.toLowerCase().trim().replace(/\s+/g, "-"),
                    nome: nome.trim(),
                    grupoMuscular: grupoMuscular.trim(),
                    equipamento: equipamento.trim(),
                    descricao: descricao.trim(),
                    instrucoesExecucao: instrucoesExecucao.trim(),
                    midia: exercicio?.midia ?? modeloMidia!,
                    ativo: exercicio?.ativo ?? true,
                },
                exercicio?.id,
            )
        } finally {
            setSalvando(false)
        }
    }

    return (
        <AdminModal
            onClose={onClose}
            titulo={exercicio ? "Editar exercício" : "Cadastrar exercício"}
        >
            <form onSubmit={salvar}>
                <CabecalhoAdminModal
                    titulo={exercicio ? "Editar exercício" : "Cadastrar exercício"}
                    subtitulo="Catálogo de exercícios"
                    onClose={onClose}
                />
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 sm:col-span-2">
                        Nome
                        <input
                            required
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className={inputClassName}
                        />
                    </label>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                        Grupo muscular
                        <input
                            required
                            value={grupoMuscular}
                            onChange={(e) => setGrupoMuscular(e.target.value)}
                            className={inputClassName}
                        />
                    </label>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                        Equipamento
                        <input
                            required
                            value={equipamento}
                            onChange={(e) => setEquipamento(e.target.value)}
                            className={inputClassName}
                        />
                    </label>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 sm:col-span-2">
                        Descrição
                        <textarea
                            required
                            rows={3}
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            className={inputClassName}
                        />
                    </label>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 sm:col-span-2">
                        Instruções de execução
                        <textarea
                            required
                            rows={4}
                            value={instrucoesExecucao}
                            onChange={(e) => setInstrucoesExecucao(e.target.value)}
                            className={inputClassName}
                        />
                    </label>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl px-4 py-2 font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        Cancelar
                    </button>
                    <button
                        disabled={salvando || (!modeloMidia && !exercicio)}
                        type="submit"
                        className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Salvar exercício
                    </button>
                </div>
            </form>
        </AdminModal>
    )
}
