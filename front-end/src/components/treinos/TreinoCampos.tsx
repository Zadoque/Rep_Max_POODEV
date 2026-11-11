import type { RotinaDashboardInput } from "../../types/aluno-dashboard"
import type { TipoTecnicaCombinada } from "../../types/treino-resumo"
import { quantidadeTecnica, type TreinoEditor } from "./treino-editor"

export default function TreinoCampos({
    rotina,
    onChange,
    editor,
}: {
    rotina: RotinaDashboardInput
    onChange: (rotina: RotinaDashboardInput) => void
    editor: TreinoEditor
}) {
    return (
        <>
            <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Nome do treino
                    <input
                        required
                        value={rotina.nome}
                        onChange={(e) => onChange({ ...rotina, nome: e.target.value })}
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                </label>
                <div className="flex items-end text-sm text-slate-500 dark:text-slate-400">
                    {rotina.itens.length} itens selecionados
                </div>
            </div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Descrição
                <textarea
                    required
                    rows={3}
                    value={rotina.descricao}
                    onChange={(e) => onChange({ ...rotina, descricao: e.target.value })}
                    className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-3 py-2 text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
            </label>
            <section>
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                    Adicionar ao treino
                </h3>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <select
                        value={editor.selecaoAdicionar}
                        onChange={(e) => editor.setSelecaoAdicionar(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                        <option value="">Selecione exercício ou técnica</option>
                        <optgroup label="Técnicas combinadas">
                            {(["BI_SET", "TRI_SET", "MONSTER_SET"] as const).map((tipo) => (
                                <option key={tipo} value={`TECNICA:${tipo}`}>
                                    {quantidadeTecnica[tipo as TipoTecnicaCombinada].rotulo}
                                </option>
                            ))}
                        </optgroup>
                        <optgroup label="Exercícios normais">
                            {editor.exerciciosDisponiveis.map((exercicio) => (
                                <option key={exercicio.id} value={exercicio.id}>
                                    {exercicio.nome} · {exercicio.grupoMuscular}
                                </option>
                            ))}
                        </optgroup>
                    </select>
                    <button
                        type="button"
                        onClick={editor.adicionarSelecao}
                        disabled={!editor.selecaoAdicionar}
                        className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white disabled:opacity-50"
                    >
                        + Adicionar
                    </button>
                </div>
            </section>
        </>
    )
}
