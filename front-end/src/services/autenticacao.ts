import type CredenciaisLogin from "../types/autenticacao";
import { usuariosMock } from "../mocks/usuarios-mock";
import type { ResultadoAutenticacao } from "../types/autenticacao";
import type UsuarioLogado from "../types/usuario-logado";
export async function autenticarUsuario(credenciais: CredenciaisLogin): Promise< ResultadoAutenticacao> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
        const usuario = usuariosMock.find(
            (usuario) =>
                usuario.email === credenciais.email &&
                usuario.senha === credenciais.senha
        );

        if (usuario) {
            if (!usuario.ativo) {
                return {
                    codigoErroLogin: "CONTA_DESATIVADA",
                    sucesso: false
                };
            }
            const usuarioLogado: UsuarioLogado = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
                ativo: usuario.ativo,
            };
            return {
                usuarioLogado,
                sucesso: true
            };
        } else {
            return {
                codigoErroLogin: "LOGIN_INVALIDO",
                sucesso: false
            };
        }
    } else {
        try {
           //fetch real para autenticação
        } catch (error) {
            console.error("Erro na autenticação:", error);
            return {
                codigoErroLogin: "LOGIN_INVALIDO",
                sucesso: false
            };
        }
    }
    return {
        codigoErroLogin: "LOGIN_INVALIDO",
        sucesso: false
    };
}
