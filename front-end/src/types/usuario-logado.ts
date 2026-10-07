export type Perfil = "ALUNO" | "ADMIN" 

export interface UsuarioLogado {
    id: number;
    nome: string;
    email: string;
    tipo: Perfil;
}