import { getExercise } from "@bryllim/workout-guide"
import type { ExercicioCatalogo } from "../types/exercicio"

const exerciciosMaisComuns = [
    "bench-press", "incline-bench-press", "dumbbell-bench-press", "decline-bench-press", "machine-chest-press",
    "dumbbell-fly", "cable-fly", "push-up", "chest-dip", "pull-up", "chin-up", "lat-pulldown", "barbell-row",
    "seated-row", "one-arm-dumbbell-row", "t-bar-row", "face-pull", "deadlift", "romanian-deadlift", "sumo-deadlift",
    "bicep-curl", "hammer-curl", "preacher-curl", "cable-curl", "concentration-curl", "skull-crusher", "tricep-pushdown",
    "bench-dip", "overhead-press", "seated-dumbbell-press", "arnold-press", "lateral-raise", "front-raise", "rear-delt-fly",
    "squat", "front-squat", "goblet-squat", "hack-squat", "leg-press", "leg-extension", "leg-curl", "lying-leg-curl",
    "hip-thrust", "glute-bridge", "bulgarian-split-squat", "walking-lunge", "calf-raise", "seated-calf-raise", "plank", "crunch",
] as const

const gruposMusculares: Record<string, string> = {
    Chest: "Peito", Back: "Costas", Shoulders: "Ombros", Biceps: "Bíceps", Triceps: "Tríceps",
    Quadriceps: "Quadríceps", Hamstrings: "Posterior de coxa", Glutes: "Glúteos", Calves: "Panturrilhas", Core: "Abdômen",
}

const formatarNome = (nome: string) => nome
    .replace(/\bBench Press\b/g, "Supino")
    .replace(/\bDumbbell\b/g, "Halteres")
    .replace(/\bIncline\b/g, "Inclinado")
    .replace(/\bDecline\b/g, "Declinado")
    .replace(/\bPress\b/g, "Desenvolvimento")
    .replace(/\bFly\b/g, "Crucifixo")
    .replace(/\bPush-up\b/g, "Flexão")
    .replace(/\bPull-up\b/g, "Barra fixa")
    .replace(/\bChin-up\b/g, "Barra supinada")
    .replace(/\bRow\b/g, "Remada")
    .replace(/\bCurl\b/g, "Rosca")
    .replace(/\bSquat\b/g, "Agachamento")
    .replace(/\bDeadlift\b/g, "Levantamento terra")
    .replace(/\bRaise\b/g, "Elevação")
    .replace(/\bLunge\b/g, "Avanço")

export const exerciciosMock: ExercicioCatalogo[] = exerciciosMaisComuns.map((slug, indice) => {
    const exercicio = getExercise(slug)

    if (!exercicio) {
        throw new Error(`Exercício não encontrado no catálogo visual: ${slug}`)
    }

    return {
        id: indice + 1,
        slug: exercicio.slug,
        nome: formatarNome(exercicio.name),
        grupoMuscular: gruposMusculares[exercicio.primaryMuscle] ?? exercicio.primaryMuscle,
        equipamento: exercicio.equipment,
        descricao: `Exercício de ${gruposMusculares[exercicio.primaryMuscle] ?? exercicio.primaryMuscle.toLowerCase()} para compor seu treino.`,
        instrucoesExecucao: "Execute com controle, mantenha a postura indicada e respeite sua amplitude segura.",
        midia: {
            animacao: `/exercises/${slug}/animation.gif`,
            animacaoLenta: `/exercises/${slug}/animation-slow.gif`,
            animacaoRapida: `/exercises/${slug}/animation-fast.gif`,
            creditos: "Workout Guide / Bryl Lim; poses originais Everkinetic",
            licenca: "CC BY-SA 4.0",
        },
        ativo: true,
    }
})

export const exerciciosMockPorId = Object.fromEntries(exerciciosMock.map((exercicio) => [exercicio.id, exercicio])) as Record<number, ExercicioCatalogo>
