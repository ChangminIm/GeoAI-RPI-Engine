
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeRelationshipContext = async (text: string): Promise<AnalysisResult> => {
  // Always create a new GoogleGenAI instance right before making an API call to ensure it uses most up-to-date environment config.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    당신은 GeoAI 기반 '관계인구 지수(RPI)' 산출 모델입니다. 
    사용자가 입력한 '한 달 살기' 수기 또는 SNS 텍스트를 분석하여 다음 연구 방법론에 따라 결과를 산출하세요.

    1. 3대 정량 지표 산출 (0-100점):
       - X_emo (정서적 애착): 유대감, 심리적 안정 표현의 강도
       - X_spa (공간적 점유): 생활 밀착형 장소(마을회관, 시장 등) 방문 및 점유 묘사
       - X_soc (사회적 교류): 주민/상인과의 상호작용 빈도 및 깊이

    2. Self-Attention 가중치 산정 (alpha, beta, gamma):
       - 텍스트 맥락상 '재방문 의사'나 '지역 애착'을 결정짓는 데 가장 크게 기여한 지표에 높은 가중치를 부여하세요 (합계 1.0).

    3. 감성 궤적 (Sentiment Trajectory):
       - 텍스트의 흐름을 1주차~4주차로 구분하여 관계 형성 점수의 변화를 추정하세요.

    4. 시공간 지식 그래프 (ST-KG):
       - 텍스트에 등장하는 주요 장소(Node)와 활동(Edge) 간의 관계 및 관계 형성 확률(strength)을 추출하세요.

    5. 결정적 시기 (Critical Period):
       - 관계 형성이 급증하거나 이탈 위험이 있는 시기를 특정하세요.

    분석할 텍스트:
    "${text}"
  `;

  // Using gemini-3-pro-preview for complex reasoning and structured knowledge graph extraction tasks.
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          metrics: {
            type: Type.OBJECT,
            properties: {
              emo: { type: Type.NUMBER },
              spa: { type: Type.NUMBER },
              soc: { type: Type.NUMBER }
            },
            required: ['emo', 'spa', 'soc']
          },
          weights: {
            type: Type.OBJECT,
            properties: {
              alpha: { type: Type.NUMBER },
              beta: { type: Type.NUMBER },
              gamma: { type: Type.NUMBER }
            },
            required: ['alpha', 'beta', 'gamma']
          },
          rpiScore: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          criticalPeriod: { type: Type.STRING },
          trajectory: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                period: { type: Type.STRING },
                score: { type: Type.NUMBER }
              }
            }
          },
          knowledgeGraph: {
            type: Type.OBJECT,
            properties: {
              nodes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    label: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['Place', 'Activity', 'Interaction'] }
                  }
                }
              },
              edges: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    source: { type: Type.STRING },
                    target: { type: Type.STRING },
                    strength: { type: Type.NUMBER }
                  }
                }
              }
            }
          },
          shapValue: {
            type: Type.OBJECT,
            properties: {
              emo: { type: Type.NUMBER },
              spa: { type: Type.NUMBER },
              soc: { type: Type.NUMBER }
            }
          }
        },
        required: ['metrics', 'weights', 'rpiScore', 'summary', 'trajectory', 'knowledgeGraph', 'criticalPeriod', 'shapValue']
      }
    }
  });

  // Extract text directly from property, following SDK guidelines.
  return JSON.parse(response.text) as AnalysisResult;
};