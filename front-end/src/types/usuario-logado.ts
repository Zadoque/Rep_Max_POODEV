export type Perfil = "ALUNO" | "ADMIN" 
export type PreferenciaTema = "CLARO" | "ESCURO"

export default interface UsuarioLogado {
    id: number;
    nome: string;
    email: string;
    tipo: Perfil;
    ativo: boolean;
    preferenciaTema: PreferenciaTema;
}
