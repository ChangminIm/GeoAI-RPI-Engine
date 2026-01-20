
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeRelationshipContext = async (text: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    당신은 GeoAI 기반 '관계인구 지수(RPI)' 산출 모델입니다. 
    사용자가 입력한 텍스트를 분석하여 다음 연구 방법론에 따라 $X$ 지표와 $\alpha, \beta, \gamma$ 가중치를 산출하세요.

    1. 3대 정량 지표 산출 ($X$ - 0~100점):
       - $X_{emo}$ (정서적 애착): 지역에 대한 정서적 유대감 및 심리적 안정감
       - $X_{spa}$ (공간적 점유): 특정 장소 방문 빈도 및 생활 밀착형 공간 활용도
       - $X_{soc}$ (사회적 교류): 지역 주민 및 커뮤니티와의 상호작용 깊이

    2. Self-Attention 가중치 산정 (Attention Weights - 합계 1.0):
       - $\alpha$ (Alpha): $X_{emo}$가 전체 관계 형성에 기여하는 가중치
       - $\beta$ (Beta): $X_{spa}$가 전체 관계 형성에 기여하는 가중치
       - $\gamma$ (Gamma): $X_{soc}$가 전체 관계 형성에 기여하는 가중치

    3. 분석 결과 도출:
       - RPI Score = $(\alpha \cdot X_{emo}) + (\beta \cdot X_{spa}) + (\gamma \cdot X_{soc})$
       - 감성 궤적(Trajectory), 지식 그래프(ST-KG), 결정적 시기(Critical Period)를 포함하세요.

    텍스트: "${text}"
  `;

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
              emo: { type: Type.NUMBER, description: "X_emo Score" },
              spa: { type: Type.NUMBER, description: "X_spa Score" },
              soc: { type: Type.NUMBER, description: "X_soc Score" }
            },
            required: ['emo', 'spa', 'soc']
          },
          weights: {
            type: Type.OBJECT,
            properties: {
              alpha: { type: Type.NUMBER, description: "Weight for emo" },
              beta: { type: Type.NUMBER, description: "Weight for spa" },
              gamma: { type: Type.NUMBER, description: "Weight for soc" }
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
              emo: { type: Type.NUMBER, description: "Contribution of emo to final score" },
              spa: { type: Type.NUMBER, description: "Contribution of spa to final score" },
              soc: { type: Type.NUMBER, description: "Contribution of soc to final score" }
            }
          }
        },
        required: ['metrics', 'weights', 'rpiScore', 'summary', 'trajectory', 'knowledgeGraph', 'criticalPeriod', 'shapValue']
      }
    }
  });

  return JSON.parse(response.text) as AnalysisResult;
};
