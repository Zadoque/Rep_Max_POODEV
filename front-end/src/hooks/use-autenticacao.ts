import { useContext } from "react"
import { AutenticacaoContext } from "../contexts/autenticacao-context"

export function useAutenticacao() {
    const contexto = useContext(AutenticacaoContext)

    if (!contexto) {
        throw new Error(
            "useAutenticacao deve ser usado dentro de AutenticacaoProvider.",
        )
    }

    return contexto
}