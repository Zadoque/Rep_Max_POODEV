import { type FormEvent, useState } from "react"

import type { UsuarioMock } from "../../mocks/usuarios-mock"
import { AdminModal, CabecalhoAdminModal, inputClassName } from "./AdminModal"

export default function ModalUsuarioAdmin({
    onClose,
    onSave,
}: {
    onClose: () => void
    onSave: (dados: Pick<UsuarioMock, "nome" | "email" | "tipo">) => Promise<void>
}) {
    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [tipo, setTipo] = useState<UsuarioMock["tipo"]>("ALUNO")
    const [salvando, setSalvando] = useState(false)

    async function salvar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault()
        setSalvando(true)
        try {
            await onSave({ nome, email, tipo })
        } finally {
            setSalvando(false)
        }
    }

    return (
        <AdminModal onClose={onClose} titulo="Adicionar usuário">
            <form onSubmit={salvar}>
                <CabecalhoAdminModal
                    titulo="Adicionar usuário"
                    subtitulo="Gestão de usuários"
                    onClose={onClose}
                />
                <div className="mt-6 space-y-4">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                        Nome
                        <input
                            required
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className={inputClassName}
                        />
                    </label>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                        E-mail
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClassName}
                        />
                    </label>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                        Perfil
                        <select
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value as UsuarioMock["tipo"])}
                            className={inputClassName}
                        >
                            <option value="ALUNO">Aluno</option>
                            <option value="ADMIN">Administrador</option>
                        </select>
                    </label>
                </div>
                <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                    A conta será criada ativa. No mock, a senha inicial é <strong>123456</strong>.
                </p>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl px-4 py-2 font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        Cancelar
                    </button>
                    <button
                        disabled={salvando}
                        type="submit"
                        className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Adicionar usuário
                    </button>
                </div>
            </form>
        </AdminModal>
    )
}
