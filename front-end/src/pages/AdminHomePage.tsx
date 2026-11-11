import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router"

import AdminExerciciosLista from "../components/admin/AdminExerciciosLista"
import AdminNavegacao, { type AbaAdmin } from "../components/admin/AdminNavegacao"
import AdminResumo from "../components/admin/AdminResumo"
import AdminUsuariosLista from "../components/admin/AdminUsuariosLista"
import ModalExercicioAdmin from "../components/admin/ModalExercicioAdmin"
import ModalUsuarioAdmin from "../components/admin/ModalUsuarioAdmin"
import { useAutenticacao } from "../hooks/use-autenticacao"
import type { UsuarioMock } from "../mocks/usuarios-mock"
import {
    alterarStatusUsuarioAdmin,
    buscarExerciciosAdmin,
    buscarUsuariosAdmin,
    cadastrarUsuarioAdmin,
    enviarCodigoRedefinicaoAdmin,
    removerAlunoAdmin,
    removerExercicioAdmin,
    salvarExercicioAdmin,
} from "../services/admin"
import type { ExercicioCatalogo } from "../types/exercicio"

export default function AdminHomePage() {
    const { usuario, sair } = useAutenticacao()
    const navigate = useNavigate()
    const [aba, setAba] = useState<AbaAdmin>("usuarios")
    const [usuarios, setUsuarios] = useState<UsuarioMock[]>([])
    const [exercicios, setExercicios] = useState<ExercicioCatalogo[]>([])
    const [busca, setBusca] = useState("")
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)
    const [mensagem, setMensagem] = useState<string | null>(null)
    const [modalUsuarioAberto, setModalUsuarioAberto] = useState(false)
    const [modalExercicio, setModalExercicio] = useState<ExercicioCatalogo | "novo" | null>(null)

    useEffect(() => {
        Promise.all([buscarUsuariosAdmin(), buscarExerciciosAdmin()])
            .then(([usuariosResposta, exerciciosResposta]) => {
                setUsuarios(usuariosResposta)
                setExercicios(exerciciosResposta)
            })
            .catch(() => setErro("Não foi possível carregar os dados administrativos."))
            .finally(() => setCarregando(false))
    }, [])

    const usuariosFiltrados = useMemo(
        () =>
            usuarios.filter((item) =>
                `${item.nome} ${item.email}`.toLowerCase().includes(busca.toLowerCase()),
            ),
        [usuarios, busca],
    )
    const exerciciosFiltrados = useMemo(
        () =>
            exercicios.filter((item) =>
                `${item.nome} ${item.grupoMuscular} ${item.equipamento}`
                    .toLowerCase()
                    .includes(busca.toLowerCase()),
            ),
        [exercicios, busca],
    )

    function trocarAba(novaAba: AbaAdmin) {
        setAba(novaAba)
        setBusca("")
    }
    function mostrarMensagem(texto: string) {
        setErro(null)
        setMensagem(texto)
        window.setTimeout(() => setMensagem(null), 3500)
    }
    async function adicionarUsuario(dados: Pick<UsuarioMock, "nome" | "email" | "tipo">) {
        const novo = await cadastrarUsuarioAdmin(dados)
        setUsuarios((atuais) => [...atuais, novo])
        setModalUsuarioAberto(false)
        mostrarMensagem("Usuário cadastrado com sucesso.")
    }
    async function alternarStatus(item: UsuarioMock) {
        const atualizado = await alterarStatusUsuarioAdmin(item.id, !item.ativo)
        setUsuarios((atuais) => atuais.map((atual) => (atual.id === item.id ? atualizado : atual)))
        mostrarMensagem(`Conta de ${item.nome} ${atualizado.ativo ? "ativada" : "desativada"}.`)
    }
    async function removerAluno(item: UsuarioMock) {
        if (!window.confirm(`Remover o aluno ${item.nome}?`)) return
        await removerAlunoAdmin(item.id)
        setUsuarios((atuais) => atuais.filter((atual) => atual.id !== item.id))
        mostrarMensagem("Aluno removido do sistema.")
    }
    async function enviarCodigo(item: UsuarioMock) {
        await enviarCodigoRedefinicaoAdmin(item)
        mostrarMensagem(`Código de redefinição enviado para ${item.email}.`)
    }
    async function salvarExercicio(dados: Omit<ExercicioCatalogo, "id">, id?: number) {
        const salvo = await salvarExercicioAdmin(dados, id)
        setExercicios((atuais) =>
            id ? atuais.map((atual) => (atual.id === id ? salvo : atual)) : [...atuais, salvo],
        )
        setModalExercicio(null)
        mostrarMensagem("Exercício salvo no catálogo.")
    }
    async function removerExercicio(item: ExercicioCatalogo) {
        if (!window.confirm(`Remover o exercício ${item.nome}?`)) return
        await removerExercicioAdmin(item.id)
        setExercicios((atuais) => atuais.filter((atual) => atual.id !== item.id))
        mostrarMensagem("Exercício removido do catálogo.")
    }

    if (!usuario || usuario.tipo !== "ADMIN") return <main className="p-8">Acesso restrito.</main>

    return (
        <main className="min-h-screen min-w-0 overflow-x-hidden bg-brand-ice text-slate-950 dark:bg-brand-night dark:text-white">
            <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
                    <div>
                        <p className="text-xl font-black tracking-tight">
                            <span className="text-emerald-600">REP</span> MAX
                        </p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Painel administrativo
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden text-sm font-semibold text-slate-600 sm:inline dark:text-slate-300">
                            Olá, {usuario.nome}
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                sair()
                                navigate("/login")
                            }}
                            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>
            <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
                <AdminResumo usuarios={usuarios.length} exercicios={exercicios.length} />
                <AdminNavegacao
                    aba={aba}
                    busca={busca}
                    onAba={trocarAba}
                    onBusca={setBusca}
                    onAdicionar={() =>
                        aba === "usuarios" ? setModalUsuarioAberto(true) : setModalExercicio("novo")
                    }
                />
                {erro && (
                    <p
                        role="alert"
                        className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
                    >
                        {erro}
                    </p>
                )}
                {mensagem && (
                    <p
                        role="status"
                        className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                    >
                        {mensagem}
                    </p>
                )}
                {carregando ? (
                    <p className="mt-8 text-slate-600 dark:text-slate-300">Carregando painel...</p>
                ) : aba === "usuarios" ? (
                    <AdminUsuariosLista
                        usuarios={usuariosFiltrados}
                        usuarioAtualId={usuario.id}
                        onCodigo={enviarCodigo}
                        onStatus={alternarStatus}
                        onRemover={removerAluno}
                    />
                ) : (
                    <AdminExerciciosLista
                        exercicios={exerciciosFiltrados}
                        onEditar={setModalExercicio}
                        onRemover={removerExercicio}
                    />
                )}
            </div>
            {modalUsuarioAberto && (
                <ModalUsuarioAdmin
                    onClose={() => setModalUsuarioAberto(false)}
                    onSave={adicionarUsuario}
                />
            )}
            {modalExercicio && (
                <ModalExercicioAdmin
                    exercicio={modalExercicio === "novo" ? undefined : modalExercicio}
                    modeloMidia={exercicios[0]?.midia}
                    onClose={() => setModalExercicio(null)}
                    onSave={salvarExercicio}
                />
            )}
        </main>
    )
}
