import { usuariosMock } from "../mocks/usuarios-mock"
import type UsuarioLogado from "../types/usuario-logado"
import type { PreferenciaTema } from "../types/usuario-logado"

export async function atualizarPreferenciaTema(
    usuario: UsuarioLogado,
    preferenciaTema: PreferenciaTema,
): Promise<UsuarioLogado> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
        const usuarioMock = usuariosMock.find((item) => item.id === usuario.id)

        if (usuarioMock) {
            usuarioMock.preferenciaTema = preferenciaTema
        }

        return { ...usuario, preferenciaTema }
    }

    // API futura: PATCH /api/usuarios/{id}/preferencia-tema
    // O retorno esperado deve ser o usuário atualizado.
    return { ...usuario, preferenciaTema }
}
