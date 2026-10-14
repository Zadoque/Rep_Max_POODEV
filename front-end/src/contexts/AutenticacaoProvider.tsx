import { useState, type ReactNode } from "react"
import type UsuarioLogado from "../types/usuario-logado"
import { AutenticacaoContext } from "./autenticacao-context"

interface AutenticacaoProviderProps {
  children: ReactNode
}

export function AutenticacaoProvider({
  children,
}: AutenticacaoProviderProps) {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null)

  function entrar(usuarioLogado: UsuarioLogado) {
    setUsuario(usuarioLogado)
  }

  function sair() {
    setUsuario(null)
  }

  return (
    <AutenticacaoContext.Provider value={{ usuario, entrar, sair }}>
      {children}
    </AutenticacaoContext.Provider>
  )
}


