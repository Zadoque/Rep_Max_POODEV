import { createBrowserRouter, Navigate } from "react-router"
import LoginPage from "../pages/LoginPage"
import ContaDesativadaPage from "../pages/ContaDesativadaPage"
import AlunoHomePage from "../pages/AlunoHomePage"
import RotaAluno from "../components/rotas/RotaAluno"
import AdminHomePage from "../pages/AdminHomePage"
import RotaAdmin from "../components/rotas/RotaAdmin"

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
  }
])