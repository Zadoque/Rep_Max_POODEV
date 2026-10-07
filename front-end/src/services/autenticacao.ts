import type UsuarioLogado from "../types/usuario-logado";
import  type CredenciaisLogin from "../types/credenciais-login";
import  {usuariosMock}  from "../mocks/usuarios-mock";
export async function autenticarUsuario(credenciais: CredenciaisLogin): Promise<UsuarioLogado | null> {
    if(import.meta.env.VITE_USE_MOCK === "true") {
        const usuario = usuariosMock.find(
            (usuario) =>
                usuario.email === credenciais.email &&
                usuario.senha === credenciais.senha &&
                usuario.ativo
        );

        if (usuario) {
            const { senha, ativo, ...usuarioLogado } = usuario;
            return usuarioLogado;
        } else {
            return null;
        }
    } else {
        try {
            //tenta pegar o usuário do backend
        } catch (error) {
            console.error("Erro na autenticação:", error);
            return null;
        }
    }
    return null;
}