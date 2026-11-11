import { createBrowserRouter, Navigate } from "react-router"

import RotaAdmin from "../components/rotas/RotaAdmin"
import RotaAluno from "../components/rotas/RotaAluno"
import AdminHomePage from "../pages/AdminHomePage"
import AlunoHomePage from "../pages/AlunoHomePage"
import ContaDesativadaPage from "../pages/ContaDesativadaPage"
import ExecucaoTreinoPage from "../pages/ExecucaoTreinoPage"
import LoginPage from "../pages/LoginPage"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" replace />,
    },
    {
        path: "/login",
        Component: LoginPage,
    },
    {
        path: "/desativado",
        Component: ContaDesativadaPage,
    },
    {
        Component: RotaAluno,
        children: [
            {
                path: "app",
                Component: AlunoHomePage,
            },
            {
                path: "app/treino/:treinoId",
                Component: ExecucaoTreinoPage,
            },
        ],
    },
    {
        Component: RotaAdmin,
        children: [
            {
                path: "admin",
                Component: AdminHomePage,
            },
        ],
    },
])
