import type CredenciaisLogin from "../types/autenticacao";
import { usuariosMock } from "../mocks/usuarios-mock";
import type { ResultadoAutenticacao } from "../types/autenticacao";
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
            const { senha, ativo, ...usuarioLogado } = usuario;
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
            //tenta pegar o usuário do backend
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