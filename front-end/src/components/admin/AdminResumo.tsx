import { Dumbbell, Users } from "lucide-react"

export default function AdminResumo({
    usuarios,
    exercicios,
}: {
    usuarios: number
    exercicios: number
}) {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">
                <Users className="text-emerald-700 dark:text-emerald-400" />
                <p className="mt-4 text-sm text-emerald-800 dark:text-emerald-300">
                    Usuários cadastrados
                </p>
                <p className="mt-1 text-3xl font-black text-emerald-950 dark:text-emerald-100">
                    {usuarios}
                </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <Dumbbell className="text-slate-600 dark:text-slate-300" />
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                    Exercícios no catálogo
                </p>
                <p className="mt-1 text-3xl font-black text-slate-950 dark:text-white">
                    {exercicios}
                </p>
            </div>
        </div>
    )
}
