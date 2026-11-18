import { Mail, Power, UserRound } from "lucide-react"

import type { UsuarioMock } from "../../mocks/usuarios-mock"

export default function AdminUsuariosLista({
    usuarios,
    usuarioAtualId,
    onCodigo,
    onStatus,
}: {
    usuarios: UsuarioMock[]
    usuarioAtualId: number
    onCodigo: (item: UsuarioMock) => void
    onStatus: (item: UsuarioMock) => void
}) {
    return (
        <section className="mt-5 grid gap-4 lg:grid-cols-2">
            {usuarios.map((item) => (
                <article
                    key={item.id}
                    className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 gap-3">
                            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                <UserRound size={20} />
                            </div>
                            <div className="min-w-0">
                                <h2 className="truncate font-bold text-slate-950 dark:text-white">
                                    {item.nome}
                                </h2>
                                <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                                    {item.email}
                                </p>
                            </div>
                        </div>
                        <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${item.ativo ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"}`}
                        >
                            {item.ativo ? "Ativo" : "Desativado"}
                        </span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                            {item.tipo === "ADMIN" ? "Administrador" : "Aluno"}
                        </span>
                        <div className="flex gap-1">
                            <button
                                type="button"
                                onClick={() => onCodigo(item)}
                                title="Enviar código de redefinição"
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-emerald-700 dark:hover:bg-slate-800"
                            >
                                <Mail size={17} />
                            </button>
                            <button
                                type="button"
                                disabled={item.id === usuarioAtualId}
                                onClick={() => onStatus(item)}
                                title={
                                    item.id === usuarioAtualId
                                        ? "Não é possível desativar o administrador atual"
                                        : item.ativo
                                          ? "Desativar conta"
                                          : "Ativar conta"
                                }
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-800"
                            >
                                <Power size={17} />
                            </button>
                        </div>
                    </div>
                </article>
            ))}
            {usuarios.length === 0 && (
                <p className="text-slate-600 dark:text-slate-300">Nenhum usuário encontrado.</p>
            )}
        </section>
    )
}
