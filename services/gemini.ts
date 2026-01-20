
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeRelationshipContext = async (text: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `
    당신은 개인과 지역의 유대 관계를 분석하는 'GeoAI 관계인구 분석 전문가'입니다.
    다음 텍스트를 분석하여 '관계인구 지수(RPI)'를 산출하고 결과를 JSON으로 반환하세요.
    수식 기호(X, 알파 등)는 절대 사용하지 말고 오직 한국어 명칭만 사용하세요.

    중요: 모든 숫자 데이터(rpiScore, shapValue, weight 등)는 반드시 소수점 둘째 자리까지만 계산하여 출력하세요. 
    불필요하게 긴 소수점 자릿수를 생성하지 마세요.

    핵심 요구사항:
    1. 지표(0-100점): 정서적 애착(emo), 공간적 점유(spa), 사회적 교류(soc)
    2. 가중치(합계 1.0): alpha(정서), beta(공간), gamma(사회) - 소수점 2자리 제한
    3. 요약문(summary): 2문장 내외로 간결하게 작성
    4. 지식 그래프: 가장 중요한 노드 5-7개, 엣지 5-8개로 핵심만 요약
    5. SHAP 값: 각 지표가 최종 점수에 기여한 정도를 수치화 (반드시 소수점 2자리 이내 숫자로만 표현)

    텍스트: "${text.substring(0, 4000)}" 
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
                emo: { type: Type.NUMBER, description: "0-100 점수" },
                spa: { type: Type.NUMBER, description: "0-100 점수" },
                soc: { type: Type.NUMBER, description: "0-100 점수" }
              },
              required: ['emo', 'spa', 'soc']
            },
            weights: {
              type: Type.OBJECT,
              properties: {
                alpha: { type: Type.NUMBER, description: "가중치 (0~1)" },
                beta: { type: Type.NUMBER, description: "가중치 (0~1)" },
                gamma: { type: Type.NUMBER, description: "가중치 (0~1)" }
              },
              required: ['alpha', 'beta', 'gamma']
            },
            rpiScore: { type: Type.NUMBER, description: "최종 RPI 점수" },
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
                emo: { type: Type.NUMBER, description: "소수점 2자리 숫자" },
                spa: { type: Type.NUMBER, description: "소수점 2자리 숫자" },
                soc: { type: Type.NUMBER, description: "소수점 2자리 숫자" }
              }
            }
          },
          required: ['metrics', 'weights', 'rpiScore', 'summary', 'trajectory', 'knowledgeGraph', 'criticalPeriod', 'shapValue']
        }
      }
    });

    let jsonString = response.text.trim();
    
    // Markdown 코드 블록 제거 로직 강화
    if (jsonString.includes('```')) {
      const match = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match && match[1]) {
        jsonString = match[1];
      } else {
        jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '');
      }
    }
    
    try {
      const result = JSON.parse(jsonString);
      
      // 파싱 후에도 혹시 모를 긴 소수점 데이터를 방지하기 위한 강제 라운딩 처리 (Optional but safe)
      if (result.shapValue) {
        Object.keys(result.shapValue).forEach(key => {
          if (typeof result.shapValue[key] === 'number') {
            result.shapValue[key] = Math.round(result.shapValue[key] * 100) / 100;
          }
        });
      }

      return result as AnalysisResult;
    } catch (parseError) {
      console.error("Critical JSON Parsing Error. Raw content snippet:", jsonString.substring(0, 200));
      throw new Error("AI가 생성한 데이터 형식이 복잡하여 분석에 실패했습니다. 다시 한번 'RPI 분석 실행'을 눌러주세요.");
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
