import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router/dom"
import "./index.css"
import { router } from "./router/router"
import { AutenticacaoProvider } from "./contexts/AutenticacaoProvider"

createRoot(document.getElementById("root")!).render(

  <StrictMode>
    <AutenticacaoProvider>
      <RouterProvider router={router} />
    </AutenticacaoProvider>
  </StrictMode>
  ,
)
