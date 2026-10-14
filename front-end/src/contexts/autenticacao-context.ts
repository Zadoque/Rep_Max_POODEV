 import { createContext } from "react"
  import type UsuarioLogado from "../types/usuario-logado"

  interface AutenticacaoContexto {
    usuario: UsuarioLogado | null
    entrar: (usuario: UsuarioLogado) => void
    sair: () => void
  }

  export const AutenticacaoContext = createContext<
    AutenticacaoContexto | undefined
  >(undefined)