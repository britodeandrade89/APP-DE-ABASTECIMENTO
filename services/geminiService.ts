
import { GoogleGenAI } from "@google/genai";
import type { ProcessedFuelEntry } from '../types.ts';

const API_KEY = process.env.API_KEY; 

if (!API_KEY) {
    console.warn("API Key do Gemini não configurada. As funções de IA não funcionarão.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = 'gemini-2.5-flash';

export const getAnalysisFromGemini = async (entries: ProcessedFuelEntry[], monthName: string): Promise<string> => {
    const dataSummary = entries.map(e => ({
        dia: e.date.getUTCDate(),
        gasto: e.totalValue.toFixed(2),
        media_km_l: e.avgKmpl.toFixed(1),
        combustivel: e.fuelType
    }));

    const systemInstruction = "Você é um assistente especialista em análise de dados automotivos e finanças pessoais. Sua tarefa é analisar os dados de abastecimento de um usuário para um mês específico e fornecer um resumo claro, conciso e útil em português do Brasil. Use um tom amigável e informativo. Formate sua resposta com parágrafos, listas e use a tag <strong> para destaques.";
    const userQuery = `Aqui estão os dados de abastecimento para ${monthName}:\n\n${JSON.stringify(dataSummary)}\n\nCom base nesses dados, gere uma análise que inclua:\n1. Um breve resumo geral do mês (gasto total, distância percorrida).\n2. O dia em que o gasto com combustível foi maior.\n3. A melhor e a pior média de consumo (km/L) registrada.\n4. Uma dica prática e personalizada para ajudar o usuário a economizar combustível, com base nos padrões observados.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: userQuery,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Erro ao chamar a API Gemini para análise:", error);
        return "Desculpe, não foi possível completar a análise no momento. Verifique a configuração da API e tente novamente mais tarde.";
    }
};

export const getTripEstimateFromGemini = async (distance: number, avgKmpl: number): Promise<string> => {
    const systemInstruction = "Você é um assistente de planejamento de viagens. Sua tarefa é calcular o custo de uma viagem de carro e fornecer dicas úteis. Assuma um preço médio de R$ 5,80 por litro de gasolina para o cálculo.";
    const userQuery = `Preciso estimar o custo de uma viagem de ${distance} km. O consumo médio do meu carro é de ${avgKmpl.toFixed(1)} km/L. Com base no preço médio de R$ 5,80 por litro de gasolina, calcule o custo total da viagem. Apresente o resultado de forma clara, incluindo o preço do combustível assumido, os litros necessários e o custo final. Adicione também 2 dicas para uma direção mais econômica durante a viagem. Use a tag <strong> para destaques.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: userQuery,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Erro ao chamar a API Gemini para estimativa:", error);
        return "Desculpe, não foi possível completar a estimativa no momento. Verifique a configuração da API e tente novamente mais tarde.";
    }
};
