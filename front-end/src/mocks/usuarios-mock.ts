import type UsuarioLogado  from "../types/usuario-logado";

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
        preferenciaTema: "CLARO",
        senha: "123456"
    },
    {
        id: 2,
        nome: "Maria Souza",
        email: "usuario@gmail.com",
        tipo: "ALUNO",
        ativo: false,
        preferenciaTema: "CLARO",
        senha: "123456"
    },
    {
        id: 3,
        nome: "Carlos Oliveira",
        email: "carlos.oliveira@example.com",
        tipo: "ALUNO",
        ativo: true,
        preferenciaTema: "ESCURO",
        senha: "123456"
    },
    {
        id: 4,
        nome: "Natalia Santos",
        email: "natalia@example.com",
        tipo: "ADMIN",
        ativo: true,
        preferenciaTema: "CLARO",
        senha: "123456"
    }
];
