import { useState } from "react"
import { useNavigate } from "react-router"
import HistoricoTab from "../components/abas/HistoricoTab"
import InicioTab from "../components/abas/InicioTab"
import PerfilTab from "../components/abas/PerfilTab"
import TreinosTab from "../components/abas/TreinosTab"
import NavegacaoPrincipal, { NavegacaoMobile, type AbaPrincipal } from "../components/navegacao/NavegacaoPrincipal"
import { useAutenticacao } from "../hooks/use-autenticacao"
import { useTema } from "../hooks/use-tema"
import { atualizarPreferenciaTema } from "../services/preferencias-usuario"

export default function AlunoHomePage() {
    const { usuario, sair, entrar } = useAutenticacao()
    const navigate = useNavigate()
    const { tema, alternarTema, definirTema } = useTema(usuario?.preferenciaTema)
    const [abaAtiva, setAbaAtiva] = useState<AbaPrincipal>("inicio")

    if (!usuario || usuario.tipo !== "ALUNO") {
        return (
            <div className="p-6 text-center">
                <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Acesso restrito</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-300">Apenas alunos podem acessar esta página.</p>
            </div>
        )
    }

    const usuarioAtual = usuario

    function encerrarSessao() {
        sair()
        navigate("/login")
    }

    async function alterarPreferenciaTema(novoTema: "claro" | "escuro") {
        if (!usuario) {
            return
        }

        const preferenciaTema = novoTema === "escuro" ? "ESCURO" : "CLARO"
        const usuarioAtualizado = await atualizarPreferenciaTema(usuario, preferenciaTema)
        entrar(usuarioAtualizado)
        definirTema(novoTema)
    }

    function renderizarAba() {
        switch (abaAtiva) {
            case "treinos":
                return <TreinosTab usuarioId={usuarioAtual.id} />
            case "historico":
                return <HistoricoTab usuarioId={usuarioAtual.id} />
            case "perfil":
                return <PerfilTab usuarioId={usuarioAtual.id} tema={tema} onDefinirTema={alterarPreferenciaTema} />
            case "inicio":
            default:
                return <InicioTab usuarioId={usuarioAtual.id} />
        }
    }

    return (
        <div className="min-h-screen bg-[#f8faf9] pb-24 text-slate-900 transition-colors dark:bg-[#101412] dark:text-slate-100 md:pb-0">
            <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">Rep Max</p>
                        <p className="mt-1 text-lg font-bold text-slate-950 dark:text-white">Olá, {usuario.nome}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={alternarTema}
                            aria-label={`Trocar para tema ${tema === "claro" ? "escuro" : "claro"}`}
                            className="rounded-xl bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-800 transition hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900"
                        >
                            {tema === "claro" ? "☾" : "☀"}
                        </button>
                        <button
                            type="button"
                            onClick={encerrarSessao}
                            className="rounded-xl bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-800 transition hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            <div className="mx-auto w-full max-w-6xl">
                <NavegacaoPrincipal abaAtiva={abaAtiva} onSelecionar={setAbaAtiva} />

                <main className="px-5 py-8 lg:px-8">{renderizarAba()}</main>
            </div>

            <NavegacaoMobile abaAtiva={abaAtiva} onSelecionar={setAbaAtiva} />
        </div>
    )
}
