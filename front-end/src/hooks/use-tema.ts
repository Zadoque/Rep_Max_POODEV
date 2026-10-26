import { useEffect, useState } from "react"
import type { PreferenciaTema } from "../types/usuario-logado"

type Tema = "claro" | "escuro"

const CHAVE_TEMA = "rep-max-tema"

function temaInicial(preferenciaInicial?: PreferenciaTema): Tema {
    const temaSalvo = localStorage.getItem(CHAVE_TEMA)
    if (temaSalvo === "escuro" || temaSalvo === "claro") {
        return temaSalvo
    }
    return preferenciaInicial === "ESCURO" ? "escuro" : "claro"
}

export function useTema(preferenciaInicial?: PreferenciaTema) {
    const [tema, setTema] = useState<Tema>(() => temaInicial(preferenciaInicial))

    useEffect(() => {
        document.documentElement.classList.toggle("dark", tema === "escuro")
        localStorage.setItem(CHAVE_TEMA, tema)
    }, [tema])

    function alternarTema() {
        setTema((temaAtual) => temaAtual === "claro" ? "escuro" : "claro")
    }

    function definirTema(novoTema: Tema) {
        setTema(novoTema)
    }

    return { tema, alternarTema, definirTema }
}
