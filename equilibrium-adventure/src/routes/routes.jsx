import { Routes, Route } from "react-router-dom"
import routeUrls from "./routeUrls"
import Login from "../pages/login/login"
import CriarEvento from "../pages/criar-evento/criar-evento"
import EditarEvento from "../pages/editar-evento/editar-evento"
import Home from "../pages/home/Home"
import Cadastro from "../pages/cadastro/cadastro"
import Questionario from "../pages/questionario/questionario"
import EscolhaGuia from "../pages/escolher-guia/EscolherGuia"
import CatalogoTrilha from "../pages/catalogo-trilhas/CatalogoTrilhas"
import EditarDadosAventureiro from "../pages/editar-dados-aventureiro/editar-dados-aventureiro"
import DadosCliente from "../pages/dados-cliente/dados-cliente"
import AtivarEvento from "../pages/ativar-evento/ativar-evento"
import InfosAdicGuia from "../pages/infos-adic-guia/infos-adic-guia"
import CatalogoTrilhasAdm from "../pages/catalogo-trilhas/CatalogoTrilhasAdm"
import InscricaoTrilhas from "../pages/inscricao-trilha/InscricaoTrilhas"
import InscricaoTrilhasLimitado from "../pages/inscricao-trilha/InscricaoTrilhaLimitado"
import AdicionarGuia from "../pages/adicionar-guia/adicionar-guia"
import Listaconvites from "../pages/lista-convites/lista-convites"
import EscolhaDataCard from "../pages/escolher-data/escolher-data"


export default function AppRoutes() {
  return (
    <Routes>
      <Route path={routeUrls.LOGIN} element={<Login />} />
      <Route path={routeUrls.CRIAR_EVENTO} element={<CriarEvento />} />
      <Route path={routeUrls.EDITAR_EVENTO} element={<EditarEvento />} />
      <Route path={routeUrls.HOME} element={<Home />}></Route>
      <Route path={routeUrls.CADASTRO} element={<Cadastro />}></Route>
      <Route path={routeUrls.QUESTIONARIO} element={<Questionario />}></Route>
      <Route path={routeUrls.ESCOLHER_GUIA} element={<EscolhaGuia />}></Route>
      <Route path={routeUrls.CATALOGO_TRILHA} element={<CatalogoTrilha />}></Route>
      <Route path={routeUrls.EDITAR_DADOS_AVENTUREIRO} element={<EditarDadosAventureiro />}></Route>
      <Route path={routeUrls.DADOS_CLIENTE} element={<DadosCliente />}></Route>
      <Route path={routeUrls.ATIVAR_EVENTO} element={<AtivarEvento />}></Route>
      <Route path={routeUrls.CRIAR_INFOS_ADIC_GUIA} element={<InfosAdicGuia />}></Route>
      <Route path={routeUrls.CATALOGO_TRILHAS_ADM} element={<CatalogoTrilhasAdm />}></Route>
      <Route path={routeUrls.INSCRICAO_TRILHAS} element={<InscricaoTrilhas />}></Route>
      <Route path={routeUrls.INSCRICAO_TRILHAS_LIMITADO} element={<InscricaoTrilhasLimitado />}></Route>
      <Route path={routeUrls.DADOS_CLIENTE} element={<DadosCliente />}></Route>
      <Route path={routeUrls.ATIVAR_EVENTO} element={<AtivarEvento />}></Route>
      <Route path={routeUrls.ADICIONAR_GUIA} element={<AdicionarGuia />}></Route>
      <Route path={routeUrls.LISTA_CONVITES} element={<Listaconvites />}></Route>
      <Route path={routeUrls.ESCOLHER_DATA} element={<EscolhaDataCard />}></Route>
    </Routes>
  )
}
