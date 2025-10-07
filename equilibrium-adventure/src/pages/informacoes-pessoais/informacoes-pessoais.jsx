
import React, { useState, useEffect } from "react";
import "./informacoes-pessoais.css";
import CircleBackButton from "../../components/circle-back-button/circle-back-button";
import InfoPessoaisCard from "../../components/info-pessoais-card/info-pessoais-card";
import EnderecoCard from "../../components/endereco-card/endereco-card";
import ConfirmationPopup from "../../components/confirmation-popup/confirmation-popup";

import { buscarCep } from "../../services/chamadasAPIEvento";
import { 
	editarInformacoesPerfil,
	cadastrarInformacoesPessoais,
	buscarPerfilCompleto,
	cadastrarPerfilCompleto,
	editarPerfilCompleto
} from "../../services/apiInformacoesPessoais";
import { 
	buscarDadosUsuario
} from "../../services/apiUsuario";
import { 
	validateUserData, 
	validateFullName, 
	validateCPF, 
	validateRG, 
	validateCEP, 
	validateTelefone, 
	validateEmergencyContact,
	validateEmail 
} from "../../utils/validators";
import { validatePhone } from "../../utils/validatePhone";
import { 
	convertDateToBrazilian, 
	convertDateToISO, 
	validateDateFormat 
} from "../../utils/dateConversions";

export default function InformacoesPessoais() {

	const [formData, setFormData] = useState({

		nome: "",
		email: "",
		telefone: "",
		dataNascimento: "",
		cpf: "",
		rg: "",
		idiomas: "",
		contatoEmergencia: "",
	
		rua: "",
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
	const [usuarioId, setUsuarioId] = useState(null); 
	const [isEditMode, setIsEditMode] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [dadosOriginais, setDadosOriginais] = useState(null);

	// Obter ID do usuário logado da sessão
	useEffect(() => {
		const obterUsuarioLogado = () => {
			console.log("Verificando dados do usuário logado...");
			
			const usuarioLogadoString = sessionStorage.getItem("usuario");
			
			if (usuarioLogadoString) {
				try {
					const usuarioLogado = JSON.parse(usuarioLogadoString);
					console.log("Usuario logado encontrado:", usuarioLogado);
					
					if (usuarioLogado && (usuarioLogado.idUsuario || usuarioLogado.id || usuarioLogado.email)) {
						const idUsuario = usuarioLogado.idUsuario || usuarioLogado.id;
						
						if (idUsuario) {
							console.log("ID do usuario:", idUsuario);
							setUsuarioId(idUsuario);
						} else {
							console.log("Email nao encontrado, tentando descobrir ID...");
							
							if (usuarioLogado.email === "guilherme.loliveira@sptech.school") {
								console.log("Usuario Guilherme identificado - usando ID 1");
								setUsuarioId(1);
							} else {
								console.log("Email desconhecido, usando ID 2 como teste");
								setUsuarioId(2);
							}
						}
					} else {
						console.error("Estrutura do usuario invalida:", usuarioLogado);
						setUsuarioId(1); 
					}
				} catch (parseError) {
					console.error("Erro ao fazer parse dos dados do usuario:", parseError);
					setUsuarioId(1); 
				}
			} else {
				console.error("Nenhum usuario encontrado no localStorage.");
				console.log("Tentando buscar no sessionStorage...");
				
				const sessionUser = sessionStorage.getItem("usuario");
				if (sessionUser) {
					const usuarioLogado = JSON.parse(sessionUser);
					console.log("Usuario encontrado no sessionStorage:", usuarioLogado.nome);
					setUsuarioId(usuarioLogado.idUsuario || 1);
				} else {
					console.error("Usuario nao encontrado em lugar nenhum. Usando ID 1 para teste.");
					setUsuarioId(1);
				}
			}
		};

		obterUsuarioLogado();
	}, []);

	
	useEffect(() => {
		
		if (!usuarioId) {
			console.log("Aguardando usuarioId da sessao...");
			return;
		}

		const carregarDadosUsuario = async () => {
			setLoading(true);
			try {
				console.log("Carregando dados do usuario ID:", usuarioId);
				
				let dadosUsuario = {};
				try {
					dadosUsuario = await buscarDadosUsuario(usuarioId);
					console.log("Dados básicos do usuário:", dadosUsuario);
				} catch (e) {
					console.warn("Falha ao buscar dados básicos no backend");
				}

				const usuarioLogadoString = sessionStorage.getItem("usuario");
				let usuarioLS = {};
				if (usuarioLogadoString) {
					try { 
						usuarioLS = JSON.parse(usuarioLogadoString) || {}; 
						console.log("Dados do localStorage:", usuarioLS);
					} catch {}
				}
				
				try {
					const dados = await buscarPerfilCompleto(usuarioId);
					console.log("Dados completos encontrados - MODO EDICAO", dados);
					
					setIsEditMode(true);
					setDadosOriginais(dados);
				
					setFormData({
						nome: dados.nome || dadosUsuario.nome || usuarioLS.nome || "",
						email: dados.email || dadosUsuario.email || usuarioLS.email || "",
						telefone: dados.telefoneContato || dados.telefone || dadosUsuario.telefone_contato || dadosUsuario.telefone || usuarioLS.telefone || "",
						dataNascimento: convertDateToBrazilian(dados.dataNascimento),
						cpf: dados.cpf || "",
						rg: dados.rg || "",
						idiomas: dados.idioma || "",
						contatoEmergencia: dados.contatoEmergencia || "",
						rua: dados.endereco?.rua || dados.endereco?.logradouro || "",
						cep: dados.endereco?.cep || "",
						cidade: dados.endereco?.cidade || "",
						estado: dados.endereco?.estado || "",
						bairro: dados.endereco?.bairro || "",
						numero: dados.endereco?.numero || "",
						complemento: dados.endereco?.complemento || ""
					});
					
					console.log("FormData montado para modo edicao");
					
				} catch (error) {
					console.log("Dados nao encontrados - MODO CADASTRO");
					console.error("Detalhes do erro:", error);

					setFormData({
						nome: dadosUsuario.nome || usuarioLS.nome || "",
						email: dadosUsuario.email || usuarioLS.email || "",
						telefone: dadosUsuario.telefone_contato || dadosUsuario.telefone || usuarioLS.telefone || "",
						dataNascimento: "",
						cpf: "",
						rg: "",
						idiomas: "",
						contatoEmergencia: "",
						rua: "",
						cep: "",
						cidade: "",
						estado: "",
						bairro: "",
						numero: "",
						complemento: ""
					});
					
					setIsEditMode(false);
					console.log("MODO DEFINIDO: CADASTRO");
				}
				
			} catch (error) {
				console.error("Erro geral ao carregar dados:", error);
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
		
		let fieldErrors = { ...errors };
		
		switch (name) {
			case 'nome':
				const nameValidation = validateFullName(value);
				if (!nameValidation.isValid) {
					fieldErrors[name] = nameValidation.error;
				} else {
					delete fieldErrors[name];
				}
				break;
			case 'email':
				const emailValidation = validateEmail(value);
				if (!emailValidation.isValid) {
					fieldErrors[name] = emailValidation.error;
				} else {
					delete fieldErrors[name];
				}
				break;
			case 'telefone':
				const telefoneValidation = validateTelefone(value);
				if (!telefoneValidation.isValid) {
					fieldErrors[name] = telefoneValidation.error;
				} else {
					delete fieldErrors[name];
				}
				break;
			case 'cpf':
				const cpfValidation = validateCPF(value);
				if (!cpfValidation.isValid) {
					fieldErrors[name] = cpfValidation.error;
				} else {
					delete fieldErrors[name];
				}
				break;
			case 'rg':
				const rgValidation = validateRG(value);
				if (!rgValidation.isValid) {
					fieldErrors[name] = rgValidation.error;
				} else {
					delete fieldErrors[name];
				}
				break;
			case 'cep':
				const cepValidation = validateCEP(value);
				if (!cepValidation.isValid) {
					fieldErrors[name] = cepValidation.error;
				} else {
					delete fieldErrors[name];
				}
				break;
			case 'contatoEmergencia':
				const emergencyValidation = validateEmergencyContact(value);
				if (!emergencyValidation.isValid) {
					fieldErrors[name] = emergencyValidation.error;
				} else {
					delete fieldErrors[name];
				}
				break;
			case 'dataNascimento':
				if (value) {
					const dateValidation = validateDateFormat(value);
					if (!dateValidation.isValid) {
						fieldErrors[name] = dateValidation.error;
					} else {
						delete fieldErrors[name];
					}
				} else {
					delete fieldErrors[name];
				}
				break;
			default:
				delete fieldErrors[name];
		}
		
		setErrors(fieldErrors);
	};

	const handleCepSearch = async (cep) => {
		if (cep.replace(/\D/g, "").length === 8) {
			setLoading(true);
			try {
				const endereco = await buscarCep(cep.replace(/\D/g, ""));
				setFormData(prev => ({
					...prev,
					rua: endereco.logradouro || "",
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
		console.log("Iniciando handleSubmit...");
		
		const nameValidation = validateFullName(formData.nome);
		if (!nameValidation.isValid) {
			setErrors({ username: nameValidation.error });
			console.log("Validacao falhou: nome incompleto");
			return;
		}

		const emailValidation = validateEmail(formData.email);
		if (!emailValidation.isValid) {
			setErrors({ email: emailValidation.error });
			alert(emailValidation.error);
			setSaving(false);
			return;
		}

		console.log("Iniciando processo de salvamento...");
		console.log("dadosOriginais completo:", dadosOriginais);
		console.log("dadosOriginais.nivel:", dadosOriginais?.nivel);
		console.log("Modo:", isEditMode ? "EDICAO" : "CADASTRO");
		setSaving(true);
		try {
		let dataFormatada = "";
		if (formData.dataNascimento) {
			try {
				dataFormatada = convertDateToISO(formData.dataNascimento);
			} catch (error) {
				alert(error.message);
				setSaving(false);
				return;
			}
		}

		const cpfDigits = (formData.cpf || "").replace(/\D/g, "");
		const rgFormatted = (formData.rg || "").trim();
		const telefoneUsuarioDigits = (formData.telefone || "").replace(/\D/g, "");
		const contatoEmergenciaDigits = (formData.contatoEmergencia || "").replace(/\D/g, "");

		const telefoneValidation = validateTelefone(formData.telefone);
		if (!telefoneValidation.isValid) {
			alert(telefoneValidation.error + " (DDD + número), apenas números.");
			setSaving(false);
			return;
		}
		const emergencyValidation = validateEmergencyContact(formData.contatoEmergencia);
		if (!emergencyValidation.isValid) {
			alert(emergencyValidation.error + " (DDD + número), apenas números.");
			setSaving(false);
			return;
		}

		const rgValidation = validateRG(formData.rg);
		if (!rgValidation.isValid) {
			alert(rgValidation.error + " (incluindo pontos e traços).");
			setSaving(false);
			return;
		}

		const dadosInformacoesPessoais = {
			dataNascimento: dataFormatada || "1990-01-01",
			cpf: cpfDigits || "00000000000",
			rg: rgFormatted || "00.000.000-0",
			contatoEmergencia: contatoEmergenciaDigits || "11999999999",
			relatorioAnamnese: dadosOriginais?.relatorioAnamnese || null,
			idioma: formData.idiomas || "Português",
			questionarioRespondido: dadosOriginais?.questionarioRespondido || false,
			nivel: dadosOriginais?.nivel || "EXPLORADOR" // Garante que nunca seja null
		};

		console.log("Processando informacoes pessoais...");
		console.log("Modo:", isEditMode ? "EDICAO" : "CADASTRO");
		
		if (isEditMode) {
			console.log("Fazendo edicao do perfil completo...");
			const dtoEdicao = {
				nome: formData.nome || "",
				email: formData.email || "",
				telefoneContato: telefoneUsuarioDigits || "11999999999",
				endereco: {
					rua: formData.rua || "Rua Principal",
					numero: formData.numero || "1",
					complemento: formData.complemento || null,
					bairro: formData.bairro || "Centro",
					cidade: formData.cidade || "São Paulo",
					estado: formData.estado || "SP",
					cep: (formData.cep || "01000000").replace(/\D/g, "")
				},
				informacoes: {
					dataNascimento: dadosInformacoesPessoais.dataNascimento,
					cpf: cpfDigits || "00000000000",
					rg: rgFormatted || "00.000.000-0",
					contatoEmergencia: contatoEmergenciaDigits || "11999999999",
					relatorioAnamnese: dadosOriginais?.relatorioAnamnese || null,
					idioma: (formData.idiomas || "Português").trim(),
					questionarioRespondido: dadosOriginais?.questionarioRespondido || false,
					nivel: dadosOriginais?.nivel || "EXPLORADOR" // Garante que nunca seja null
				}
			};

			console.log("=== DTO EDICAO COMPLETO ===");
			console.log("dtoEdicao.informacoes.nivel:", dtoEdicao.informacoes.nivel);
			console.log("JSON completo:", JSON.stringify(dtoEdicao, null, 2));
			console.log("===========================");

			const resultado = await editarPerfilCompleto(usuarioId, dtoEdicao);
			console.log("Perfil editado com sucesso");
			try {
				const dadosAtualizados = await buscarPerfilCompleto(usuarioId);
				console.log("� Perfil recarregado após edição:", JSON.stringify(dadosAtualizados, null, 2));
				setFormData(prev => ({
					...prev,
					nome: dadosAtualizados.nome || prev.nome,
					email: dadosAtualizados.email || prev.email,
					telefone: dadosAtualizados.telefoneContato || prev.telefone,
					dataNascimento: convertDateToBrazilian(dadosAtualizados.dataNascimento),
					cpf: dadosAtualizados.cpf || prev.cpf,
					rg: dadosAtualizados.rg || prev.rg,
					idiomas: dadosAtualizados.idioma || prev.idiomas,
					contatoEmergencia: dadosAtualizados.contatoEmergencia || prev.contatoEmergencia,
					rua: dadosAtualizados.endereco?.rua || prev.rua,
					cep: dadosAtualizados.endereco?.cep || prev.cep,
					cidade: dadosAtualizados.endereco?.cidade || prev.cidade,
					estado: dadosAtualizados.endereco?.estado || prev.estado,
					bairro: dadosAtualizados.endereco?.bairro || prev.bairro,
					numero: dadosAtualizados.endereco?.numero || prev.numero,
					complemento: dadosAtualizados.endereco?.complemento || prev.complemento
				}));
			} catch (e) {
				console.warn("Nao foi possivel recarregar o perfil apos edicao.", e);
			}
			alert("Dados atualizados com sucesso!");
		} else {
			console.log("1. Fazendo CADASTRO (POST) do perfil completo...");

			const dtoCadastro = {
				endereco: {
					rua: formData.rua || "Rua Principal",
					numero: formData.numero || "1",
					complemento: formData.complemento || null,
					bairro: formData.bairro || "Centro",
					cidade: formData.cidade || "São Paulo",
					estado: formData.estado || "SP",
					cep: (formData.cep || "01000000").replace(/\D/g, "")
				},
				informacoes: {
					dataNascimento: dadosInformacoesPessoais.dataNascimento,
					cpf: cpfDigits || "00000000000",
					rg: rgFormatted || "00.000.000-0",
					contatoEmergencia: contatoEmergenciaDigits || "11999999999",
					relatorioAnamnese: null,
					idioma: (formData.idiomas || "Português").trim(),
					questionarioRespondido: false,
					nivel: dadosOriginais?.nivel || "EXPLORADOR" // Garante que nunca seja null
				}
			};

			const resultado = await cadastrarPerfilCompleto(usuarioId, dtoCadastro);
			console.log("Perfil cadastrado com sucesso");

			// Após cadastrar, vira modo edição e recarrega dados para refletir o salvo
			setIsEditMode(true);
			try {
				const dadosAtualizados = await buscarPerfilCompleto(usuarioId);
				console.log("Perfil recarregado apos cadastro");
				setFormData(prev => ({
					...prev,
					nome: dadosAtualizados.nome || prev.nome,
					email: dadosAtualizados.email || prev.email,
					telefone: dadosAtualizados.telefoneContato || prev.telefone,
					dataNascimento: convertDateToBrazilian(dadosAtualizados.dataNascimento),
					cpf: dadosAtualizados.cpf || prev.cpf,
					rg: dadosAtualizados.rg || prev.rg,
					idiomas: dadosAtualizados.idioma || prev.idiomas,
					contatoEmergencia: dadosAtualizados.contatoEmergencia || prev.contatoEmergencia,
					rua: dadosAtualizados.endereco?.rua || prev.rua,
					cep: dadosAtualizados.endereco?.cep || prev.cep,
					cidade: dadosAtualizados.endereco?.cidade || prev.cidade,
					estado: dadosAtualizados.endereco?.estado || prev.estado,
					bairro: dadosAtualizados.endereco?.bairro || prev.bairro,
					numero: dadosAtualizados.endereco?.numero || prev.numero,
					complemento: dadosAtualizados.endereco?.complemento || prev.complemento
				}));
			} catch (e) {
				console.warn("Nao foi possivel recarregar o perfil apos cadastro.", e);
			}
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
			
			console.error("Error response data:", error.response?.data);
			let serverMsg = 'Erro inesperado.';
			if (error.response?.data?.erro) {
				serverMsg = error.response.data.erro;
			} else if (error.response?.data?.message) {
				serverMsg = error.response.data.message;
			} else if (error.erro) {
				serverMsg = error.erro;
			} else if (error.message) {
				serverMsg = error.message;
			}
			
			if (serverMsg.includes('Validation failed')) {
				console.error("Validation error detected. Full message:", serverMsg);
				serverMsg = "Erro de validação nos dados. Verifique os campos obrigatórios e tamanhos permitidos.";
			}
			
			alert(`Erro ao ${isEditMode ? 'atualizar' : 'cadastrar'} dados: ${serverMsg}`);
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
				onClick={() => setShowConfirmation(true)}
				disabled={loading || saving}
			>
				{saving ? 
					(isEditMode ? "Atualizando..." : "Cadastrando...") : 
					(isEditMode ? "Salvar Alterações" : "Cadastrar Dados")
				}
			</button>
			
			<ConfirmationPopup
				isOpen={showConfirmation}
				title={isEditMode ? "Confirmar Alterações" : "Confirmar Cadastro"}
				message={isEditMode ? 
					"Tem certeza que deseja salvar as alterações em seus dados pessoais?" : 
					"Tem certeza que deseja cadastrar seus dados pessoais?"
				}
				confirmText={isEditMode ? "Salvar" : "Cadastrar"}
				cancelText="Cancelar"
				onConfirm={() => {
					setShowConfirmation(false);
					handleSubmit();
				}}
				onCancel={() => setShowConfirmation(false)}
			/>
		</div>
	);
}
