import { Routes, Route } from "react-router-dom"
import routeUrls from "./routeUrls"
import Login from "../pages/login/login"
import Cadastro from "../pages/cadastro/cadastro";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={routeUrls.LOGIN} element={<Login />} />
      <Route path={routeUrls.CADASTRO} element={<Cadastro />} />
    </Routes>
  )
}
