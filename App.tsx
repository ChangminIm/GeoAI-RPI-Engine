
import React, { useState } from 'react';
import { analyzeRelationshipContext } from './services/gemini';
import { AnalysisResult, HistoryItem } from './types';
import RPIVisualization from './components/RPIVisualization';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const analysisResult = await analyzeRelationshipContext(inputText);
      setResult(analysisResult);
      
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        text: inputText,
        result: analysisResult
      };
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
    } catch (err: any) {
      console.error(err);
      setError('RPI 분석 중 오류가 발생했습니다. 데이터셋 기준에 부합하지 않을 수 있습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/80">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-cyan-400 animate-pulse"></div>
              <svg className="w-6 h-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter">GeoAI <span className="text-indigo-600">RPI Engine</span></h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Relational Population Index Analyzer</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-10 space-y-10">
        {/* Research Input Section */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <span className="text-8xl font-black">X_rpi</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">하이브리드 데이터 마이닝</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">한 달 살기 수기, SNS, 블로그 데이터를 입력하여 RPI를 산출합니다.</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold border border-indigo-100">#Self-Attention</span>
              <span className="px-3 py-1 bg-cyan-50 text-cyan-600 rounded-full text-[10px] font-bold border border-cyan-100">#ST-KG</span>
            </div>
          </div>
          <textarea
            className="w-full h-48 p-6 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none transition-all text-slate-700 leading-relaxed text-lg"
            placeholder="[연구 데이터 입력] 예: 1주차에는 마을 회관 근처 숙소에 머물며 긴장했지만, 2주차에 로컬 시장 상인분들과 대화하며 큰 유대감을 느꼈습니다..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !inputText.trim()}
              className={`group flex items-center gap-3 px-12 py-5 rounded-2xl font-black text-xl transition-all shadow-2xl ${
                isAnalyzing || !inputText.trim()
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-slate-900 text-white hover:bg-black hover:scale-[1.02] active:scale-95'
              }`}
            >
              {isAnalyzing ? "Self-Attention 모델링 중..." : "RPI 가중치 산출"}
              {!isAnalyzing && <svg className="w-6 h-6 animate-pulse text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            </button>
          </div>
        </section>

        {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-r-2xl font-bold flex items-center gap-3 animate-head-shake"><span>❌</span> {error}</div>}

        {/* Results Dash */}
        {result && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {/* Main Score & XAI Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[3rem] text-white shadow-2xl flex flex-col items-center justify-center text-center">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Relational Population Index</div>
                <div className="text-8xl font-black mb-2">{result.rpiScore}</div>
                <div className="h-1 w-20 bg-white/20 rounded-full mb-4"></div>
                <p className="text-indigo-100 text-xs font-bold px-4 leading-tight opacity-80">
                  {result.rpiScore >= 80 ? '임계치(Critical Point)를 넘은 안정적 관계' : 
                   result.rpiScore >= 50 ? '관계 형성 잠재력이 높은 유망 단계' : '초기 탐색 및 이탈 주의 단계'}
                </p>
              </div>

              <div className="md:col-span-2 bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">설명 가능한 AI (SHAP 기여 분석)</h3>
                  <div className="space-y-4">
                    {Object.entries(result.shapValue).map(([key, val]) => (
                      <div key={key}>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-500">{key === 'emo' ? '정서적 애착' : key === 'spa' ? '공간적 점유' : '사회적 교류'}</span>
                          {/* Fixed: Explicitly cast unknown value to number for toFixed method */}
                          <span className="text-indigo-600">+{(val as number).toFixed(1)}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          {/* Fixed: Explicitly cast unknown value to number for arithmetic operation */}
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${((val as number) / 50) * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-500 italic mt-6 border-t border-slate-100 pt-4">
                  " {result.summary} "
                </p>
              </div>
            </div>

            <RPIVisualization data={result} />
          </div>
        )}

        {/* History Explorer */}
        {history.length > 0 && (
          <div className="pt-10 border-t border-slate-200">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-2">Research Repository</h3>
            <div className="flex gap-4 overflow-x-auto pb-6 px-2 no-scrollbar">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {setResult(item.result); setInputText(item.text); window.scrollTo({top: 400, behavior: 'smooth'});}}
                  className="flex-shrink-0 w-72 bg-white p-6 rounded-[2rem] border border-slate-200 text-left hover:border-indigo-400 transition-all group"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-bold rounded-lg text-slate-500">ID: {item.id}</span>
                    <span className="text-indigo-600 font-black text-lg group-hover:scale-110 transition-transform">{item.result.rpiScore}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-700 line-clamp-3 mb-4 leading-relaxed opacity-70 italic">"{item.text}"</p>
                  <div className="flex gap-1">
                    <div className="h-1 flex-1 bg-indigo-500" style={{ opacity: item.result.weights.alpha }}></div>
                    <div className="h-1 flex-1 bg-emerald-500" style={{ opacity: item.result.weights.beta }}></div>
                    <div className="h-1 flex-1 bg-amber-500" style={{ opacity: item.result.weights.gamma }}></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <footer className="mt-20 border-t border-slate-200 py-12 bg-white flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4 opacity-30 grayscale">
          <div className="w-6 h-6 bg-slate-800 rounded"></div>
          <span className="font-black text-sm tracking-tighter">GeoAI Lab Research Unit</span>
        </div>
        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.4em]">Transformer-based RPI Modeling System</p>
      </footer>
    </div>
  );
};

export default App;