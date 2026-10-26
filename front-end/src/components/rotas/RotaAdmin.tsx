import { Navigate, Outlet } from "react-router"
import { useAutenticacao } from "../../hooks/use-autenticacao"

export default function RotaAdmin() {
    const { usuario } = useAutenticacao();
    if (!usuario ) {
      return <Navigate to="/login" replace />
    }

    if (!usuario.ativo) {
      return <Navigate to="/desativado" replace />
    }

    if (usuario.tipo !== "ADMIN") {
      return <Navigate to="/app" replace />
    }

    return <Outlet />
}
