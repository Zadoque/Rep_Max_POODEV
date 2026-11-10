import { Dumbbell, Plus, Search, Users } from "lucide-react"

export type AbaAdmin = "usuarios" | "exercicios"

export default function AdminNavegacao({
    aba,
    busca,
    onAba,
    onBusca,
    onAdicionar,
}: {
    aba: AbaAdmin
    busca: string
    onAba: (aba: AbaAdmin) => void
    onBusca: (busca: string) => void
    onAdicionar: () => void
}) {
    return (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
                {(["usuarios", "exercicios"] as const).map((opcao) => (
                    <button
                        key={opcao}
                        type="button"
                        onClick={() => onAba(opcao)}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${aba === opcao ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                    >
                        {opcao === "usuarios" ? <Users size={17} /> : <Dumbbell size={17} />}
                        {opcao === "usuarios" ? "Usuários" : "Exercícios"}
                    </button>
                ))}
            </div>
            <div className="flex w-full gap-3 sm:w-auto">
                <label className="relative flex-1 sm:w-72">
                    <Search size={17} className="absolute left-3 top-3 text-slate-400" />
                    <input
                        value={busca}
                        onChange={(e) => onBusca(e.target.value)}
                        placeholder={
                            aba === "usuarios" ? "Buscar usuário..." : "Buscar exercício..."
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                </label>
                <button
                    type="button"
                    onClick={onAdicionar}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white transition hover:bg-emerald-700 active:scale-95"
                >
                    <Plus size={18} /> {aba === "usuarios" ? "Adicionar" : "Cadastrar"}
                </button>
            </div>
        </div>
    )
}
