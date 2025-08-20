import { Routes, Route } from "react-router-dom"
import routeUrls from "./routeUrls"
import Login from "../pages/login/login"
import CriarEvento from "../pages/criar-evento/criar-evento"
import Home from "../pages/home/Home"
import Cadastro from "../pages/cadastro/cadastro"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={routeUrls.LOGIN} element={<Login />} />
      <Route path={routeUrls.CRIAR_EVENTO} element={<CriarEvento/>}/>
      <Route path={routeUrls.HOME} element={<Home/>}></Route>
      <Route path={routeUrls.CADASTRO} element={<Cadastro/>}></Route>
    </Routes>
  )
}