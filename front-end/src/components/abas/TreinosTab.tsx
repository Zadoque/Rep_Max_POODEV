import { useCallback, useEffect, useState, type FormEvent } from "react"
import ExercicioAnimacao from "../exercicios/ExercicioAnimacao"
import { atualizarRotinaAluno, buscarExercicios, buscarRotinasAluno, criarRotinaAluno } from "../../services/aluno-dashboard"
import type { ExercicioCatalogo } from "../../types/exercicio"
import type { ExercicioRotina, RotinaDashboard, RotinaDashboardInput } from "../../types/aluno-dashboard"

type ModoModal = "criar" | "editar"

interface PreviewArraste {
    exercicioId: number
    x: number
    y: number
    largura: number
    altura: number
}

const formularioVazio: RotinaDashboardInput = { nome: "", descricao: "", exercicios: [] }

const formatarData = (valor: string) =>
    new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(valor))

interface ModalTreinoProps {
    modo: ModoModal
    rotina: RotinaDashboardInput
    exercicios: ExercicioCatalogo[]
    atualizadoEm?: string
    onChange: (rotina: RotinaDashboardInput) => void
    onClose: () => void
    onSave: (evento: FormEvent<HTMLFormElement>) => void
}

interface ModalTrocaExercicioProps {
    exercicioAtual: ExercicioCatalogo
    exerciciosDisponiveis: ExercicioCatalogo[]
    onClose: () => void
    onConfirmar: (exercicioId: number) => void
}

function ModalTrocaExercicio({ exercicioAtual, exerciciosDisponiveis, onClose, onConfirmar }: ModalTrocaExercicioProps) {
    const [novoExercicioId, setNovoExercicioId] = useState("")
    const novoExercicio = exerciciosDisponiveis.find((exercicio) => exercicio.id === Number(novoExercicioId))

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-5" role="presentation" onMouseDown={onClose}>
            <section role="dialog" aria-modal="true" aria-labelledby="titulo-modal-troca" className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900" onMouseDown={(evento) => evento.stopPropagation()}>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">Editar exercício</p>
                        <h3 id="titulo-modal-troca" className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">Trocar exercício</h3>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Substitua {exercicioAtual.nome} por outro exercício.</p>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Fechar modal de troca" className="rounded-xl px-3 py-2 text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white">×</button>
                </div>

                <select value={novoExercicioId} onChange={(evento) => setNovoExercicioId(evento.target.value)} className="mt-6 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-emerald-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                    <option value="">Selecione o novo exercício</option>
                    {exerciciosDisponiveis.map((exercicio) => <option key={exercicio.id} value={exercicio.id}>{exercicio.nome} · {exercicio.grupoMuscular}</option>)}
                </select>

                {novoExercicio && (
                    <div className="mt-4 flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40">
                        <ExercicioAnimacao exercicio={novoExercicio} />
                        <div>
                            <h4 className="font-bold text-slate-950 dark:text-white">{novoExercicio.nome}</h4>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{novoExercicio.grupoMuscular} · {novoExercicio.equipamento}</p>
                        </div>
                    </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 font-semibold text-slate-600 transition hover:bg-slate-100 active:scale-95 dark:text-slate-300 dark:hover:bg-slate-800">Cancelar</button>
                    <button type="button" disabled={!novoExercicio} onClick={() => novoExercicio && onConfirmar(novoExercicio.id)} className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white transition hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-700 dark:hover:bg-emerald-600">Trocar exercício</button>
                </div>
            </section>
        </div>
    )
}

function ModalTreino({ modo, rotina, exercicios, atualizadoEm, onChange, onClose, onSave }: ModalTreinoProps) {
    const [exercicioParaAdicionar, setExercicioParaAdicionar] = useState("")
    const [exercicioArrastado, setExercicioArrastado] = useState<number | null>(null)
    const [indiceArrastado, setIndiceArrastado] = useState<number | null>(null)
    const [indiceDestino, setIndiceDestino] = useState<number | null>(null)
    const [alturaExercicioArrastado, setAlturaExercicioArrastado] = useState<number | null>(null)
    const [previewArraste, setPreviewArraste] = useState<PreviewArraste | null>(null)
    const [exercicioParaTrocar, setExercicioParaTrocar] = useState<number | null>(null)
    const exerciciosAdicionados = new Set(rotina.exercicios.map((item) => item.exercicioId))
    const exerciciosDisponiveis = exercicios.filter((exercicio) => !exerciciosAdicionados.has(exercicio.id))
    const exercicioSelecionado = exercicios.find((exercicio) => exercicio.id === Number(exercicioParaAdicionar))

    function adicionarExercicio() {
        const exercicioId = Number(exercicioParaAdicionar)
        if (!exercicioId) return

        const novoExercicio: ExercicioRotina = { exercicioId, quantidadeSeries: 3 }
        onChange({ ...rotina, exercicios: [...rotina.exercicios, novoExercicio] })
        setExercicioParaAdicionar("")
    }

    function alterarSeries(exercicioId: number, variacao: number) {
        onChange({
            ...rotina,
            exercicios: rotina.exercicios.map((item) => item.exercicioId === exercicioId
                ? { ...item, quantidadeSeries: Math.max(1, item.quantidadeSeries + variacao) }
                : item),
        })
    }

    function removerExercicio(exercicioId: number) {
        onChange({ ...rotina, exercicios: rotina.exercicios.filter((item) => item.exercicioId !== exercicioId) })
    }

    function trocarExercicio(exercicioAtualId: number, novoExercicioId: number) {
        onChange({
            ...rotina,
            exercicios: rotina.exercicios.map((item) => item.exercicioId === exercicioAtualId ? { ...item, exercicioId: novoExercicioId } : item),
        })
        setExercicioParaTrocar(null)
    }

    const limparEstadoArraste = useCallback(() => {
        setExercicioArrastado(null)
        setIndiceArrastado(null)
        setIndiceDestino(null)
        setAlturaExercicioArrastado(null)
        setPreviewArraste(null)
    }, [])

    function iniciarArraste(evento: React.PointerEvent<HTMLButtonElement>, exercicioId: number, indice: number) {
        evento.preventDefault()
        const artigo = evento.currentTarget.closest("article")
        const dimensoes = artigo?.getBoundingClientRect()

        setExercicioArrastado(exercicioId)
        setIndiceArrastado(indice)
        setIndiceDestino(indice)
        setAlturaExercicioArrastado(dimensoes?.height ?? null)
        setPreviewArraste({
            exercicioId,
            x: evento.clientX - (dimensoes?.width ?? 0) / 2,
            y: evento.clientY - 28,
            largura: dimensoes?.width ?? 320,
            altura: dimensoes?.height ?? 240,
        })
    }

    const reordenarExercicio = useCallback((indiceDestinoSolto: number) => {
        if (indiceArrastado === null || indiceArrastado === indiceDestinoSolto) {
            limparEstadoArraste()
            return
        }

        const exerciciosOrdenados = [...rotina.exercicios]
        const [itemMovido] = exerciciosOrdenados.splice(indiceArrastado, 1)
        const indiceInsercao = indiceDestinoSolto > indiceArrastado ? indiceDestinoSolto - 1 : indiceDestinoSolto

        exerciciosOrdenados.splice(indiceInsercao, 0, itemMovido)
        onChange({ ...rotina, exercicios: exerciciosOrdenados })
        limparEstadoArraste()
    }, [indiceArrastado, limparEstadoArraste, onChange, rotina])

    useEffect(() => {
        if (!previewArraste) return

        function acompanharPonteiro(evento: PointerEvent) {
            setPreviewArraste((atual) => atual ? { ...atual, x: evento.clientX - atual.largura / 2, y: evento.clientY - 28 } : null)
        }

        function soltarExercicio() {
            reordenarExercicio(indiceDestino ?? indiceArrastado ?? 0)
        }

        window.addEventListener("pointermove", acompanharPonteiro)
        window.addEventListener("pointerup", soltarExercicio, { once: true })

        return () => {
            window.removeEventListener("pointermove", acompanharPonteiro)
            window.removeEventListener("pointerup", soltarExercicio)
        }
    }, [previewArraste, indiceDestino, indiceArrastado, reordenarExercicio])

    const exercicioEmMovimento = exercicioArrastado !== null ? exercicios.find((item) => item.id === exercicioArrastado) : null

    return (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/60 p-4 sm:p-6" role="presentation" onMouseDown={onClose}>
            <section role="dialog" aria-modal="true" aria-labelledby="titulo-modal-treino" className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8 dark:bg-slate-900" onMouseDown={(evento) => evento.stopPropagation()}>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">Biblioteca</p>
                        <h2 id="titulo-modal-treino" className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{modo === "criar" ? "Criar treino" : "Ver treino"}</h2>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Fechar modal" className="rounded-xl px-3 py-2 text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white">×</button>
                </div>

                <form className="mt-6 space-y-6" onSubmit={onSave}>
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                            Nome do treino
                            <input required value={rotina.nome} onChange={(evento) => onChange({ ...rotina, nome: evento.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-emerald-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                        </label>
                        <div className="flex items-end text-sm text-slate-500 dark:text-slate-400">
                            {rotina.exercicios.length} {rotina.exercicios.length === 1 ? "exercício" : "exercícios"} selecionados
                        </div>
                    </div>

                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Descrição
                        <textarea required rows={3} value={rotina.descricao} onChange={(evento) => onChange({ ...rotina, descricao: evento.target.value })} className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-emerald-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                    </label>

                    <section>
                        <h3 className="text-lg font-bold text-slate-950 dark:text-white">Exercícios do treino</h3>
                        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                            <select value={exercicioParaAdicionar} onChange={(evento) => setExercicioParaAdicionar(evento.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-emerald-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                                <option value="">Selecione um exercício</option>
                                {exerciciosDisponiveis.map((exercicio) => <option key={exercicio.id} value={exercicio.id}>{exercicio.nome} · {exercicio.grupoMuscular}</option>)}
                            </select>
                            <button type="button" onClick={adicionarExercicio} disabled={!exercicioParaAdicionar} className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white transition hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-700 dark:hover:bg-emerald-600">+ Adicionar</button>
                        </div>
                        {exercicioSelecionado && (
                            <div className="mt-4 flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40">
                                <ExercicioAnimacao exercicio={exercicioSelecionado} />
                                <div>
                                    <h4 className="font-bold text-slate-950 dark:text-white">{exercicioSelecionado.nome}</h4>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{exercicioSelecionado.grupoMuscular} · {exercicioSelecionado.equipamento}</p>
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{exercicioSelecionado.instrucoesExecucao}</p>
                                </div>
                            </div>
                        )}

                        <div className="mt-4 space-y-3">
                            {rotina.exercicios.length === 0 && <p className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">Adicione pelo menos um exercício ao treino.</p>}
                            {rotina.exercicios.length > 0 && <p className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><span aria-hidden="true" className="inline-flex flex-col gap-0.5"><span className="h-0.5 w-4 rounded-full bg-slate-500" /><span className="h-0.5 w-4 rounded-full bg-slate-500" /><span className="h-0.5 w-4 rounded-full bg-slate-500" /></span>Segure e arraste para reordenar</p>}
                            {rotina.exercicios.map((item, indice) => {
                                const exercicio = exercicios.find((opcao) => opcao.id === item.exercicioId)
                                if (!exercicio) return null

                                return (
                                    <div key={item.exercicioId} className="relative pl-12">
                                        <span
                                            className="absolute left-0 -translate-y-1/2 text-xl font-black text-emerald-700 dark:text-emerald-400"
                                            style={{ top: exercicioEmMovimento && indiceDestino === indice && indiceArrastado !== indice && alturaExercicioArrastado ? `${alturaExercicioArrastado / 2}px` : "50%" }}
                                            aria-label={`Posição ${indice + 1}`}
                                        >
                                            {indice + 1}º
                                        </span>
                                        {exercicioEmMovimento && indiceDestino === indice && indiceArrastado !== indice && (
                                            <div aria-hidden="true" style={{ height: alturaExercicioArrastado ? `${alturaExercicioArrastado}px` : undefined }} className="mb-3 flex flex-col gap-4 overflow-hidden rounded-2xl border border-dashed border-emerald-500 bg-emerald-50/50 p-4 opacity-50 dark:border-emerald-400 dark:bg-emerald-950/30">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div>
                                                        <p className="font-bold text-slate-950 dark:text-white">{exercicioEmMovimento.nome}</p>
                                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{exercicioEmMovimento.grupoMuscular} · {exercicioEmMovimento.equipamento}</p>
                                                    </div>
                                                    <span className="text-xl text-slate-400">☰</span>
                                                </div>
                                                <ExercicioAnimacao exercicio={exercicioEmMovimento} />
                                            </div>
                                        )}
                                        {exercicioArrastado === item.exercicioId ? (
                                            <div aria-hidden="true" style={{ height: alturaExercicioArrastado ? `${alturaExercicioArrastado}px` : undefined }} className="rounded-2xl border border-dashed border-emerald-400 bg-emerald-50/40 dark:border-emerald-700 dark:bg-emerald-950/20" />
                                        ) : <article
                                            onPointerEnter={() => {
                                                if (previewArraste && indice !== indiceArrastado) setIndiceDestino(indice)
                                            }}
                                            className={`flex flex-col gap-4 rounded-2xl border p-4 transition dark:border-slate-800 ${indiceDestino === indice && indiceArrastado !== null && indiceArrastado !== indice ? "border-emerald-500 bg-emerald-50/30 dark:border-emerald-500 dark:bg-emerald-950/30" : "border-slate-200"}`}
                                        >
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <h4 className="font-bold text-slate-950 dark:text-white">{exercicio.nome}</h4>
                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{exercicio.grupoMuscular} · {exercicio.equipamento}</p>
                                            </div>
                                            <button type="button" onPointerDown={(evento) => iniciarArraste(evento, item.exercicioId, indice)} aria-label={`Segure e arraste para reordenar ${exercicio.nome}`} className="flex h-9 w-9 shrink-0 cursor-grab flex-col items-center justify-center gap-1 rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 active:cursor-grabbing active:scale-90 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                                                <span className="h-0.5 w-4 rounded-full bg-current" />
                                                <span className="h-0.5 w-4 rounded-full bg-current" />
                                                <span className="h-0.5 w-4 rounded-full bg-current" />
                                            </button>
                                        </div>
                                        <ExercicioAnimacao exercicio={exercicio} />
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Séries</span>
                                            <button type="button" onClick={() => alterarSeries(item.exercicioId, -1)} aria-label={`Diminuir séries de ${exercicio.nome}`} className="h-9 w-9 rounded-lg border border-slate-300 text-lg font-bold text-slate-700 transition hover:bg-slate-100 active:scale-90 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">−</button>
                                            <strong className="min-w-5 text-center text-slate-950 dark:text-white">{item.quantidadeSeries}</strong>
                                            <button type="button" onClick={() => alterarSeries(item.exercicioId, 1)} aria-label={`Aumentar séries de ${exercicio.nome}`} className="h-9 w-9 rounded-lg border border-slate-300 text-lg font-bold text-slate-700 transition hover:bg-slate-100 active:scale-90 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">+</button>
                                            <button type="button" onClick={() => setExercicioParaTrocar(item.exercicioId)} className="rounded-lg px-2 py-1 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 active:scale-95 dark:text-emerald-400 dark:hover:bg-emerald-950">Trocar</button>
                                            <button type="button" onClick={() => removerExercicio(item.exercicioId)} className="rounded-lg px-2 py-1 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 active:scale-95 dark:text-rose-400 dark:hover:bg-rose-950">Remover</button>
                                        </div>
                                        </article>}
                                    </div>
                                )
                            })}
                        </div>
                    </section>

                    {atualizadoEm && <p className="text-xs text-slate-500 dark:text-slate-400">Atualizado em {formatarData(atualizadoEm)}</p>}
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 font-semibold text-slate-600 transition hover:bg-slate-100 active:scale-95 dark:text-slate-300 dark:hover:bg-slate-800">Cancelar</button>
                        <button type="submit" disabled={rotina.exercicios.length === 0} className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 active:translate-y-0 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-700 dark:hover:bg-emerald-600">{modo === "criar" ? "Criar treino" : "Salvar alterações"}</button>
                    </div>
                </form>
            </section>
            {exercicioParaTrocar !== null && (() => {
                const exercicioAtual = exercicios.find((item) => item.id === exercicioParaTrocar)
                if (!exercicioAtual) return null

                const idsEmUso = new Set(rotina.exercicios.map((item) => item.exercicioId))
                const exerciciosDisponiveis = exercicios.filter((item) => item.id !== exercicioParaTrocar && !idsEmUso.has(item.id))

                return <ModalTrocaExercicio exercicioAtual={exercicioAtual} exerciciosDisponiveis={exerciciosDisponiveis} onClose={() => setExercicioParaTrocar(null)} onConfirmar={(novoId) => trocarExercicio(exercicioParaTrocar, novoId)} />
            })()}
            {previewArraste && exercicioEmMovimento && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none fixed z-50 overflow-hidden rounded-2xl border border-emerald-500 bg-white p-4 opacity-95 shadow-2xl dark:bg-slate-900"
                    style={{ left: previewArraste.x, top: previewArraste.y, width: previewArraste.largura, height: previewArraste.altura }}
                >
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="font-bold text-slate-950 dark:text-white">{exercicioEmMovimento.nome}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Arrastando para a posição {(indiceDestino ?? 0) + 1}</p>
                        </div>
                        <span className="text-xl text-slate-400">☰</span>
                    </div>
                    <div className="mt-3 flex justify-center">
                        <ExercicioAnimacao exercicio={exercicioEmMovimento} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default function TreinosTab({ usuarioId }: { usuarioId: number }) {
    const [rotinas, setRotinas] = useState<RotinaDashboard[]>([])
    const [exercicios, setExercicios] = useState<ExercicioCatalogo[]>([])
    const [carregando, setCarregando] = useState(true)
    const [modalAberto, setModalAberto] = useState(false)
    const [modoModal, setModoModal] = useState<ModoModal>("criar")
    const [rotinaSelecionada, setRotinaSelecionada] = useState<RotinaDashboard | null>(null)
    const [formulario, setFormulario] = useState<RotinaDashboardInput>(formularioVazio)

    useEffect(() => {
        let ativo = true
        Promise.all([buscarRotinasAluno(usuarioId), buscarExercicios()]).then(([rotinasResposta, exerciciosResposta]) => {
            if (ativo) {
                setRotinas(rotinasResposta)
                setExercicios(exerciciosResposta)
                setCarregando(false)
            }
        })
        return () => { ativo = false }
    }, [usuarioId])

    function abrirCriacao() {
        setModoModal("criar")
        setRotinaSelecionada(null)
        setFormulario({ ...formularioVazio, exercicios: [] })
        setModalAberto(true)
    }

    function abrirEdicao(rotina: RotinaDashboard) {
        setModoModal("editar")
        setRotinaSelecionada(rotina)
        setFormulario({ nome: rotina.nome, descricao: rotina.descricao, exercicios: rotina.exercicios.map((item) => ({ ...item })) })
        setModalAberto(true)
    }

    async function salvarTreino(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault()
        const rotinaSalva = modoModal === "criar"
            ? await criarRotinaAluno(usuarioId, formulario)
            : await atualizarRotinaAluno(usuarioId, rotinaSelecionada?.id ?? 0, formulario)

        setRotinas((atuais) => modoModal === "criar" ? [...atuais, rotinaSalva] : atuais.map((rotina) => rotina.id === rotinaSalva.id ? rotinaSalva : rotina))
        setModalAberto(false)
    }

    return (
        <div className="space-y-6">
            <section className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">Biblioteca</p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Treinos salvos</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">Suas rotinas prontas para o próximo treino.</p>
                </div>
                <button type="button" onClick={abrirCriacao} className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 active:translate-y-0 active:scale-95 dark:bg-emerald-700 dark:hover:bg-emerald-600">+ Criar treino</button>
            </section>

            {carregando ? <p className="text-slate-600 dark:text-slate-300">Carregando seus treinos...</p> : (
                <div className="grid gap-4 lg:grid-cols-2">
                    {rotinas.map((rotina) => (
                        <article key={rotina.id} className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-950 dark:text-white">{rotina.nome}</h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{rotina.descricao}</p>
                                </div>
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Ativo</span>
                            </div>
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400">{rotina.exercicios.length} {rotina.exercicios.length === 1 ? "exercício" : "exercícios"}</p>
                                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Atualizado em {formatarData(rotina.atualizadoEm)}</p>
                                </div>
                                <button type="button" onClick={() => abrirEdicao(rotina)} aria-label={`Ver ${rotina.nome}`} className="group inline-flex items-center rounded-xl border border-emerald-200 px-3 py-2 font-bold text-emerald-700 transition duration-150 ease-out hover:-translate-y-0.5 hover:bg-emerald-50 hover:text-emerald-900 active:translate-y-0 active:scale-95 active:bg-emerald-100 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950 dark:hover:text-emerald-300 dark:active:bg-emerald-900">Ver treino <span aria-hidden="true" className="ml-1 transition-transform duration-150 group-hover:translate-x-0.5">→</span></button>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {modalAberto && <ModalTreino modo={modoModal} rotina={formulario} exercicios={exercicios} atualizadoEm={rotinaSelecionada?.atualizadoEm} onChange={setFormulario} onClose={() => setModalAberto(false)} onSave={salvarTreino} />}
        </div>
    )
}
