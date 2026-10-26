import { useAutenticacao } from '../hooks/use-autenticacao'
import { useNavigate } from 'react-router'

export default function AdminHomePage() {
 
 const { usuario, sair } = useAutenticacao()
 const navigate = useNavigate()

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
                <div>
                    <span>Seja bem-vindo, {usuario.nome}! Você é um administrador.</span>
                    <button type="button" onClick={() => {
                        sair()
                        navigate("/login")
                    }}>
                        Sair
                    </button>
                </div>
            </div>
        </div>
    )
}
