import { useAutenticacao } from '../hooks/use-autenticacao'

export default function AlunoHomePage() {
   const { usuario } = useAutenticacao()
    if (!usuario || usuario.tipo !== "ALUNO") {
        return (
            <div>
                <h1>Acesso restrito</h1>
                <p>Apenas alunos podem acessar esta página.</p>
            </div>
        )
    }
    return (    
        <div>
            <div>
                <div>REP º MAX</div>
                <div>Seja bém-vindo, {usuario.nome}!</div>
            </div>
        </div>
    )
}
