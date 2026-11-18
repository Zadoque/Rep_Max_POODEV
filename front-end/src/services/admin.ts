import { exerciciosMock } from "../mocks/exercicios-mock"
import { type UsuarioMock, usuariosMock } from "../mocks/usuarios-mock"
import type { ExercicioCatalogo } from "../types/exercicio"

const CHAVE_USUARIOS = "rep_max_admin_usuarios"
const CHAVE_EXERCICIOS = "rep_max_admin_exercicios"

function lerJson<T>(chave: string): T | null {
    const valor = localStorage.getItem(chave)
    return valor ? (JSON.parse(valor) as T) : null
}

export function lerUsuariosAdminMock(): UsuarioMock[] {
    const salvos = lerJson<UsuarioMock[]>(CHAVE_USUARIOS)
    if (salvos) return salvos

    const iniciais = usuariosMock.map((usuario) => ({ ...usuario }))
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(iniciais))
    return iniciais
}

function lerExerciciosMock(): ExercicioCatalogo[] {
    const salvos = lerJson<ExercicioCatalogo[]>(CHAVE_EXERCICIOS)
    if (salvos) return salvos

    const iniciais = exerciciosMock.map((exercicio) => ({
        ...exercicio,
        midia: { ...exercicio.midia },
    }))
    localStorage.setItem(CHAVE_EXERCICIOS, JSON.stringify(iniciais))
    return iniciais
}

function exigirMock() {
    if (import.meta.env.VITE_USE_MOCK !== "true") {
        throw new Error("A operação real da API ainda não foi implementada")
    }
}

export async function buscarUsuariosAdmin(): Promise<UsuarioMock[]> {
    if (import.meta.env.VITE_USE_MOCK === "true") return lerUsuariosAdminMock()
    // API futura: GET /api/usuarios
    return []
}

export async function cadastrarUsuarioAdmin(
    dados: Pick<UsuarioMock, "nome" | "email" | "tipo">,
): Promise<UsuarioMock> {
    exigirMock()
    const usuarios = lerUsuariosAdminMock()
    const novoUsuario: UsuarioMock = {
        id: Math.max(0, ...usuarios.map((usuario) => usuario.id)) + 1,
        nome: dados.nome.trim(),
        email: dados.email.trim().toLowerCase(),
        tipo: dados.tipo,
        ativo: true,
        preferenciaTema: "CLARO",
        senha: "123456",
    }
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify([...usuarios, novoUsuario]))
    // API futura: POST /api/usuarios
    return novoUsuario
}

export async function alterarStatusUsuarioAdmin(
    usuarioId: number,
    ativo: boolean,
): Promise<UsuarioMock> {
    exigirMock()
    const usuarios = lerUsuariosAdminMock()
    const usuario = usuarios.find((item) => item.id === usuarioId)
    if (!usuario) throw new Error("Usuário não encontrado")

    const atualizado = { ...usuario, ativo }
    localStorage.setItem(
        CHAVE_USUARIOS,
        JSON.stringify(usuarios.map((item) => (item.id === usuarioId ? atualizado : item))),
    )
    // API futura: PATCH /api/usuarios/{id}/status
    return atualizado
}

export async function enviarCodigoRedefinicaoAdmin(usuario: UsuarioMock): Promise<void> {
    exigirMock()
    console.info(`[MOCK] Código de redefinição enviado para ${usuario.email}`)
    // API futura: POST /api/usuarios/{id}/redefinicao-senha
}

export async function buscarExerciciosAdmin(): Promise<ExercicioCatalogo[]> {
    if (import.meta.env.VITE_USE_MOCK === "true") return lerExerciciosMock()
    // API futura: GET /api/exercicios
    return []
}

export async function salvarExercicioAdmin(
    dados: Omit<ExercicioCatalogo, "id">,
    id?: number,
): Promise<ExercicioCatalogo> {
    exigirMock()
    const exercicios = lerExerciciosMock()
    const exercicio: ExercicioCatalogo = {
        ...dados,
        id: id ?? Math.max(0, ...exercicios.map((item) => item.id)) + 1,
    }
    const atualizados = id
        ? exercicios.map((item) => (item.id === id ? exercicio : item))
        : [...exercicios, exercicio]
    localStorage.setItem(CHAVE_EXERCICIOS, JSON.stringify(atualizados))
    // API futura: POST /api/exercicios ou PUT /api/exercicios/{id}
    return exercicio
}

export async function removerExercicioAdmin(exercicioId: number): Promise<void> {
    exigirMock()
    const exercicios = lerExerciciosMock()
    localStorage.setItem(
        CHAVE_EXERCICIOS,
        JSON.stringify(exercicios.filter((item) => item.id !== exercicioId)),
    )
    // API futura: DELETE /api/exercicios/{id}
}
