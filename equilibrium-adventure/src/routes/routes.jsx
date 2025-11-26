import { Routes, Route } from "react-router-dom"
import routeUrls from "./routeUrls"
import ProtectedRoute from "./protectedRoutes"
import Login from "../pages/login/login"
import CriarEvento from "../pages/criar-evento/criar-evento"
import EditarEvento from "../pages/editar-evento/editar-evento"
import Home from "../pages/home/Home"
import Cadastro from "../pages/cadastro/cadastro"
import Questionario from "../pages/questionario/questionario"
import EscolhaGuia from "../pages/escolher-guia/EscolherGuia"
import CatalogoTrilha from "../pages/catalogo-trilhas/CatalogoTrilhas"
import InformacoesPessoais from "../pages/informacoes-pessoais/informacoes-pessoais"
import DadosCliente from "../pages/dados-cliente/dados-cliente"
import AtivarEvento from "../pages/ativar-evento/ativar-evento"
import CriarInformacoesAdicionaisGuia from "../pages/agenda-infos-adic-guia/infos-adic-guia"
import CatalogoTrilhasAdm from "../pages/catalogo-trilhas/CatalogoTrilhasAdm"
import InscricaoTrilhas from "../pages/inscricao-trilha/InscricaoTrilha"
import AdicionarGuia from "../pages/adicionar-guia/adicionar-guia"
import EscolhaDataCard from "../pages/escolher-data/escolher-data"
import VerGuias from "../pages/ver-guias/ver-guias"
import DadosGuia from "../pages/dados-guia/dados-guia"
import AgendaAventureiro from "../pages/agenda-aventureiro/agenda-aventureiro"
import RelatorioAnamnese from "../pages/relatorio-anamnese/relatorio-anamnese"
import AgendamentoAnamnese from '../pages/agendamento-anamnese/AgendamentoAnamnese';
import DetalhesEvento from '../pages/detalhes-evento/DetalhesEvento';
import Dashboard from '../pages/dashboard/dashboard';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path={routeUrls.LOGIN} element={<Login />} />
      <Route path={routeUrls.HOME} element={<Home />} />
      <Route path={routeUrls.CADASTRO} element={<Cadastro />} />

      {/* Rotas protegidas - Todos usuários logados */}
      <Route path={routeUrls.QUESTIONARIO} element={<ProtectedRoute><Questionario /></ProtectedRoute>} />
      <Route path={routeUrls.INFORMACOES_PESSOAIS} element={<ProtectedRoute><InformacoesPessoais /></ProtectedRoute>} />
      <Route path={routeUrls.DADOS_CLIENTE} element={<ProtectedRoute><DadosCliente /></ProtectedRoute>} />
      
      {/* Rotas protegidas - Apenas AVENTUREIRO */}
      <Route path={routeUrls.ESCOLHER_GUIA} element={<ProtectedRoute allowedRoles={["AVENTUREIRO"]}><EscolhaGuia /></ProtectedRoute>} />
      <Route path={routeUrls.CATALOGO_TRILHA} element={<ProtectedRoute allowedRoles={["AVENTUREIRO"]}><CatalogoTrilha /></ProtectedRoute>} />
      <Route path={routeUrls.INSCRICAO_TRILHAS} element={<ProtectedRoute allowedRoles={["AVENTUREIRO"]}><InscricaoTrilhas /></ProtectedRoute>} />
      <Route path={routeUrls.ESCOLHER_DATA} element={<ProtectedRoute allowedRoles={["AVENTUREIRO"]}><EscolhaDataCard /></ProtectedRoute>} />
      <Route path={routeUrls.AGENDA_AVENTUREIRO} element={<ProtectedRoute allowedRoles={["AVENTUREIRO"]}><AgendaAventureiro /></ProtectedRoute>} />
      <Route path={routeUrls.AGENDAMENTO_ANAMNESE} element={<ProtectedRoute allowedRoles={["AVENTUREIRO"]}><AgendamentoAnamnese /></ProtectedRoute>} />
      <Route path={routeUrls.DETALHES_EVENTO} element={<ProtectedRoute allowedRoles={["AVENTUREIRO"]}><DetalhesEvento /></ProtectedRoute>} />

      {/* Rotas protegidas - GUIA e ADMINISTRADOR */}
      <Route path={routeUrls.CRIAR_EVENTO} element={<ProtectedRoute allowedRoles={["GUIA", "ADMINISTRADOR"]}><CriarEvento /></ProtectedRoute>} />
      <Route path={routeUrls.EDITAR_EVENTO} element={<ProtectedRoute allowedRoles={["GUIA", "ADMINISTRADOR"]}><EditarEvento /></ProtectedRoute>} />
      <Route path={routeUrls.ATIVAR_EVENTO} element={<ProtectedRoute allowedRoles={["GUIA", "ADMINISTRADOR"]}><AtivarEvento /></ProtectedRoute>} />
      <Route path={routeUrls.CATALOGO_TRILHAS_ADM} element={<ProtectedRoute allowedRoles={["GUIA", "ADMINISTRADOR"]}><CatalogoTrilhasAdm /></ProtectedRoute>} />
      <Route path={routeUrls.CRIAR_INFOS_ADIC_GUIA} element={<ProtectedRoute allowedRoles={["GUIA", "ADMINISTRADOR"]}><CriarInformacoesAdicionaisGuia /></ProtectedRoute>} />
      <Route path={routeUrls.DADOS_GUIA} element={<ProtectedRoute allowedRoles={["GUIA", "ADMINISTRADOR"]}><DadosGuia /></ProtectedRoute>} />
      <Route path={routeUrls.DASHBOARD} element={<ProtectedRoute allowedRoles={["GUIA", "ADMINISTRADOR"]}><Dashboard /></ProtectedRoute>} />
      <Route path={routeUrls.RELATORIO_ANAMNESE} element={<ProtectedRoute allowedRoles={["GUIA", "ADMINISTRADOR"]}><RelatorioAnamnese /></ProtectedRoute>} />

      {/* Rotas protegidas - Apenas ADMINISTRADOR */}
      <Route path={routeUrls.ADICIONAR_GUIA} element={<ProtectedRoute allowedRoles={["ADMINISTRADOR"]}><AdicionarGuia /></ProtectedRoute>} />
      <Route path={routeUrls.VER_GUIAS} element={<ProtectedRoute allowedRoles={["ADMINISTRADOR"]}><VerGuias /></ProtectedRoute>} />
    </Routes>
  )
}
