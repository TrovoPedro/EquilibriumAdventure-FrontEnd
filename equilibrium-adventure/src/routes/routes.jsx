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
import InformacoesPessoais from "../pages/informacoes-pessoais/informacoes-pessoais"
import DadosCliente from "../pages/dados-cliente/dados-cliente"
import AtivarEvento from "../pages/ativar-evento/ativar-evento"
import CriarInformacoesAdicionaisGuia from "../pages/agenda-infos-adic-guia/infos-adic-guia"
import CatalogoTrilhasAdm from "../pages/catalogo-trilhas/CatalogoTrilhasAdm"
import InscricaoTrilhas from "../pages/inscricao-trilha/InscricaoTrilha"
import AdicionarGuia from "../pages/adicionar-guia/adicionar-guia"
import Listaconvites from "../pages/lista-convites/lista-convites"
import EscolhaDataCard from "../pages/escolher-data/escolher-data"
import VerGuias from "../pages/ver-guias/ver-guias"
import DadosGuia from "../pages/dados-guia/dados-guia"
import AgendaAventureiro from "../pages/agenda-aventureiro/agenda-aventureiro"
import RelatorioAnamnese from "../pages/relatorio-anamnese/relatorio-anamnese"
import ConviteAventureiro from '../pages/convite-aventureiro/ConviteAventureiro';
import AgendamentoAnamnese from '../pages/agendamento-anamnese/AgendamentoAnamnese';
import DetalhesEvento from '../pages/detalhes-evento/DetalhesEvento';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={routeUrls.CONVITE_AVENTUREIRO} element={<ConviteAventureiro />} />
      <Route path={routeUrls.AGENDAMENTO_ANAMNESE} element={<AgendamentoAnamnese />} />"
      <Route path={routeUrls.LOGIN} element={<Login />} />
      <Route path={routeUrls.CRIAR_EVENTO} element={<CriarEvento/>}/>
      <Route path={routeUrls.EDITAR_EVENTO} element={<EditarEvento/>}/>
      <Route path={routeUrls.HOME} element={<Home/>}></Route>
      <Route path={routeUrls.CADASTRO} element={<Cadastro/>}></Route>
      <Route path={routeUrls.QUESTIONARIO} element={<Questionario/>}></Route>
      <Route path={routeUrls.ESCOLHER_GUIA} element={<EscolhaGuia/>}></Route>
      <Route path={routeUrls.CATALOGO_TRILHA} element={<CatalogoTrilha/>}></Route>
      <Route path={routeUrls.INFORMACOES_PESSOAIS} element={<InformacoesPessoais/>}></Route>
      <Route path={routeUrls.DADOS_CLIENTE} element={<DadosCliente/>}></Route>
      <Route path={routeUrls.ATIVAR_EVENTO} element={<AtivarEvento/>}></Route>
      <Route path={routeUrls.ADICIONAR_GUIA} element={<AdicionarGuia/>}></Route>
      <Route path={routeUrls.LISTA_CONVITES} element={<Listaconvites/>}></Route>
      <Route path={routeUrls.CRIAR_EVENTO} element={<CriarEvento />} />
      <Route path={routeUrls.EDITAR_EVENTO} element={<EditarEvento />} />
      <Route path={routeUrls.HOME} element={<Home />}></Route>
      <Route path={routeUrls.CADASTRO} element={<Cadastro />}></Route>
      <Route path={routeUrls.QUESTIONARIO} element={<Questionario />}></Route>
      <Route path={routeUrls.ESCOLHER_GUIA} element={<EscolhaGuia />}></Route>
      <Route path={routeUrls.CATALOGO_TRILHA} element={<CatalogoTrilha />}></Route>
      <Route path={routeUrls.DADOS_CLIENTE} element={<DadosCliente />}></Route>
      <Route path={routeUrls.ATIVAR_EVENTO} element={<AtivarEvento />}></Route>
      <Route path={routeUrls.CRIAR_INFOS_ADIC_GUIA} element={<CriarInformacoesAdicionaisGuia />}></Route>
      <Route path={routeUrls.CATALOGO_TRILHAS_ADM} element={<CatalogoTrilhasAdm />}></Route>
      <Route path={routeUrls.INSCRICAO_TRILHAS} element={<InscricaoTrilhas />}></Route>
      <Route path={routeUrls.DADOS_CLIENTE} element={<DadosCliente />}></Route>
      <Route path={routeUrls.ATIVAR_EVENTO} element={<AtivarEvento />}></Route>
      <Route path={routeUrls.ADICIONAR_GUIA} element={<AdicionarGuia />}></Route>
      <Route path={routeUrls.LISTA_CONVITES} element={<Listaconvites />}></Route>
      <Route path={routeUrls.ESCOLHER_DATA} element={<EscolhaDataCard />}></Route>
      <Route path={routeUrls.VER_GUIAS} element={<VerGuias />}></Route>
      <Route path={routeUrls.DADOS_GUIA} element={<DadosGuia />}></Route>
      <Route path={routeUrls.AGENDA_AVENTUREIRO} element={<AgendaAventureiro/>}></Route>
      <Route path={routeUrls.RELATORIO_ANAMNESE} element={<RelatorioAnamnese/>}></Route>
      <Route path={routeUrls.DETALHES_EVENTO} element={<DetalhesEvento />} />
    </Routes>
  )
}
