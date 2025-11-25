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

function validarGPX(conteudoXML) {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(conteudoXML, 'application/xml');

        const parserError = doc.querySelector('parsererror');
        if (parserError) {
            return false;
        }

        const gpxElement = doc.documentElement;
        if (!gpxElement || gpxElement.tagName.toLowerCase() !== 'gpx') {
            return false;
        }

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

function comprimirGPX(gpxContent) {
    return gpxContent
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/>\s+</g, '><')
        .replace(/^\s+|\s+$/gm, '')
        .replace(/\n\s*\n/g, '\n')
        .replace(/\s+>/g, '>')
        .replace(/\s+/g, ' ')
        .trim();
}

export async function cadastrarEvento(formDataValues, navigate, usuarioId) {
    try {
        const formData = new FormData();

        let conteudoGpx = null;
        if (formDataValues.trilha) {
            try {
                conteudoGpx = await lerConteudoArquivo(formDataValues.trilha);

                conteudoGpx = comprimirGPX(conteudoGpx);

            } catch (error) {
                console.error("Erro ao processar arquivo GPX: " + error.message);
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
            responsavel: usuarioId, 
            endereco: {
                rua: formDataValues.rua || "",
                numero: formDataValues.numero || "",
                complemento: formDataValues.complemento || "",
                bairro: formDataValues.bairro || "",
                cidade: formDataValues.cidade || "",
                estado: formDataValues.estado || "",
                cep: formDataValues.cep || ""
            },
            caminho_arquivo_evento: conteudoGpx 
        };

        formData.append(
            "evento",
            new Blob([JSON.stringify(eventoDTO)], { type: "application/json" })
        );

        if (formDataValues.imagem) {
            formData.append("imagem", formDataValues.imagem);
        }

        if (formDataValues.pdf) {
            formData.append("pdf", formDataValues.pdf);
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
        const response = await axios.get(`http://localhost:8080/administrador/buscar-evento-base-especifico/${params.id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar dados do evento:", error);
        throw error;
    }
}


export async function buscarenderecoEvento(enderecoId) {
    try {
        const response = await axios.get(`http://localhost:8080/administrador/buscar-endereco-evento-especifico/${enderecoId}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar endereço do evento:", error);
        throw error;
    }
}

export const editarEvento = async (eventoData, eventoId) => {
    try {
        const formData = new FormData();

        let conteudoGpx = null;
        let trilhaFileToAppend = null; 
        if (eventoData.trilha) {
            try {
                if (typeof File !== 'undefined' && eventoData.trilha instanceof File) {
                    trilhaFileToAppend = eventoData.trilha;
                } else if (typeof eventoData.trilha === 'object' && eventoData.trilha.content) {
                    conteudoGpx = eventoData.trilha.content;
                } else if (typeof eventoData.trilha === 'string') {
                    conteudoGpx = eventoData.trilha;
                }

                if (conteudoGpx) {
                    conteudoGpx = comprimirGPX(conteudoGpx);
                }
            } catch (error) {
                // Serviços não devem usar alert() (sem DOM). Logamos e retornamos false para o caller tratar a UI.
                console.error("Erro ao processar arquivo GPX: " + error.message);
                return false;
            }
        }

        let usuarioId = null;
        try {
            const usuario = JSON.parse(sessionStorage.getItem("usuario"));
            usuarioId = usuario?.id ?? null;
        } catch (e) {
            usuarioId = null;
        }

        const nome = eventoData.nome || eventoData.titulo || "";
        const descricao = eventoData.descricao || "";
        const nivel = eventoData.nivel_dificuldade || eventoData.dificuldade || "";
        const distancia_km = eventoData.distancia_km
            ? Number(eventoData.distancia_km)
            : eventoData.distancia
                ? parseFloat(String(eventoData.distancia).replace(" km", ""))
                : 0;

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

        
    // Append image if user selected a new File or if we previously loaded
    // the existing image blob (to preserve it when submitting updates).
        if (eventoData.imagem) {
            // Case: user selected a File
            if (typeof File !== 'undefined' && eventoData.imagem instanceof File) {
                formData.append("imagem", eventoData.imagem);
            } else if (typeof eventoData.imagem === 'object' && eventoData.imagem.blob) {
                // append blob (from previously fetched server image)
                const blob = eventoData.imagem.blob;
                const filename = eventoData.imagem.name || `imagem-${eventoId || 'evento'}.jpg`;
                formData.append('imagem', blob, filename);
            }
        }

        if (trilhaFileToAppend) {
            formData.append('trilha', trilhaFileToAppend);
        } else if (conteudoGpx) {
        }

        if (eventoData.pdf) {
            console.log('PDF detectado:', eventoData.pdf);
            if (typeof File !== 'undefined' && eventoData.pdf instanceof File) {
                console.log('Enviando PDF como File:', eventoData.pdf.name);
                formData.append("pdf", eventoData.pdf);
            } else if (typeof eventoData.pdf === 'object' && eventoData.pdf.blob) {
                console.log('Enviando PDF como Blob');
                const blob = eventoData.pdf.blob;
                const filename = eventoData.pdf.name || `documento-${eventoId || 'evento'}.pdf`;
                formData.append('pdf', blob, filename);
            }
        } else {
            console.log('Nenhum PDF detectado em eventoData');
        }

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





        const dataAtivacao = dayjs(formDataValues.dataEvento).format("YYYY-MM-DD");

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
            `http://localhost:8080/administrador/cadastrar-evento-ativo`,
            payload
        );

        return true;
    } catch (error) {
        console.error("Erro:", error.response?.data || error.message);
        return false;
    }
}   

export const alterarEstadoEvento = async (id, estado, forcar = false) => {
  try {
    const response = await axios.put(
      `http://localhost:8080/ativacoes/${id}/estado`,
      null,
      {
        params: { estado, forcar }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao alterar estado do evento:", error);
    throw error;
  }
};


export async function atualizarAtivacaoEvento(id, eventoData) {
  try {

        const payload = {
            horaInicio: eventoData.horaInicio,
            horaFinal: eventoData.horaFim,
            tempoEstimado: eventoData.tempoEstimado,
            limiteInscritos: eventoData.limiteInscritos,
            dataAtivacao: eventoData.dataEvento,
            tipo: eventoData.categoria,
            preco: eventoData.preco,
            estado: eventoData.estado
        };

            if (eventoData && eventoData.eventoId !== undefined && eventoData.eventoId !== null) {
                payload.eventoId = eventoData.eventoId;
            } else if (eventoData && eventoData.idEvento !== undefined && eventoData.idEvento !== null) {
                payload.eventoId = eventoData.idEvento;
            }

            if (payload.eventoId === null) delete payload.eventoId;

            const response = await axios.put(`http://localhost:8080/ativacoes/${id}`, payload);
            return response.data;
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    throw error;
  }
}

export const excluirEventoBase = async (id) => {    
    try {
        const response = await axios.delete(
            `http://localhost:8080/ativacoes/evento-base/${id}`,
        );
        return response.data;
    }   
    catch (error) {
        console.error("Erro ao excluir evento base:", error);
        throw error;
    }
};