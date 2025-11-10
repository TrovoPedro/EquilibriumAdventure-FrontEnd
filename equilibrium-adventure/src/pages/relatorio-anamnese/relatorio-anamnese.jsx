import "./relatorio-anamnese.css"
import { gerarRelatorioAnamnese } from "../../services/chamadasAPIAgenda";
import { buscarUsuarioPorId } from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/header/header-unified";
import ButtonBack from "../../components/circle-back-button2/circle-back-button2";
import ButtonSubmitForm from "../../components/button-padrao/button-submit-form";
import { useState, useEffect } from "react";
import { showSuccess, showError, showWarning } from "../../utils/swalHelper";
import { garantirPontuacaoMinimaParaAnamnese } from "../../services/apiQuestionarioRespostas";
import Swal from 'sweetalert2';
import routeUrls from "../../routes/routeUrls";

const RelatorioAnamnese = () => {
  const navigate = useNavigate();

  // Pegar parâmetros da rota aqui (hooks devem ser chamados no topo do componente)
  const params = useParams();
  const userId = params?.id || params?.userId || params?.fkAventureiro || null;

  const [formData, setFormData] = useState({
    nome: "",
    relatorio: ""
  });
  const [relatorio, setRelatorio] = useState("");
  const [nome, setNome] = useState("");


  const handleExibirNome = async () => {
    try {
      if (!userId) {
        console.warn('userId não encontrado nas params da rota');
        return;
      }
      const usuario = await buscarUsuarioPorId(userId);
      if (usuario && usuario.nome) setNome(usuario.nome);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  };

    useEffect(() => {
        handleExibirNome();
        // Rola para o topo quando a página carregar
        window.scrollTo(0, 0);
        // Remove scroll apenas nesta tela
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
        
        // Cleanup: restaura o scroll quando sair da tela
        return () => {
            document.body.style.overflow = '';
            document.body.style.height = '';
        };
    }, [userId]);

  const handleSalvarRelatorio = async () => {
    try {
      if (!userId) throw new Error("fkAventureiro não encontrado na URL");
      if (!relatorio || relatorio.trim() === "") {
        showWarning("Por favor, preencha o relatório antes de salvar.");
        return false;
      }

      // Pergunta ao guia se o aventureiro conseguirá fazer trilhas de nível explorador
      const result = await Swal.fire({
        title: 'Avaliação do Aventureiro',
        text: 'O aventureiro avaliado conseguirá fazer trilhas de nível Explorador?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        confirmButtonColor: '#295c44',
        cancelButtonColor: '#6c757d',
        reverseButtons: true
      });

      // Salva o relatório
      const data = await gerarRelatorioAnamnese({ userId, relatorio });

      // Se o guia confirmar que sim, ajusta a pontuação
      if (result.isConfirmed) {
        try {
          const resultado = await garantirPontuacaoMinimaParaAnamnese(userId);
          console.log('Pontuação ajustada:', resultado);
          
          await Swal.fire({
            title: 'Sucesso!',
            text: 'Relatório salvo com sucesso! O aventureiro está apto para trilhas de nível Explorador.',
            icon: 'success',
            confirmButtonColor: '#295c44',
            timer: 2000,
            showConfirmButton: true
          });
        } catch (errorPontuacao) {
          console.error("Erro ao ajustar pontuação:", errorPontuacao);
          await Swal.fire({
            title: 'Aviso',
            text: 'Relatório salvo com sucesso, mas houve um problema ao ajustar a pontuação.',
            icon: 'warning',
            confirmButtonColor: '#295c44',
            timer: 2000,
            showConfirmButton: true
          });
        }
      } else {
        await Swal.fire({
          title: 'Sucesso!',
          text: 'Relatório salvo com sucesso!',
          icon: 'success',
          confirmButtonColor: '#295c44',
          timer: 2000,
          showConfirmButton: true
        });
      }

      return true;
    } catch (error) {
      console.error("Erro ao salvar relatório:", error);
      showError("Erro ao salvar relatório. Tente novamente.");
      return false;
    }
  };

  return (
    <>
      <Header />
      <div className="font-['Raleway',Arial,sans-serif] text-[#226144] bg-gradient-to-br from-[#f6f7f8] to-[#eef0f1] min-h-screen flex flex-col items-center justify-start pt-32 sm:pt-36 lg:pt-40 pb-24 px-4">

        <div className="div-title w-full max-w-[1300px] mx-auto px-6 sm:px-10 mb-8 sm:mb-10 mt-20">
          <div className="editar-evento-header"> 
            <ButtonBack onClick={() => navigate(-1)} />
            <h1 className="h1-title">Relatório de Anamnese</h1>
          </div>
        </div>

        <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(34,97,68,0.10)] border border-[#e0e0e0] max-w-[1200px] w-full mx-auto min-h-[260px] sm:min-h-[480px] lg:min-h-[540px] pt-6 pb-12 px-6 sm:px-10 flex flex-col items-stretch transition-all duration-300 animate-slideUp">
          <form
            className="evento-form w-full flex-1 flex flex-col items-center justify-center gap-8"
            onSubmit={async (e) => {
              e.preventDefault();
              const ok = await handleSalvarRelatorio();
              if (ok) navigate(routeUrls.INFOS_ADICIONAIS_GUIA);
            }}
          >
            <div className="flex flex-col gap-3 w-full max-w-[940px] mx-auto mb-8">
              <label htmlFor="nome">
                Nome:
              </label>
              <input
                id="nome"
                type="text"
                disabled
                value={nome}
                className="w-full"
              />
            </div>

            <div className="flex flex-col gap-3 w-full max-w-[940px] mx-auto mb-8">
              <label htmlFor="relatorio">
                Relatório Anamnese:
              </label>
              <textarea
                id="relatorio"
                onChange={(e) => setRelatorio(e.target.value)}
                placeholder="Descreva as observações do relatório..."
                className="w-full"
              />
            </div>

            <div className="flex justify-end w-full max-w-[940px] mx-auto mt-6 pb-2 gap-4">
              <ButtonSubmitForm
                type="button"
                title="Mais Informações"
                onClick={() => {
                  if (userId) {
                    navigate(`/dados-cliente/${userId}`);
                  }
                }}
              />
              <ButtonSubmitForm type="submit" title="Salvar Relatório" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RelatorioAnamnese;