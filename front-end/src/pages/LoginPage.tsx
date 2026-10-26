import { useState } from "react"
import { useNavigate } from "react-router"
import { Eye, EyeOff } from "lucide-react"
import type CredenciaisLogin from "../types/autenticacao"
import logo from "../assets/logo.jpeg"
import { useAutenticacao } from "../hooks/use-autenticacao"
import { useTema } from "../hooks/use-tema"
import { autenticarUsuario } from "../services/autenticacao"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [erroLogin, setErroLogin] = useState<string | null>(null)
    const navigate = useNavigate()
    const { entrar } = useAutenticacao()
    const { definirTema } = useTema()

    function handleLogin() {
        setErroLogin(null)
        const credenciais: CredenciaisLogin = { email, senha }

        autenticarUsuario(credenciais)
            .then((resultado) => {
                if (resultado.sucesso) {
                    definirTema(resultado.usuarioLogado.preferenciaTema === "ESCURO" ? "escuro" : "claro")
                    entrar(resultado.usuarioLogado)
                    navigate("/app")
                    return
                }

                if (resultado.codigoErroLogin === "CONTA_DESATIVADA") {
                    navigate("/desativado")
                    return
                }

                setErroLogin("E-mail ou senha inválidos.")
            })
            .catch(() => setErroLogin("Não foi possível realizar o login. Tente novamente."))
    }

    return (
        <main className="flex h-screen max-h-screen flex-col overflow-hidden bg-[#f8faf9] text-slate-950 dark:bg-[#101412] dark:text-white md:grid md:grid-cols-2">
            <section
                style={{ backgroundImage: `url(${logo})` }}
                className="flex min-h-0 flex-1 animate-login-background-mobile bg-black bg-[length:auto_100%] bg-no-repeat px-6 py-6 text-white [text-shadow:4px_4px_4px_rgba(0,0,0,0.18)] md:animate-login-background md:items-center md:justify-center md:px-8 md:py-10"
            >
                <div className="flex max-w-lg flex-col justify-center md:block">
                    <p className="inline-flex gap-2 text-lg font-bold uppercase tracking-[0.2em] md:text-3xl md:tracking-[0.25em]">
                        <span className="text-[#00c878] [text-shadow:0_1px_3px_rgba(255,255,255,0.95)]">REP</span>
                        <span className="text-white [text-shadow:0_1px_3px_rgba(0,200,120,0.95)]">MAX</span>
                    </p>
                    <h1 className="mt-2 text-xl font-bold leading-tight tracking-tight text-emerald-200 [text-shadow:2px_2px_3px_rgba(0,0,0,0.85)] md:mt-5 md:text-5xl">Olá!<br />Seja bem-vindo de volta.</h1>
                </div>
            </section>

            <section className="flex min-h-0 flex-[4] items-center justify-center overflow-hidden px-5 py-8 sm:px-8 md:h-screen md:flex-none md:py-10">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center md:text-left">
                        <h2 className="mt-8 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Faça seu login</h2>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">Entre para continuar seu treino.</p>
                    </div>

                    <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); handleLogin() }}>
                        <label className="block space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            E-mail
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-emerald-950"
                            />
                        </label>

                        <label className="block space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Senha
                            <div className="relative">
                                <input
                                    type={mostrarSenha ? "text" : "password"}
                                    placeholder="Digite sua senha"
                                    value={senha}
                                    onChange={(event) => setSenha(event.target.value)}
                                    required
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-24 font-normal outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-emerald-950"
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarSenha((visivel) => !visivel)}
                                    className="absolute inset-y-0 right-3 text-xs font-bold text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300"
                                    aria-label={mostrarSenha ? "Esconder senha" : "Mostrar senha"}
                                >
                                    {mostrarSenha ? <EyeOff size={19} strokeWidth={2} aria-hidden="true" /> : <Eye size={19} strokeWidth={2} aria-hidden="true" />}
                                </button>
                            </div>
                            <button type="button" className="block w-full text-right text-sm font-semibold text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300">
                                Esqueceu sua senha?
                            </button>
                        </label>

                        {erroLogin && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-950/50 dark:text-red-300">{erroLogin}</p>}

                        <button type="submit" className="w-full rounded-xl bg-emerald-600 px-4 py-3.5 font-bold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 dark:bg-emerald-700 dark:hover:bg-emerald-600 dark:focus:ring-emerald-950">
                            Entrar
                        </button>
                    </form>
                </div>
            </section>
        </main>
    )
}
