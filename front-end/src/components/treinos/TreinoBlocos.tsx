import type { RotinaDashboardInput } from "../../types/aluno-dashboard"
import type { ExercicioCatalogo } from "../../types/exercicio"
import ExercicioRotinaCard from "./ExercicioRotinaCard"
import GrupoTecnicaCard from "./GrupoTecnicaCard"
import { quantidadeTecnica, type TreinoEditor } from "./treino-editor"

export default function TreinoBlocos({
    rotina,
    exercicios,
    editor,
}: {
    rotina: RotinaDashboardInput
    exercicios: ExercicioCatalogo[]
    editor: TreinoEditor
}) {
    const normais = rotina.itens.filter((item) => item.tipoItem === "EXERCICIO")
    return (
        <section className="m-0 w-full">
            <h3 className="text-lg font-bold text-slate-950 dark:text-white">Itens do treino</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Use os botões direcionais para reorganizar exercícios e grupos.
            </p>
            <div className="mt-4 space-y-4">
                {editor.blocos.map((bloco, indice) =>
                    bloco.tipo === "normal" ? (
                        <div key={bloco.item.id} className="w-[98%]">
                            {(() => {
                                const exercicio = exercicios.find(
                                    (item) => item.id === bloco.item.exercicioId,
                                )
                                return exercicio ? (
                                    <ExercicioRotinaCard
                                        item={bloco.item}
                                        exercicio={exercicio}
                                        itensOrdenados={normais}
                                        movimentoAnimado={editor.movimentoAnimado}
                                        onMoverNormal={editor.moverNormal}
                                        onMoverGrupo={() => undefined}
                                        onSeries={editor.alterarSeries}
                                        onTrocar={(id) =>
                                            editor.setExercicioParaTrocar({ exercicioId: id })
                                        }
                                        onRemover={(id) => editor.removerExercicio(id)}
                                        ordem={indice + 1}
                                    />
                                ) : null
                            })()}
                        </div>
                    ) : (
                        <GrupoTecnicaCard
                            key={bloco.item.id}
                            bloco={bloco.item}
                            indice={indice}
                            total={editor.blocos.length}
                            exercicios={exercicios}
                            movimentoAnimado={editor.movimentoAnimado}
                            onMoverGrupo={editor.moverGrupo}
                            onAdicionar={editor.setGrupoParaAdicionar}
                            onMoverNormal={editor.moverNormal}
                            onMoverExercicio={editor.moverNoGrupo}
                            onSeries={editor.alterarSeries}
                            onTrocar={(id, grupoId) =>
                                editor.setExercicioParaTrocar({ exercicioId: id, grupoId })
                            }
                            onRemover={editor.removerExercicio}
                            rotulo={quantidadeTecnica[bloco.item.tipoTecnica].rotulo}
                            ordem={indice + 1}
                        />
                    ),
                )}
            </div>
        </section>
    )
}
