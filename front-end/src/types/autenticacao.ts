import type UsuarioLogado from "./usuario-logado";

export default interface CredenciaisLogin {
    email: string;
    senha: string;
}
export type CodigoErroLogin = "LOGIN_INVALIDO" | "CONTA_DESATIVADA"
export interface ResultadoAutenticacao {
    CodigoErroLogin?: CodigoErroLogin;
    usuarioLogado?: UsuarioLogado;
    sucesso: boolean;
}
  