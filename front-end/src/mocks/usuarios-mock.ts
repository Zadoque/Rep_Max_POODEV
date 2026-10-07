import type { UsuarioLogado } from "../types/usuario-logado";

export interface UsuarioMock extends UsuarioLogado {
    ativo: boolean;
    senha: string;
}

export const usuariosMock: UsuarioMock[] = [
    {
        id: 1,
        nome: "João Silva",
        email: "joao.silva@example.com",
        tipo: "ALUNO",
        ativo: true,
        senha: "123456"
    },
    {
        id: 2,
        nome: "Maria Souza",
        email: "maria.souza@example.com",
        tipo: "ALUNO",
        ativo: false,
        senha: "123456"
    },
    {
        id: 3,
        nome: "Carlos Oliveira",
        email: "carlos.oliveira@example.com",
        tipo: "ALUNO",
        ativo: true,
        senha: "123456"
    }
];