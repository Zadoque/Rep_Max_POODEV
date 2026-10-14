import { Navigate, Outlet } from "react-router"
import { useAutenticacao } from "../../hooks/use-autenticacao"

export default function RotaAdmin() {
    const { usuario } = useAutenticacao();
    if (!usuario || usuario.tipo !== "ADMIN") {
      return <Navigate to="/login" replace />
    }

    return <Outlet />
}