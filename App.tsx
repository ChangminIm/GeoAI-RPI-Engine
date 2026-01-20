
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
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-white/80 border-b border-slate-200 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-200 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 group-hover:scale-110 transition-transform duration-500"></div>
              <svg className="w-6 h-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-slate-900">GeoAI <span className="text-indigo-600">RPI Engine</span></h1>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Relational Population Index Analyzer</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="text-right">
              <div className="text-[10px] font-black text-slate-400 uppercase">System Status</div>
              <div className="text-xs font-bold text-emerald-500 flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Attention Model Active
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-12 space-y-12">
        {/* Input Section */}
        <section className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none rotate-12">
            <span className="text-[15rem] font-black leading-none">RPI</span>
          </div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">하이브리드 데이터 마이닝</h2>
                {/* Fixed: Escaped curly braces in text to prevent JSX expression parsing errors */}
                <p className="text-slate-500 font-medium max-w-xl">한 달 살기 수기, SNS 데이터로부터 정서적 애착($X_{'{'}emo{'}'}$), 공간 점유($X_{'{'}spa{'}'}$), 사회적 교류($X_{'{'}soc{'}'}$) 지표를 추출합니다.</p>
              </div>
              <div className="flex gap-2">
                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black border border-indigo-100 uppercase tracking-wider">Transformer-based</span>
              </div>
            </div>
            
            <textarea
              className="w-full h-56 p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-400 outline-none transition-all text-slate-800 leading-relaxed text-lg placeholder:text-slate-300 shadow-inner"
              placeholder="분석할 연구 데이터를 입력하세요. (수기 기행문, SNS 포스트 등)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            
            <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6 text-slate-400">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest mb-1">Target Model</span>
                  <span className="text-sm font-bold text-slate-600">Gemini 3 Pro</span>
                </div>
                <div className="w-[1px] h-8 bg-slate-200"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest mb-1">Architecture</span>
                  <span className="text-sm font-bold text-slate-600">Self-Attention</span>
                </div>
              </div>
              
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !inputText.trim()}
                className={`group relative flex items-center gap-4 px-14 py-6 rounded-[2rem] font-black text-xl transition-all overflow-hidden ${
                  isAnalyzing || !inputText.trim()
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-black hover:scale-[1.03] active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.2)]'
                }`}
              >
                <span className="relative z-10">{isAnalyzing ? "RPI 알고리즘 연산 중..." : "RPI 분석 실행"}</span>
                {!isAnalyzing && (
                  <div className="relative z-10 w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] text-rose-700 font-black flex items-center gap-4 animate-in fade-in zoom-in">
            <div className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center text-xl shadow-lg shadow-rose-200">!</div>
            {error}
          </div>
        )}

        {/* Dashboard Results */}
        {result && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            {/* Summary & Contribution Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-3xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-transparent"></div>
                <div className="relative z-10">
                  <div className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-300/60 mb-6">Relational Population Index</div>
                  <div className="text-[9rem] font-black leading-none tracking-tighter mb-4 text-white drop-shadow-2xl">
                    {result.rpiScore}
                  </div>
                  <div className="h-1.5 w-24 bg-indigo-500 rounded-full mx-auto mb-8 shadow-[0_0_20px_rgba(99,102,241,0.5)]"></div>
                  <div className="px-6 py-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                    <span className="text-sm font-black text-indigo-300">
                      {result.rpiScore >= 80 ? 'CRITICAL POINT 상회: 안정 정착군' : 
                       result.rpiScore >= 50 ? 'POTENTIAL: 관계 확장 유망군' : 'EARLY STAGE: 초기 진입/이탈 위험'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 bg-white p-10 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">XAI: SHAP 기여도 역산 분석</h3>
                    <div className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-200 text-[10px] font-black text-slate-400">VALIDATION MODE</div>
                  </div>
                  <div className="space-y-8">
                    {[
                      { key: 'emo', label: '정서적 애착', sub: 'X_emo', color: 'bg-indigo-500' },
                      { key: 'spa', label: '공간적 점유', sub: 'X_spa', color: 'bg-emerald-500' },
                      { key: 'soc', label: '사회적 교류', sub: 'X_soc', color: 'bg-amber-500' }
                    ].map((item) => {
                      const val = (result.shapValue[item.key] as number) || 0;
                      return (
                        <div key={item.key}>
                          <div className="flex justify-between items-end mb-3">
                            <div>
                              <span className="text-sm font-black text-slate-800 mr-2">{item.label}</span>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.sub}</span>
                            </div>
                            <span className={`text-sm font-black ${val >= 0 ? 'text-indigo-600' : 'text-rose-500'}`}>
                              {val >= 0 ? '+' : ''}{val.toFixed(2)}
                            </span>
                          </div>
                          <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden p-1 border border-slate-100 shadow-inner">
                            <div 
                              className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                              style={{ width: `${Math.min(Math.abs(val) * 2, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-10 pt-8 border-t border-slate-100">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0 text-indigo-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" /></svg>
                    </div>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                      "{result.summary}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <RPIVisualization data={result} />
          </div>
        )}

        {/* History / Research Repository */}
        {history.length > 0 && (
          <div className="pt-20 border-t border-slate-200">
            <div className="flex justify-between items-center mb-10 px-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Research Repository</h3>
              <div className="h-[1px] flex-grow mx-8 bg-slate-200/60"></div>
              <span className="text-xs font-bold text-slate-400">{history.length} Analysis Stored</span>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-10 px-2 no-scrollbar snap-x">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {setResult(item.result); setInputText(item.text); window.scrollTo({top: 500, behavior: 'smooth'});}}
                  className="flex-shrink-0 w-80 bg-white p-8 rounded-[2.5rem] border border-slate-200 text-left hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-100 transition-all group snap-start"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-400 uppercase mb-1">Session ID</span>
                      <span className="text-[11px] font-black text-indigo-500">#{item.id}</span>
                    </div>
                    <div className="text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {item.result.rpiScore}
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-500 line-clamp-3 mb-6 leading-relaxed">
                    {item.text}
                  </p>
                  <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-slate-100">
                    <div className="bg-indigo-500" style={{ width: `${item.result.weights.alpha * 100}%` }}></div>
                    <div className="bg-emerald-500" style={{ width: `${item.result.weights.beta * 100}%` }}></div>
                    <div className="bg-amber-500" style={{ width: `${item.result.weights.gamma * 100}%` }}></div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-[9px] font-bold text-slate-400">{new Date(item.timestamp).toLocaleTimeString()}</span>
                    <span className="text-[9px] font-black text-indigo-400 uppercase">View Details →</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <footer className="mt-32 border-t border-slate-200 py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-8 opacity-20 hover:opacity-100 transition-opacity duration-700 cursor-default">
            <div className="w-8 h-8 bg-slate-900 rounded-lg"></div>
            <span className="font-black text-xl tracking-tighter text-slate-900 uppercase">GeoAI Lab Research</span>
          </div>
          <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.5em] mb-4">Transformer-based RPI Modeling System v2.1</p>
          <p className="text-[9px] text-slate-400 font-medium">© 2024 Research Methodology Optimization Framework. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
