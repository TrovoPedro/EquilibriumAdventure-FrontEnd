import Header from "../../components/header/header-unified";
import ButtonBack from "../../components/circle-back-button2/circle-back-button2";
import ButtonSubmitForm from "../../components/button-padrao/button-submit-form";
import { useState, useEffect } from "react";
import { showSuccess, showError } from "../../utils/swalHelper";
import { useNavigate, useParams } from "react-router-dom";
import "./relatorio-anamnese.css";

// Funções mock para evitar tela branca
async function buscarUsuarioPorId(id) {
  // Simula busca de usuário
  return { nome: `Usuário ${id}` };
}

async function gerarRelatorioAnamnese({ userId, relatorio }) {
  // Simula geração de relatório
  return { userId, relatorio };
}

const RelatorioAnamnese = () => {
  const [nome, setNome] = useState("");
  const [relatorio, setRelatorio] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = id ? Number(id) : null;

  const handleExibirNome = async () => {
    try {
      if (!userId) return;
      const usuario = await buscarUsuarioPorId(userId);
      setNome(usuario.nome);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  };

  useEffect(() => {
    handleExibirNome();
  }, [userId]);

  const handleSalvarRelatorio = async () => {
    try {
      if (!userId) throw new Error("fkAventureiro não encontrado na URL");
      console.log("userId:", userId);
      console.log("relatorio:", relatorio);
      const data = await gerarRelatorioAnamnese({ userId, relatorio });
  showSuccess("Relatório salvo com sucesso!");
      console.log("Relatório salvo:", data);
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
      {/* Container principal com gradiente sutil */}
  <div className="font-['Raleway',Arial,sans-serif] text-[#226144] bg-gradient-to-br from-[#f6f7f8] to-[#eef0f1] min-h-screen flex flex-col items-center justify-center pt-24 sm:pt-28 lg:pt-32 pb-[70px] px-4">

        {/* Cabeçalho com botão de voltar e título (fora do formulário e fora do card) */}
  <div className="div-title w-full max-w-[1300px] mx-auto px-6 sm:px-10 mb-4 sm:mb-6">
          <div className="editar-evento-header">
            <ButtonBack onClick={() => navigate(-1)} />
            <h1 className="h1-title">Relatório de Anamnese</h1>
          </div>
        </div>

        {/* Card do formulário - responsivo e com animação */}
  <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(34,97,68,0.10)] border border-[#e0e0e0] max-w-[1300px] w-full mx-auto mt-0 min-h-[480px] sm:min-h-[540px] lg:min-h-[620px] pt-8 pb-12 px-6 sm:px-10 flex flex-col items-stretch transition-all duration-300 animate-slideUp">
          <form
            className="evento-form w-full flex-1 flex flex-col items-center justify-center gap-8"
            onSubmit={async (e) => {
              e.preventDefault();
              const ok = await handleSalvarRelatorio();
              if (ok) navigate("/catalogo-trilhas");
            }}
          >
            {/* Campo Nome com botão de voltar acima */}
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

            {/* Campo Relatório */}
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

            {/* Botão Salvar - responsivo */}
            <div className="flex justify-end w-full max-w-[940px] mx-auto mt-6 pb-2">
              <ButtonSubmitForm type="submit" title="Salvar Relatório" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RelatorioAnamnese;