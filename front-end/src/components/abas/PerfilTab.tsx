import { perfisDashboardMockPorUsuario } from "../../mocks/aluno-dashboard-mock"

interface PerfilTabProps {
    usuarioId: number
    tema: "claro" | "escuro"
    onDefinirTema: (tema: "claro" | "escuro") => void | Promise<void>
}

export default function PerfilTab({ usuarioId, tema, onDefinirTema }: PerfilTabProps) {
    const perfilDashboardMock = perfisDashboardMockPorUsuario[usuarioId] ?? perfisDashboardMockPorUsuario[1]
    return (
        <div className="space-y-6">
            <section>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">Seu espaço</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Perfil</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-300">Atualize suas informações e preferências.</p>
            </section>

            <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
                <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="text-xl font-bold text-slate-950 dark:text-white">Informações pessoais</h2>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Nome
                            <input type="text" defaultValue="João Silva" className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-emerald-950" />
                        </label>
                        <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            E-mail
                            <input type="email" defaultValue={perfilDashboardMock.email} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-emerald-950" />
                        </label>
                        <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300 sm:col-span-2">
                            Foto
                            <input type="file" accept="image/*" className="block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400" />
                        </label>
                    </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="text-xl font-bold text-slate-950 dark:text-white">Medidas</h2>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Peso ({perfilDashboardMock.unidadePeso})
                            <input type="number" step="0.1" defaultValue={perfilDashboardMock.pesoKg} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-emerald-950" />
                        </label>
                        <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Altura ({perfilDashboardMock.unidadeAltura})
                            <input type="number" defaultValue={perfilDashboardMock.alturaCm} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-emerald-950" />
                        </label>
                    </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                    <label className="flex items-center justify-between gap-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <span>Receber notificações</span>
                        <input type="checkbox" defaultChecked={perfilDashboardMock.notificacoesAtivas} className="h-5 w-5 accent-emerald-600" />
                    </label>
                    <label className="mt-5 flex items-center justify-between gap-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <span>Preferência de tema</span>
                        <select value={tema} onChange={(event) => onDefinirTema(event.target.value as "claro" | "escuro")} className="rounded-xl border border-slate-300 bg-white px-3 py-2 font-normal dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                            <option value="claro">Claro</option>
                            <option value="escuro">Escuro</option>
                        </select>
                    </label>
                </section>

                <button type="submit" className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 sm:w-auto">Salvar alterações</button>
            </form>
        </div>
    )
}
