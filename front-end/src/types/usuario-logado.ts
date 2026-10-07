export type Perfil = "ALUNO" | "ADMIN" 

export default interface UsuarioLogado {
    id: number;
    nome: string;
    email: string;
    tipo: Perfil;
}