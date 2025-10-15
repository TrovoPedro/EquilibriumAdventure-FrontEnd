import axios from "axios";
import dayjs from "dayjs";

// Função para ler o conteúdo completo de um arquivo
async function lerConteudoArquivo(arquivo) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const conteudo = event.target.result;

            // Validar se é um arquivo GPX válido
            if (!validarGPX(conteudo)) {
                reject(new Error("Arquivo GPX inválido. Verifique se o arquivo contém dados de trilha válidos."));
                return;
            }

            resolve(conteudo);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        // Ler como texto (GPX é XML, que é texto)
        reader.readAsText(arquivo);
    });
}

// Função para validar se o conteúdo é um GPX válido
function validarGPX(conteudoXML) {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(conteudoXML, 'application/xml');

        // Verificar se há erros de parsing
        const parserError = doc.querySelector('parsererror');
        if (parserError) {
            return false;
        }

        // Verificar se é um arquivo GPX (deve ter o elemento raiz <gpx>)
        const gpxElement = doc.documentElement;
        if (!gpxElement || gpxElement.tagName.toLowerCase() !== 'gpx') {
            return false;
        }

        // Verificar se tem pelo menos uma trilha (track) ou waypoint
        const tracks = doc.querySelectorAll('trk');
        const waypoints = doc.querySelectorAll('wpt');
        const routes = doc.querySelectorAll('rte');

        if (tracks.length === 0 && waypoints.length === 0 && routes.length === 0) {
            return false;
        }

        return true;

    } catch (error) {
        return false;
    }
}

// Função para comprimir GPX removendo espaços e comentários desnecessários
function comprimirGPX(gpxContent) {
    return gpxContent
        // Remover comentários XML
        .replace(/<!--[\s\S]*?-->/g, '')
        // Remover quebras de linha e espaços múltiplos entre tags
        .replace(/>\s+</g, '><')
        // Remover espaços no início e fim de linhas
        .replace(/^\s+|\s+$/gm, '')
        // Remover linhas vazias
        .replace(/\n\s*\n/g, '\n')
        // Remover espaços antes de fechamento de tags
        .replace(/\s+>/g, '>')
        // Comprimir espaços em atributos (manter apenas um espaço)
        .replace(/\s+/g, ' ')
        .trim();
}

export async function cadastrarEvento(formDataValues, navigate, usuarioId) {
    try {
        const formData = new FormData();

        // Ler o conteúdo do arquivo GPX se existir
        let conteudoGpx = null;
        if (formDataValues.trilha) {
            try {
                conteudoGpx = await lerConteudoArquivo(formDataValues.trilha);

                // Comprimir o GPX removendo espaços e quebras de linha desnecessárias
                conteudoGpx = comprimirGPX(conteudoGpx);

            } catch (error) {
                alert("Erro ao processar arquivo GPX: " + error.message);
                return false;
            }
        }

        const eventoDTO = {
            nome: formDataValues.titulo || "",
            descricao: formDataValues.descricao || "",
            nivel_dificuldade: formDataValues.dificuldade || "",
            distancia_km: formDataValues.distancia
                ? parseFloat(formDataValues.distancia.replace(" km", ""))
                : 0,
            responsavel: usuarioId, // <--- aqui passa o ID do usuário logado
            endereco: {
                rua: formDataValues.rua || "",
                numero: formDataValues.numero || "",
                complemento: formDataValues.complemento || "",
                bairro: formDataValues.bairro || "",
                cidade: formDataValues.cidade || "",
                estado: formDataValues.estado || "",
                cep: formDataValues.cep || ""
            },
            caminho_arquivo_evento: conteudoGpx // <--- Agora salva o conteúdo GPX comprimido
        };

        formData.append(
            "evento",
            new Blob([JSON.stringify(eventoDTO)], { type: "application/json" })
        );

        if (formDataValues.imagem) {
            formData.append("imagem", formDataValues.imagem);
        }

        const response = await axios.post(
            "http://localhost:8080/guia/cadastrar",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (response.data.success) {
            alert("Evento cadastrado com sucesso!");
            navigate("/catalogo-trilhas-adm");
            return true;
        } else {
            throw new Error(response.data.message || "Erro ao cadastrar evento.");
        }
    } catch (error) {
        return false;
    }
}

export async function buscarCep(cep) {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) throw new Error("Erro ao buscar CEP");
    const data = await response.json();
    if (data.erro) throw new Error("CEP não encontrado");
    return data;
}

export async function buscarDadosEvento(params) {
    try {
        const response = await axios.get(`http://localhost:8080/adiministrador/buscar-evento-base-especifico/${params.id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar dados do evento:", error);
        throw error;
    }
}


export async function buscarenderecoEvento(enderecoId) {
    try {
        const response = await axios.get(`http://localhost:8080/adiministrador/buscar-endereco-evento-especifico/${enderecoId}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar endereço do evento:", error);
        throw error;
    }
}

export const editarEvento = async (eventoData, eventoId) => {
    try {
        const formData = new FormData();

        // Processar arquivo GPX se presente
        let conteudoGpx = null;
        if (eventoData.trilha) {
            try {
                conteudoGpx = await lerConteudoArquivo(eventoData.trilha);
                conteudoGpx = comprimirGPX(conteudoGpx);
            } catch (error) {
                alert("Erro ao processar arquivo GPX: " + error.message);
                return false;
            }
        }

        // Tentar obter usuarioId do localStorage (fallback seguro)
        let usuarioId = null;
        try {
            const usuario = JSON.parse(sessionStorage.getItem("usuario"));
            usuarioId = usuario?.id ?? null;
        } catch (e) {
            usuarioId = null;
        }

        // Normalizar nomes de campo (aceitar tanto 'titulo' quanto 'nome', etc.)
        const nome = eventoData.nome || eventoData.titulo || "";
        const descricao = eventoData.descricao || "";
        const nivel = eventoData.nivel_dificuldade || eventoData.dificuldade || "";
        const distancia_km = eventoData.distancia_km
            ? Number(eventoData.distancia_km)
            : eventoData.distancia
                ? parseFloat(String(eventoData.distancia).replace(" km", ""))
                : 0;

        // Endereço pode vir aninhado em eventoData.endereco ou nos campos raiz
        const enderecoInput = eventoData.endereco || {};
        const enderecoObj = {
            rua: enderecoInput.rua || eventoData.rua || "",
            numero: enderecoInput.numero || eventoData.numero || "",
            complemento: enderecoInput.complemento || eventoData.complemento || "",
            bairro: enderecoInput.bairro || eventoData.bairro || "",
            cidade: enderecoInput.cidade || eventoData.cidade || "",
            estado: enderecoInput.estado || eventoData.estado || "",
            cep: enderecoInput.cep || eventoData.cep || "",
        };

        const eventoDTO = {
            nome,
            descricao,
            nivel_dificuldade: nivel,
            distancia_km,
            responsavel: usuarioId,
            endereco: enderecoObj,
            caminho_arquivo_evento: conteudoGpx,
        };

        formData.append(
            "evento",
            new Blob([JSON.stringify(eventoDTO)], { type: "application/json" })
        );

        if (eventoData.imagem) {
            formData.append("imagem", eventoData.imagem);
        }

        // determinar enderecoId: preferir eventoData.endereco.id, depois enderecoInput.id
        const enderecoId = (eventoData.endereco && eventoData.endereco.id) || enderecoInput.id || eventoData.enderecoId || null;
        if (!enderecoId) {
            throw new Error("enderecoId não informado para editarEvento");
        }

        const response = await axios.put(
            `http://localhost:8080/guia/editar-evento/${eventoId}/${enderecoId}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Erro ao editar evento:", error);
        throw error;
    }
};

export async function ativarEvento(formDataValues) {
    try {

        const horaInicio = `${formDataValues.horaInicio}:00`
        const horaFinal = `${formDataValues.horaFim}:00`





        const dataAtivacao = dayjs().format("YYYY-MM-DD");

        const eventoId = formDataValues.evento ?? formDataValues.idEvento ?? formDataValues.id;

        const payload = {
            horaInicio,
            horaFinal: horaFinal,
            tempoEstimado: formDataValues.duracao ? parseFloat(formDataValues.duracao) : null,
            limiteInscritos: formDataValues.limiteInscritos ? parseInt(formDataValues.limiteInscritos, 10) : null,
            dataAtivacao,
            tipo: formDataValues.categoria,
            estado: "NAO_INICIADO",
            preco: formDataValues.preco ? parseFloat(formDataValues.preco) : null,
            eventoId: eventoId ? parseInt(eventoId, 10) : null
        };


        const response = await axios.post(
            `http://localhost:8080/adiministrador/cadastrar-evento-ativo`,
            payload
        );

        return true;
    } catch (error) {
        console.error("Erro:", error.response?.data || error.message);
        return false;
    }
}