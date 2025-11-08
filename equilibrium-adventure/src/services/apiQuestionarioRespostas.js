const API_BASE_URL = 'http://localhost:8080';

/**
 * Service para gerenciar perguntas e respostas do questionário de nivelamento
 */

/**
 * Lista todas as perguntas do questionário com as respectivas respostas do usuário
 * @param {number} idUsuario - ID do usuário/aventureiro
 * @returns {Promise<Array>} Lista de perguntas com respostas
 */
export const listarPerguntasComRespostas = async (idUsuario) => {
    try {
        const response = await fetch(`${API_BASE_URL}/respostas-aventureiro/perguntas-com-respostas?idUsuario=${idUsuario}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                return [];
            }
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        
        return data;
    } catch (error) {
        throw new Error(`Falha ao carregar questionário: ${error.message}`);
    }
};

/**
 * Formatar as respostas do questionário para exibição em texto
 * @param {Array} perguntasComRespostas - Lista de perguntas com respostas
 * @returns {string} Texto formatado para exibição
 */
export const formatarRespostasParaTexto = (perguntasComRespostas) => {
    if (!perguntasComRespostas || perguntasComRespostas.length === 0) {
        return 'Nenhuma resposta de questionário disponível';
    }

    return perguntasComRespostas.map((item, index) => {
        const numeroQuestao = index + 1;
        const pergunta = item.textoPergunta;
        
        // Encontrar a alternativa escolhida pelo índice (valor escolhido - 1)
        let textoResposta = 'Não respondida';
        if (item.alternativaEscolhida !== null && item.alternativaEscolhida !== undefined && item.alternativas) {
            const indiceEscolhido = item.alternativaEscolhida - 1;
            const alternativaSelecionada = item.alternativas.find(alt => alt.second === indiceEscolhido);
            if (alternativaSelecionada) {
                textoResposta = `${alternativaSelecionada.first} (Alternativa: ${item.alternativaEscolhida})`;
            }
        }

        return `${numeroQuestao}. ${pergunta}\nResposta: ${textoResposta}\n`;
    }).join('\n');
};

/**
 * Calcular pontuação total do questionário
 * @param {Array} perguntasComRespostas - Lista de perguntas com respostas
 * @returns {Object} Objeto com pontuação e detalhes
 */
export const calcularPontuacaoQuestionario = (perguntasComRespostas) => {
    if (!perguntasComRespostas || perguntasComRespostas.length === 0) {
        return {
            pontuacaoTotal: 0,
            questoesRespondidas: 0,
            totalQuestoes: 0,
            percentualConcluido: 0
        };
    }

    let pontuacaoTotal = 0;
    let questoesRespondidas = 0;
    const totalQuestoes = perguntasComRespostas.length;

    perguntasComRespostas.forEach(item => {
        if (item.alternativaEscolhida !== null && item.alternativaEscolhida !== undefined) {
            questoesRespondidas++;
            
            // Encontrar valor da alternativa pelo índice (valor escolhido - 1)
            if (item.alternativas) {
                const indiceEscolhido = item.alternativaEscolhida - 1;
                const alternativaSelecionada = item.alternativas.find(alt => alt.second === indiceEscolhido);
                if (alternativaSelecionada) {
                    pontuacaoTotal += alternativaSelecionada.second;
                }
            }
        }
    });

    const percentualConcluido = Math.round((questoesRespondidas / totalQuestoes) * 100);

    return {
        pontuacaoTotal,
        questoesRespondidas,
        totalQuestoes,
        percentualConcluido
    };
};

/**
 * Obter estatísticas do questionário para exibição
 * @param {number} idUsuario - ID do usuário
 * @returns {Promise<Object>} Estatísticas do questionário
 */
export const obterEstatisticasQuestionario = async (idUsuario) => {
    try {
        const perguntasComRespostas = await listarPerguntasComRespostas(idUsuario);
        const estatisticas = calcularPontuacaoQuestionario(perguntasComRespostas);
        const textoFormatado = formatarRespostasParaTexto(perguntasComRespostas);

        return {
            ...estatisticas,
            respostasFormatadas: textoFormatado,
            dadosBrutos: perguntasComRespostas
        };
    } catch (error) {
        throw error;
    }
};

/**
 * Garantir pontuação mínima para anamnese (mínimo 8 pontos para nível explorador)
 * @param {number} idUsuario - ID do usuário
 * @returns {Promise<Object>} Resultado com pontuação anterior e atual
 */
export const garantirPontuacaoMinimaParaAnamnese = async (idUsuario) => {
    try {
        const response = await fetch(`${API_BASE_URL}/respostas-aventureiro/garantir-pontuacao-minima?idUsuario=${idUsuario}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        
        return data;
    } catch (error) {
        throw new Error(`Falha ao ajustar pontuação: ${error.message}`);
    }
};