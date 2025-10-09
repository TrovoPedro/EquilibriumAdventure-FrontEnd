import axios from "axios";

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
