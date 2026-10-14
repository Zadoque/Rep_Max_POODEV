import React from 'react';
import { autenticarUsuario } from '../services/autenticacao';
import type CredenciaisLogin from "../types/autenticacao"
import { useNavigate } from "react-router"
import { useAutenticacao } from '../hooks/use-autenticacao';

export default function LoginPage() {
    const [email, setEmail] = React.useState<string>("");
    const [senha, setSenha] = React.useState<string>("");
    const [erroLogin, setErroLogin] = React.useState<string | null>(null);
    const navigate = useNavigate();
    const { entrar } = useAutenticacao();
    const handleLogin = () => {
        const credenciais: CredenciaisLogin = { email, senha };
        autenticarUsuario(credenciais)
            .then((resultado) => {
                if (resultado.sucesso) {
                    console.log("Login bem-sucedido:", resultado.usuarioLogado);
                    entrar(resultado.usuarioLogado)
                    navigate("/app")
                    return
                } else if (resultado.codigoErroLogin === "CONTA_DESATIVADA") {
                    console.error("Conta desativada. Redirecionando para a página de conta desativada.");
                    navigate("/desativado");
                } else if (resultado.codigoErroLogin === "LOGIN_INVALIDO") {
                    console.error("Erro no login:", resultado.codigoErroLogin);
                    setErroLogin("Email ou senha inválidos.");
                    // Exibir mensagem de erro para o usuário
                }
            })
            .catch((error) => {
                console.error("Erro na autenticação:", error);
                // Exibir mensagem de erro para o usuário
            });
    }
    return (
        <div>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                    {erroLogin && <p>{erroLogin}</p>}
                    <button type="submit">
                        Entrar
                    </button>
                </div>
            </form>
        </div>
    )
}
