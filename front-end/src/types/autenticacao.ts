import type UsuarioLogado from "./usuario-logado";

export default interface CredenciaisLogin {
    email: string;
    senha: string;
}
export type CodigoErroLogin = "LOGIN_INVALIDO" | "CONTA_DESATIVADA"

export type ResultadoAutenticacao = |
     {
        sucesso: true
        usuarioLogado: UsuarioLogado
      }
    | {
        sucesso: false
        codigoErroLogin: CodigoErroLogin
      }

  