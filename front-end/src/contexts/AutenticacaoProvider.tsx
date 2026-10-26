import { useState, type ReactNode } from "react"
import type UsuarioLogado from "../types/usuario-logado"
import { AutenticacaoContext } from "./autenticacao-context"

interface AutenticacaoProviderProps {
  children: ReactNode
}

const CHAVE_USUARIO = "usuario_logado"

export function AutenticacaoProvider({
  children,
}: AutenticacaoProviderProps) {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(() => {
    const usuarioSalvo = sessionStorage.getItem(CHAVE_USUARIO)

    if (!usuarioSalvo) {
      return null
    }

    try {
      return JSON.parse(usuarioSalvo) as UsuarioLogado
    } catch {
      sessionStorage.removeItem(CHAVE_USUARIO)
      return null
    }
  })

  function entrar(usuarioLogado: UsuarioLogado) {
    setUsuario(usuarioLogado)
    sessionStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuarioLogado))
  }

  function sair() {
    setUsuario(null)
    sessionStorage.removeItem(CHAVE_USUARIO)
  }

  return (
    <AutenticacaoContext.Provider value={{ usuario, entrar, sair }}>
      {children}
    </AutenticacaoContext.Provider>
  )
}

