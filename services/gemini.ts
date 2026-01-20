
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeRelationshipContext = async (text: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    당신은 GeoAI 기반 '관계인구 지수(RPI)'를 산출하는 데이터 과학 전문가입니다.
    사용자가 입력한 텍스트를 분석하여 다음 3대 지표와 중요도(가중치)를 산출하세요. 수식 기호(X, 알파, 베타 등)는 절대 사용하지 말고 오직 한글 명칭만 사용하세요.

    1. 3대 핵심 지표 (점수: 0-100점):
       - 정서적 애착: 지역에 대한 심리적 유대감과 애정의 정도
       - 공간적 점유: 특정 장소 방문 및 체류 묘사의 구체성과 빈도
       - 사회적 교류: 주민과의 소통 및 커뮤니티 참여 수준

    2. 중요도 가중치 (3개 항목 합계 1.0):
       - 텍스트 맥락에서 관계 형성에 가장 결정적인 영향을 미친 요소에 더 높은 비중을 부여하세요.
       - 정서적 애착 가중치, 공간적 점유 가중치, 사회적 교류 가중치를 각각 산정하세요.

    3. 최종 결과 산출 공식:
       최종 점수 = (정서적 애착 점수 * 가중치) + (공간적 점유 점수 * 가중치) + (사회적 교류 점수 * 가중치)
       결과 점수는 반올림하여 정수로 반환하세요.

    4. 추가 데이터:
       - 감성 궤적: 시간 흐름에 따른 관계 형성도 변화
       - 지식 그래프: 주요 장소, 활동, 상호작용 간의 관계망
       - 결정적 시기: 관계가 깊어진 핵심 순간

    분석할 텍스트:
    "${text}"
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
              emo: { type: Type.NUMBER, description: "정서적 애착 점수" },
              spa: { type: Type.NUMBER, description: "공간적 점유 점수" },
              soc: { type: Type.NUMBER, description: "사회적 교류 점수" }
            },
            required: ['emo', 'spa', 'soc']
          },
          weights: {
            type: Type.OBJECT,
            properties: {
              alpha: { type: Type.NUMBER, description: "정서적 애착 가중치" },
              beta: { type: Type.NUMBER, description: "공간적 점유 가중치" },
              gamma: { type: Type.NUMBER, description: "사회적 교류 가중치" }
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
              emo: { type: Type.NUMBER, description: "정서적 애착 기여도" },
              spa: { type: Type.NUMBER, description: "공간적 점유 기여도" },
              soc: { type: Type.NUMBER, description: "사회적 교류 기여도" }
            }
          }
        },
        required: ['metrics', 'weights', 'rpiScore', 'summary', 'trajectory', 'knowledgeGraph', 'criticalPeriod', 'shapValue']
      }
    }
  });

  return JSON.parse(response.text) as AnalysisResult;
};
