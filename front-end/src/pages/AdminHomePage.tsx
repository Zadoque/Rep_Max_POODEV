import { useAutenticacao } from '../hooks/use-autenticacao'

export default function AdminHomePage() {
 
 const { usuario } = useAutenticacao()
    if (!usuario || usuario.tipo !== "ADMIN") {
        return (
            <div>
                <h1>Acesso restrito</h1>
                <p>Apenas administradores podem acessar esta página.</p>
            </div>
        )
    }
    return (    
        <div>
            <div>
                <div>REP º MAX</div>
                <div>Seja bém-vindo, {usuario.nome}! Você é um administrador.</div>
            </div>
        </div>
    )
}
