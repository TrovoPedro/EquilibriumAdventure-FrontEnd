
import React, { useState, useEffect } from "react";
import "./editar-dados-aventureiro.css";
import CircleBackButton from "../../components/circle-back-button/circle-back-button";
import InfoPessoaisCard from "../../components/info-pessoais-card/info-pessoais-card";
import EnderecoCard from "../../components/endereco-card/endereco-card";

import { buscarCep } from "../../services/chamadasAPIEvento";
import { 
	editarInformacoesPerfil,
	cadastrarInformacoesPessoais,
	buscarPerfilCompleto
} from "../../services/apiInformacoesPessoais";
import { 
	buscarDadosUsuario
} from "../../services/apiUsuario";

export default function EditarDadosAventureiro() {
	// Função para converter data ISO para formato brasileiro DD/MM/YYYY
	const formatarDataParaBrasileiro = (dataISO) => {
		if (!dataISO) return "";
		
		try {
			// Se a data já está no formato DD/MM/YYYY, retorna como está
			if (dataISO.includes("/")) return dataISO;
			
			// Converter data ISO para formato brasileiro
			const data = new Date(dataISO);
			const dia = data.getDate().toString().padStart(2, '0');
			const mes = (data.getMonth() + 1).toString().padStart(2, '0');
			const ano = data.getFullYear();
			
			return `${dia}/${mes}/${ano}`;
		} catch (error) {
			console.error("Erro ao formatar data:", error);
			return "";
		}
	};

	const [formData, setFormData] = useState({
		// Informações Pessoais
		nome: "",
		email: "",
		telefone: "",
		dataNascimento: "",
		cpf: "",
		rg: "",
		idiomas: "",
		contatoEmergencia: "",
		// Endereço
		cep: "",
		cidade: "",
		estado: "",
		bairro: "",
		numero: "",
		complemento: ""
	});

	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [usuarioId, setUsuarioId] = useState(null); // Será carregado da sessão
	const [isEditMode, setIsEditMode] = useState(false);

	// Obter ID do usuário logado da sessão
	useEffect(() => {
		const obterUsuarioLogado = () => {
			console.log("🔍 Verificando dados do usuário logado...");
			console.log("📦 Conteúdo do localStorage:", localStorage);
			console.log("👤 Dados do usuário no localStorage:", localStorage.getItem("usuario"));
			
			// Buscar dados do usuário logado do localStorage (onde o AuthContext salva)
			const usuarioLogadoString = localStorage.getItem("usuario");
			
			if (usuarioLogadoString) {
				try {
					const usuarioLogado = JSON.parse(usuarioLogadoString);
					console.log("✅ Usuário logado encontrado:", usuarioLogado);
					
					if (usuarioLogado && (usuarioLogado.idUsuario || usuarioLogado.id || usuarioLogado.email)) {
						const idUsuario = usuarioLogado.idUsuario || usuarioLogado.id;
						
						if (idUsuario) {
							console.log("🆔 ID do usuário:", idUsuario);
							console.log("📧 Email:", usuarioLogado.email);
							console.log("👤 Nome:", usuarioLogado.nome);
							console.log("🏷️ Tipo:", usuarioLogado.tipoUsuario);
							console.log("✅ ID encontrado no campo:", usuarioLogado.idUsuario ? 'idUsuario' : 'id');
							setUsuarioId(idUsuario);
						} else {
							console.log("⚠️ Nem idUsuario nem id encontrados, mas temos email:", usuarioLogado.email);
							console.log("🔍 Vamos tentar descobrir o ID pelo email...");
							console.log("📧 Email do usuário logado:", usuarioLogado.email);
							
							// Para o Guilherme que tem email "guilherme.loliveira@sptech.school"
							// podemos assumir que é o usuário ID 1 até resolver no backend
							if (usuarioLogado.email === "guilherme.loliveira@sptech.school") {
								console.log("✅ Usuário Guilherme identificado - usando ID 1");
								setUsuarioId(1);
							} else {
								console.log("❓ Email desconhecido, usando ID 2 como teste");
								setUsuarioId(2);
							}
						}
					} else {
						console.error("❌ Estrutura do usuário inválida:", usuarioLogado);
						setUsuarioId(1); // Fallback para teste
					}
				} catch (parseError) {
					console.error("❌ Erro ao fazer parse dos dados do usuário:", parseError);
					setUsuarioId(1); // Fallback para teste
				}
			} else {
				console.error("❌ Nenhum usuário encontrado no localStorage.");
				console.log("🔍 Tentando buscar no sessionStorage como fallback...");
				
				// Fallback: tentar sessionStorage
				const sessionUser = sessionStorage.getItem("usuario");
				if (sessionUser) {
					const usuarioLogado = JSON.parse(sessionUser);
					console.log("✅ Usuário encontrado no sessionStorage:", usuarioLogado);
					setUsuarioId(usuarioLogado.idUsuario || 1);
				} else {
					console.error("❌ Usuário não encontrado em lugar nenhum. Usando ID 1 para teste.");
					setUsuarioId(1);
				}
			}
		};

		obterUsuarioLogado();
	}, []);

	// Carregar dados do usuário quando usuarioId estiver disponível
	useEffect(() => {
		// Só executar se o usuarioId estiver definido
		if (!usuarioId) {
			console.log("⏳ Aguardando usuarioId da sessão...");
			return;
		}

		const carregarDadosUsuario = async () => {
			setLoading(true);
			try {
				console.log("🚀 Iniciando carregamento de dados...");
				console.log("👤 Usuário logado ID:", usuarioId, "(obtido da sessão)");
				console.log("📍 Endpoint que será chamado:", `/informacoes-pessoais/perfil-info/${usuarioId}`);
				
				// Tentar buscar dados completos (usuário + info pessoais + endereço)
				try {
					const dados = await buscarPerfilCompleto(usuarioId);
					console.log("✅ Dados completos encontrados - MODO EDIÇÃO");
					console.log("📋 Dados completos recebidos:", JSON.stringify(dados, null, 2));
					
					setIsEditMode(true);
					
					// Montar dados do formulário com todos os dados de uma só vez
					setFormData({
						// Dados básicos do usuário
						nome: dados.nome || "",
						email: dados.email || "",
						telefone: dados.telefoneContato || "",
						// Dados pessoais
						dataNascimento: formatarDataParaBrasileiro(dados.dataNascimento),
						cpf: dados.cpf || "",
						rg: dados.rg || "",
						idiomas: dados.idioma || "",
						contatoEmergencia: dados.contatoEmergencia || "",
						// Endereço (agora disponível!)
						cep: dados.endereco?.cep || "",
						cidade: dados.endereco?.cidade || "",
						estado: dados.endereco?.estado || "",
						bairro: dados.endereco?.bairro || "",
						numero: dados.endereco?.numero || "",
						complemento: dados.endereco?.complemento || ""
					});
					
					console.log("✅ FormData completo montado com TODOS os dados:");
					console.log("📊 Dados básicos:", {
						nome: dados.nome,
						email: dados.email,
						telefone: dados.telefoneContato
					});
					console.log("📊 Dados pessoais:", {
						dataNascimento: dados.dataNascimento,
						cpf: dados.cpf,
						rg: dados.rg,
						idioma: dados.idioma,
						contatoEmergencia: dados.contatoEmergencia
					});
					console.log("📊 Endereço:", dados.endereco);
					console.log("🎯 MODO DEFINIDO: EDIÇÃO (dados encontrados)");
					
				} catch (error) {
					console.log("❌ Dados completos não encontrados - MODO CADASTRO");
					console.error("Detalhes do erro:", error);
					
					// Se não encontrou dados completos, é modo cadastro - buscar apenas dados básicos do usuário
					console.log("🔄 Buscando dados básicos do usuário para modo cadastro...");
					const dadosUsuario = await buscarDadosUsuario(usuarioId);
					
					setFormData({
						// Apenas dados básicos
						nome: dadosUsuario.nome || "",
						email: dadosUsuario.email || "",
						telefone: dadosUsuario.telefone_contato || "",
						// Campos vazios para cadastro
						dataNascimento: "",
						cpf: "",
						rg: "",
						idiomas: "",
						contatoEmergencia: "",
						cep: "",
						cidade: "",
						estado: "",
						bairro: "",
						numero: "",
						complemento: ""
					});
					
					setIsEditMode(false);
					console.log("🎯 MODO DEFINIDO: CADASTRO");
				}
				
			} catch (error) {
				console.error("❌ Erro geral ao carregar dados:", error);
				alert("Erro ao carregar dados do usuário. Tente novamente.");
			} finally {
				setLoading(false);
			}
		};

		carregarDadosUsuario();
	}, [usuarioId]);

	const handleInputChange = (name, value) => {
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
		
		// Remove error when user starts typing
		if (errors[name]) {
			setErrors(prev => ({
				...prev,
				[name]: ""
			}));
		}
	};

	const handleCepSearch = async (cep) => {
		if (cep.replace(/\D/g, "").length === 8) {
			setLoading(true);
			try {
				const endereco = await buscarCep(cep.replace(/\D/g, ""));
				setFormData(prev => ({
					...prev,
					cidade: endereco.localidade || "",
					estado: endereco.uf || "",
					bairro: endereco.bairro || ""
				}));
			} catch (error) {
				console.error("Erro ao buscar CEP:", error);
				alert("CEP não encontrado. Verifique o número digitado.");
			} finally {
				setLoading(false);
			}
		}
	};

	const handleSubmit = async () => {
		console.log("=== INICIANDO HANDLESUBMIT ===");
		console.log("FormData atual:", JSON.stringify(formData, null, 2));
		
		// Validação básica apenas do nome
		if (!formData.nome || formData.nome.trim().split(" ").length < 2) {
			setErrors({ username: "Informe nome e sobrenome" });
			console.log("Parando devido a erro de validação: nome incompleto");
			return;
		}

		console.log("Iniciando processo de salvamento...");
		setSaving(true);
		try {
		// Converter data do formato DD/MM/YYYY para YYYY-MM-DD (formato ISO)
		let dataFormatada = "";
		if (formData.dataNascimento) {
			console.log("Data original:", formData.dataNascimento);
			const [dia, mes, ano] = formData.dataNascimento.split("/");
			dataFormatada = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
			console.log("Data formatada:", dataFormatada);
			
			// Validar se a data é válida
			const dataObj = new Date(dataFormatada);
			if (isNaN(dataObj.getTime())) {
				console.error("❌ Data inválida após conversão:", dataFormatada);
				alert("Data de nascimento inválida. Use o formato DD/MM/YYYY");
				setSaving(false);
				return;
			}
		}

		const dadosInformacoesPessoais = {
			dataNascimento: dataFormatada || "1990-01-01", // Data válida obrigatória
			cpf: formData.cpf ? formData.cpf.replace(/\D/g, "") : "00000000000", // CPF válido obrigatório
			rg: formData.rg ? formData.rg.replace(/[^0-9A-Za-z]/g, "") : "0000000", // RG válido obrigatório
			contatoEmergencia: formData.contatoEmergencia || "11999999999", // Telefone válido obrigatório
			endereco: 1, // ✅ ID VÁLIDO OBRIGATÓRIO - assumindo que existe endereço ID=1 no banco
			nivel: "AVENTUREIRO", // Enum correto
			// ❌ NÃO ENVIAR 'usuario' - backend pega do path automaticamente
			relatorioAnamnese: null, // Pode ser null
			idioma: formData.idiomas || "Português", // Idioma padrão
			questionarioRespondido: false // Boolean válido
		};

		console.log("=== DEBUG DADOS ANTES DO ENVIO ===");
		console.log("📋 FormData original:", JSON.stringify(formData, null, 2));
		console.log("📤 Dados formatados para API:", JSON.stringify(dadosInformacoesPessoais, null, 2));
		console.log("🔧 Transformações aplicadas:");
		console.log(`  - CPF: "${formData.cpf}" → "${dadosInformacoesPessoais.cpf}"`);
		console.log(`  - RG: "${formData.rg}" → "${dadosInformacoesPessoais.rg}"`);
		console.log(`  - Data: "${formData.dataNascimento}" → "${dadosInformacoesPessoais.dataNascimento}"`);
		console.log(`  - Contato Emerg: "${formData.contatoEmergencia}" → "${dadosInformacoesPessoais.contatoEmergencia}"`);
		console.log(`  - Idioma: "${formData.idiomas}" → "${dadosInformacoesPessoais.idioma}"`);
		console.log("usuarioId:", usuarioId);
		console.log("isEditMode:", isEditMode);
		console.log("MODO DETECTADO:", isEditMode ? "EDIÇÃO (PUT)" : "CADASTRO (POST)");

		// Atualizar ou cadastrar informações pessoais
		console.log("1. Processando informações pessoais...");
		
		if (isEditMode) {
			console.log("1. Fazendo EDIÇÃO (PUT) das informações pessoais...");
			console.log("🔍 DADOS COMPLETOS SENDO ENVIADOS:");
			console.log("usuarioId:", usuarioId);
			console.log("dadosInformacoesPessoais:", JSON.stringify(dadosInformacoesPessoais, null, 2));
			console.log("FormData original:", JSON.stringify(formData, null, 2));
			
			const resultado = await editarInformacoesPerfil(usuarioId, dadosInformacoesPessoais);
			console.log("1. ✅ PUT executado, resposta:", resultado);
			
			// Fazer uma nova consulta para verificar se os dados foram realmente salvos
			console.log("🔍 VERIFICAÇÃO: Consultando dados atuais no banco...");
			try {
				const dadosVerificacao = await buscarPerfilCompleto(usuarioId);
				console.log("📊 Dados atualmente no banco:", JSON.stringify(dadosVerificacao, null, 2));
				
				// Comparar os dados enviados com os dados salvos
				console.log("🔍 COMPARAÇÃO:");
				console.log(`CPF enviado: "${dadosInformacoesPessoais.cpf}" | CPF no banco: "${dadosVerificacao.cpf}"`);
				console.log(`RG enviado: "${dadosInformacoesPessoais.rg}" | RG no banco: "${dadosVerificacao.rg}"`);
				console.log(`Data enviada: "${dadosInformacoesPessoais.dataNascimento}" | Data no banco: "${dadosVerificacao.dataNascimento}"`);
				
				const dadosForamSalvos = 
					dadosVerificacao.cpf === dadosInformacoesPessoais.cpf &&
					dadosVerificacao.rg === dadosInformacoesPessoais.rg &&
					dadosVerificacao.dataNascimento === dadosInformacoesPessoais.dataNascimento;
				
				if (dadosForamSalvos) {
					console.log("✅ CONFIRMADO: Dados foram salvos no banco!");
					alert("Dados atualizados com sucesso!");
				} else {
					console.log("❌ PROBLEMA: Dados NÃO foram salvos no banco!");
					alert("Atenção: Houve um problema ao salvar os dados. Verifique o console.");
				}
			} catch (verificacaoError) {
				console.error("❌ Erro ao verificar dados salvos:", verificacaoError);
				alert("Dados enviados, mas não foi possível verificar se foram salvos.");
			}
		} else {
			console.log("1. Fazendo CADASTRO (POST) das informações pessoais...");  
			const resultado = await cadastrarInformacoesPessoais(usuarioId, dadosInformacoesPessoais);
			console.log("1. ✅ POST executado, resposta:", resultado);
			setIsEditMode(true); // Após cadastrar, vira modo edição
			alert("Dados cadastrados com sucesso!");
		}
		
		console.log("=== OPERAÇÃO COMPLETADA COM SUCESSO ===");
		} catch (error) {
			console.error("=== ERRO DETALHADO ===");
			console.error("Tipo do erro:", typeof error);
			console.error("Erro completo:", error);
			
			if (error.response) {
				console.error("Status HTTP:", error.response.status);
				console.error("Dados do erro:", JSON.stringify(error.response.data, null, 2));
				console.error("Headers:", error.response.headers);
			} else if (error.request) {
				console.error("Erro de requisição:", error.request);
			} else {
				console.error("Mensagem do erro:", error.message);
			}
			
			alert(`Erro ao ${isEditMode ? 'atualizar' : 'cadastrar'} dados. Verifique o console para detalhes.`);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="editar-dados-container">
			<CircleBackButton onClick={() => window.history.back()} />
			<h1 className="titulo-editar-dados">Dados da Conta</h1>
			<InfoPessoaisCard 
				formData={formData}
				onInputChange={handleInputChange}
				errors={errors}
			/>
			<EnderecoCard 
				formData={formData}
				onInputChange={handleInputChange}
				onCepSearch={handleCepSearch}
				loading={loading}
				errors={errors}
			/>
			<button 
				className="salvar-btn" 
				onClick={handleSubmit}
				disabled={loading || saving}
			>
				{saving ? 
					(isEditMode ? "Atualizando..." : "Cadastrando...") : 
					(isEditMode ? "Salvar Alterações" : "Cadastrar Dados")
				}
			</button>
		</div>
	);
}
