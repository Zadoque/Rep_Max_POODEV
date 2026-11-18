import type { ItemRotinaExercicio } from "../../types/aluno-dashboard"
import type { ExercicioCatalogo } from "../../types/exercicio"
import ExercicioAnimacao from "../exercicios/ExercicioAnimacao"

interface Props {
    item: ItemRotinaExercicio
    exercicio: ExercicioCatalogo
    itensOrdenados: ItemRotinaExercicio[]
    movimentoAnimado: { itemId?: number; exercicioId?: number; direcao: string } | null
    grupo?: { id: number }
    indice?: number
    ordem?: number
    onMoverNormal: (id: number, direcao: "cima" | "baixo") => void
    onMoverGrupo: (exercicioId: number, grupoId: number, direcao: "esquerda" | "direita") => void
    onSeries: (id: number, valor: number) => void
    onTrocar: (id: number, grupoId?: number) => void
    onRemover: (exercicioId: number, grupoId?: number) => void
}

export default function ExercicioRotinaCard({
    item,
    exercicio,
    itensOrdenados,
    movimentoAnimado,
    grupo,
    indice: indiceGrupo,
    onMoverNormal,
    onMoverGrupo,
    onSeries,
    onTrocar,
    onRemover,
    ordem,
}: Props) {
    const indice = grupo
        ? (indiceGrupo ?? 0)
        : itensOrdenados.findIndex((opcao) => opcao.id === item.id)
    const animando =
        movimentoAnimado?.exercicioId === item.exercicioId || movimentoAnimado?.itemId === item.id
    const deslocamento =
        animando &&
        (movimentoAnimado?.direcao === "cima" || movimentoAnimado?.direcao === "esquerda")
            ? "-translate-x-2 -translate-y-1"
            : animando
              ? "translate-x-2 translate-y-1"
              : "translate-x-0 translate-y-0"
    const botao =
        "rounded-lg border border-slate-300 bg-white px-3 py-1 text-xl font-bold text-emerald-700 transition hover:bg-emerald-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-700 dark:bg-slate-950 dark:text-emerald-400 dark:hover:bg-emerald-950"
    return (
        <article
            className={`relative min-w-0 flex-1 rounded-2xl border border-slate-200 p-4 pb-14 pt-14 transition-transform duration-200 dark:border-slate-800 ${deslocamento}`}
        >
            {ordem && (
                <span className="absolute left-3 top-3 text-xl font-black text-emerald-700 dark:text-emerald-400">
                    {ordem}º
                </span>
            )}
            {grupo ? (
                <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
                    <button
                        type="button"
                        disabled={indice <= 0}
                        onClick={() => onMoverGrupo(item.exercicioId, grupo.id, "esquerda")}
                        aria-label={`Mover ${exercicio.nome} para a esquerda`}
                        className={botao}
                    >
                        ⭠
                    </button>
                    <button
                        type="button"
                        disabled={indice >= itensOrdenados.length - 1}
                        onClick={() => onMoverGrupo(item.exercicioId, grupo.id, "direita")}
                        aria-label={`Mover ${exercicio.nome} para a direita`}
                        className={botao}
                    >
                        ⭢
                    </button>
                </div>
            ) : (
                <>
                    <button
                        type="button"
                        disabled={indice <= 0}
                        onClick={() => onMoverNormal(item.id, "cima")}
                        aria-label={`Mover ${exercicio.nome} para cima`}
                        className={`absolute right-3 top-3 ${botao}`}
                    >
                        ⭡
                    </button>
                    <button
                        type="button"
                        disabled={indice >= itensOrdenados.length - 1}
                        onClick={() => onMoverNormal(item.id, "baixo")}
                        aria-label={`Mover ${exercicio.nome} para baixo`}
                        className={`absolute bottom-3 right-3 ${botao}`}
                    >
                        ⭣
                    </button>
                </>
            )}
            <h4 className="font-bold text-slate-950 dark:text-white">{exercicio.nome}</h4>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {exercicio.grupoMuscular} · {exercicio.equipamento}
            </p>
            <ExercicioAnimacao exercicio={exercicio} />
            <div className="mt-3 flex flex-wrap items-center gap-2">
                {!grupo && (
                    <>
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                            Séries
                        </span>
                        <button
                            type="button"
                            onClick={() => onSeries(item.id, -1)}
                            className="h-8 w-8 rounded-lg border border-slate-300 text-lg dark:border-slate-700"
                        >
                            −
                        </button>
                        <strong>{item.quantidadeSeries}</strong>
                        <button
                            type="button"
                            onClick={() => onSeries(item.id, 1)}
                            className="h-8 w-8 rounded-lg border border-slate-300 text-lg dark:border-slate-700"
                        >
                            +
                        </button>
                    </>
                )}
                <button
                    type="button"
                    onClick={() => onTrocar(item.exercicioId, grupo?.id)}
                    className="rounded-lg px-2 py-1 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400"
                >
                    Trocar
                </button>
                <button
                    type="button"
                    onClick={() => onRemover(item.exercicioId, grupo?.id)}
                    className="rounded-lg px-2 py-1 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400"
                >
                    Remover
                </button>
            </div>
        </article>
    )
}
