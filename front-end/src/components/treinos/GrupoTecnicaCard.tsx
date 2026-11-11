import type { ItemRotinaTecnica } from "../../types/aluno-dashboard"
import type { ExercicioCatalogo } from "../../types/exercicio"
import ExercicioRotinaCard from "./ExercicioRotinaCard"
import type { TreinoEditor } from "./treino-editor"

interface Props {
    bloco: ItemRotinaTecnica
    indice: number
    total: number
    exercicios: ExercicioCatalogo[]
    movimentoAnimado: TreinoEditor["movimentoAnimado"]
    onMoverGrupo: (id: number, direcao: "cima" | "baixo") => void
    onAdicionar: (grupo: ItemRotinaTecnica) => void
    onMoverNormal: (id: number, direcao: "cima" | "baixo") => void
    onMoverExercicio: (
        exercicioId: number,
        grupoId: number,
        direcao: "esquerda" | "direita",
    ) => void
    onSeries: (id: number, valor: number) => void
    onTrocar: (id: number, grupoId: number) => void
    onRemover: (exercicioId: number, grupoId: number) => void
    rotulo: string
}

export default function GrupoTecnicaCard({
    bloco,
    indice,
    total,
    exercicios,
    movimentoAnimado,
    onMoverGrupo,
    onAdicionar,
    onMoverNormal,
    onMoverExercicio,
    onSeries,
    onTrocar,
    onRemover,
    rotulo,
}: Props) {
    const botao =
        "rounded-lg border border-slate-300 bg-white px-3 py-0.5 text-xl font-bold leading-none text-emerald-700 transition hover:bg-emerald-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-700 dark:bg-slate-950 dark:text-emerald-400 dark:hover:bg-emerald-950"
    const movimento =
        movimentoAnimado?.itemId === bloco.id
            ? movimentoAnimado.direcao === "cima"
                ? "-translate-y-2"
                : "translate-y-2"
            : "translate-y-0"
    const membros = [...bloco.exercicios].sort((a, b) => a.ordemNoGrupo - b.ordemNoGrupo)
    return (
        <div className={`flex gap-3 transition-transform duration-200 ${movimento}`}>
            <div className="pt-5 text-xl font-black text-emerald-700 dark:text-emerald-400">
                {indice + 1}º
            </div>
            <div className="relative min-w-0 flex-1 rounded-3xl border border-emerald-200 bg-emerald-50/50 p-4 pb-14 pt-14 dark:border-emerald-900 dark:bg-emerald-950/20">
                <button
                    type="button"
                    disabled={indice <= 0}
                    onClick={() => onMoverGrupo(bloco.id, "cima")}
                    aria-label="Mover grupo para cima"
                    className={`absolute right-3 top-3 ${botao}`}
                >
                    ⭡
                </button>
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                            {rotulo}
                        </p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            Uma rodada passa por todos os exercícios.
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                            <span>Séries do grupo</span>
                            <button
                                type="button"
                                onClick={() => onSeries(bloco.id, -1)}
                                className="h-7 w-7 rounded-lg border border-slate-300 dark:border-slate-700"
                            >
                                −
                            </button>
                            <strong>{bloco.quantidadeSeries}</strong>
                            <button
                                type="button"
                                onClick={() => onSeries(bloco.id, 1)}
                                className="h-7 w-7 rounded-lg border border-slate-300 dark:border-slate-700"
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => onAdicionar(bloco)}
                        className="rounded-xl bg-emerald-600 px-3 py-2 font-bold text-white"
                    >
                        + Exercício
                    </button>
                </div>
                {membros.length === 0 ? (
                    <div className="mt-4 rounded-2xl border border-dashed border-emerald-400 p-6 text-center text-sm text-emerald-800 dark:text-emerald-200">
                        Grupo vazio. Clique em “+ Exercício” para adicionar.
                    </div>
                ) : (
                    <div className="mt-4 flex flex-col gap-3 md:flex-row">
                        {membros.map((membro, indiceMembro) => {
                            const exercicio = exercicios.find(
                                (opcao) => opcao.id === membro.exercicioId,
                            )
                            return exercicio ? (
                                <ExercicioRotinaCard
                                    key={membro.exercicioId}
                                    item={{
                                        id: membro.exercicioId,
                                        tipoItem: "EXERCICIO",
                                        exercicioId: membro.exercicioId,
                                        quantidadeSeries: bloco.quantidadeSeries,
                                        tipoTecnica: "NORMAL",
                                    }}
                                    exercicio={exercicio}
                                    itensOrdenados={membros.map((item) => ({
                                        id: item.exercicioId,
                                        exercicioId: item.exercicioId,
                                        quantidadeSeries: bloco.quantidadeSeries,
                                        tipoTecnica: "NORMAL" as const,
                                        tipoItem: "EXERCICIO" as const,
                                    }))}
                                    movimentoAnimado={movimentoAnimado}
                                    grupo={{ id: bloco.id }}
                                    onMoverNormal={onMoverNormal}
                                    onMoverGrupo={onMoverExercicio}
                                    onSeries={onSeries}
                                    onTrocar={(id) => onTrocar(id, bloco.id)}
                                    onRemover={(id) => onRemover(id, bloco.id)}
                                    indice={indiceMembro}
                                />
                            ) : null
                        })}
                    </div>
                )}
                <button
                    type="button"
                    disabled={indice >= total - 1}
                    onClick={() => onMoverGrupo(bloco.id, "baixo")}
                    aria-label="Mover grupo para baixo"
                    className={`absolute bottom-3 right-3 ${botao}`}
                >
                    ⭣
                </button>
            </div>
        </div>
    )
}
