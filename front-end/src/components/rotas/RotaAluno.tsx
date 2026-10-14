import { Navigate, Outlet } from "react-router"
import { useAutenticacao } from "../../hooks/use-autenticacao"

export default function RotaAluno() {
    const { usuario } = useAutenticacao();
    if (!usuario) {
      return <Navigate to="/login" replace />
    } 
    if (usuario.tipo === "ADMIN") {
      return <Navigate to="/admin" replace />
    }
    return <Outlet />
}