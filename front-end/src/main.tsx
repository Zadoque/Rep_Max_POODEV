import "./index.css"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router/dom"

import { AutenticacaoProvider } from "./contexts/AutenticacaoProvider"
import { router } from "./router/router"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AutenticacaoProvider>
            <RouterProvider router={router} />
        </AutenticacaoProvider>
    </StrictMode>,
)
