import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Vite가 주입하는 환경 변수 타입을 인식시키기 위함
const API_KEY = (process.env as any).API_KEY;

export const analyzeRelationshipContext = async (text: string): Promise<AnalysisResult> => {
  if (!API_KEY) {
    throw new Error("API_KEY가 설정되지 않았습니다. Vercel 설정에서 Environment Variables를 확인하세요.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `
    당신은 개인과 지역의 유대 관계를 분석하는 'GeoAI 관계인구 분석 전문가'입니다.
    다음 텍스트를 분석하여 '관계인구 지수(RPI)'를 산출하고 결과를 JSON으로 반환하세요.
    모든 숫자 결과(rpiScore, metrics, shapValue, weights)는 반드시 소수점 2자리 이하의 실수 혹은 정수로만 작성하세요. 

    분석 기준:
    - metrics: emo(정서), spa(공간), soc(사회) 각 0-100점
    - weights: alpha, beta, gamma 합계 1.0 (각 중요도)
    - trajectory: 시간에 따른 점수 변화 추이 (최대 5포인트)
    - knowledgeGraph: 텍스트 내 주요 장소, 활동, 상호작용 노드와 연결 강도(0~1)

    텍스트: "${text.substring(0, 3000)}" 
  `;

  try {
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

    let jsonString = response.text.trim();
    if (jsonString.includes('```')) {
      const match = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      jsonString = match ? match[1] : jsonString.replace(/```json/g, '').replace(/```/g, '');
    }
    
    try {
      const result = JSON.parse(jsonString);
      ['rpiScore', 'metrics', 'weights', 'shapValue'].forEach(key => {
        if (result[key] && typeof result[key] === 'object') {
          Object.keys(result[key]).forEach(subKey => {
            if (typeof result[key][subKey] === 'number') result[key][subKey] = Math.round(result[key][subKey] * 100) / 100;
          });
        } else if (typeof result[key] === 'number') {
          result[key] = Math.round(result[key] * 100) / 100;
        }
      });
      return result as AnalysisResult;
    } catch (e) {
      console.error("Parse Error Details:", jsonString);
      throw new Error("AI 데이터 형식이 올바르지 않습니다.");
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};