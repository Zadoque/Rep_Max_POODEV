import { type FormEvent, useEffect, useState } from "react"

import {
    atualizarRotinaAluno,
    buscarExercicios,
    buscarRotinasAluno,
    criarRotinaAluno,
} from "../../services/aluno-dashboard"
import type { RotinaDashboard, RotinaDashboardInput } from "../../types/aluno-dashboard"
import type { ExercicioCatalogo } from "../../types/exercicio"
import ModalTreino from "../treinos/ModalTreino"

const formularioVazio: RotinaDashboardInput = { nome: "", descricao: "", itens: [] }
const formatarData = (valor: string) =>
    new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(
        new Date(valor),
    )

export default function TreinosTab({ usuarioId }: { usuarioId: number }) {
    const [rotinas, setRotinas] = useState<RotinaDashboard[]>([])
    const [exercicios, setExercicios] = useState<ExercicioCatalogo[]>([])
    const [carregando, setCarregando] = useState(true)
    const [modalAberto, setModalAberto] = useState(false)
    const [modoModal, setModoModal] = useState<"criar" | "editar">("criar")
    const [rotinaSelecionada, setRotinaSelecionada] = useState<RotinaDashboard | null>(null)
    const [formulario, setFormulario] = useState<RotinaDashboardInput>(formularioVazio)

    useEffect(() => {
        let ativo = true
        Promise.all([buscarRotinasAluno(usuarioId), buscarExercicios()]).then(
            ([rotinasResposta, exerciciosResposta]) => {
                if (ativo) {
                    setRotinas(rotinasResposta)
                    setExercicios(exerciciosResposta)
                    setCarregando(false)
                }
            },
        )
        return () => {
            ativo = false
        }
    }, [usuarioId])

    function abrirCriacao() {
        setModoModal("criar")
        setRotinaSelecionada(null)
        setFormulario({ ...formularioVazio, itens: [] })
        setModalAberto(true)
    }
    function abrirEdicao(rotina: RotinaDashboard) {
        setModoModal("editar")
        setRotinaSelecionada(rotina)
        setFormulario({
            nome: rotina.nome,
            descricao: rotina.descricao,
            itens: rotina.itens.map((item) =>
                item.tipoItem === "TECNICA"
                    ? { ...item, exercicios: item.exercicios.map((membro) => ({ ...membro })) }
                    : { ...item },
            ),
        })
        setModalAberto(true)
    }
    async function salvarTreino(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault()
        const rotinaSalva =
            modoModal === "criar"
                ? await criarRotinaAluno(usuarioId, formulario)
                : await atualizarRotinaAluno(usuarioId, rotinaSelecionada?.id ?? 0, formulario)
        setRotinas((atuais) =>
            modoModal === "criar"
                ? [...atuais, rotinaSalva]
                : atuais.map((rotina) => (rotina.id === rotinaSalva.id ? rotinaSalva : rotina)),
        )
        setModalAberto(false)
    }

    return (
        <div className="space-y-6">
            <section className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-brand text-emerald-700 dark:text-emerald-400">
                        Biblioteca
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                        Treinos salvos
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">
                        Suas rotinas prontas para o próximo treino.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={abrirCriacao}
                    className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white"
                >
                    + Criar treino
                </button>
            </section>
            {carregando ? (
                <p className="text-slate-600 dark:text-slate-300">Carregando seus treinos...</p>
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    {rotinas.map((rotina) => (
                        <article
                            key={rotina.id}
                            className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                                        {rotina.nome}
                                    </h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                        {rotina.descricao}
                                    </p>
                                </div>
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                                    Ativo
                                </span>
                            </div>
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm">
                                <div>
                                    <p className="text-slate-500">
                                        {rotina.itens.reduce(
                                            (total, item) =>
                                                total +
                                                (item.tipoItem === "TECNICA"
                                                    ? item.exercicios.length
                                                    : 1),
                                            0,
                                        )}{" "}
                                        {rotina.itens.reduce(
                                            (total, item) =>
                                                total +
                                                (item.tipoItem === "TECNICA"
                                                    ? item.exercicios.length
                                                    : 1),
                                            0,
                                        ) === 1
                                            ? "exercício"
                                            : "exercícios"}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        Atualizado em {formatarData(rotina.atualizadoEm)}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => abrirEdicao(rotina)}
                                    className="rounded-xl border border-emerald-200 px-3 py-2 font-bold text-emerald-700"
                                >
                                    Ver treino <span aria-hidden="true">→</span>
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
            {modalAberto && (
                <ModalTreino
                    modo={modoModal}
                    rotina={formulario}
                    exercicios={exercicios}
                    atualizadoEm={rotinaSelecionada?.atualizadoEm}
                    onChange={setFormulario}
                    onClose={() => setModalAberto(false)}
                    onSave={salvarTreino}
                />
            )}
        </div>
    )
}
