
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
      setError('분석 중 오류가 발생했습니다. 입력 내용이 너무 짧거나 서버 응답에 문제가 있을 수 있습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-white/80 border-b border-slate-200 sticky top-0 z-50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-slate-900 rounded-[1.25rem] flex items-center justify-center shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 group-hover:scale-110 transition-transform duration-500 opacity-90"></div>
              <svg className="w-7 h-7 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-slate-900 leading-none mb-1">GeoAI <span className="text-indigo-600">관계인구 엔진</span></h1>
              <div className="flex items-center gap-2">
                 <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">Context-Aware Modeling</span>
                 <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                 <span className="text-[9px] text-indigo-500 font-black uppercase tracking-[0.2em]">Attention Analytics</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-8">
            <nav className="flex gap-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <span className="text-indigo-600 cursor-default">연구방법론</span>
              <span className="text-slate-400 cursor-default">데이터명세</span>
              <span className="text-slate-400 cursor-default">AI엔진</span>
            </nav>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="text-right">
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Engine Status</div>
              <div className="text-xs font-black text-emerald-500 flex items-center gap-1.5 justify-end">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                CORE ACTIVE
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-16 space-y-16">
        <section className="relative">
          <div className="max-w-3xl mb-12">
             <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
               데이터 맥락 학습을 통한 <br/> 
               <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent underline decoration-indigo-200/50 underline-offset-8">관계인구 지수</span> 정밀 분석
             </h2>
             <p className="text-lg text-slate-500 font-medium leading-relaxed">
               한 달 살기 수기 및 소셜 데이터를 기반으로 3대 지표인 <span className="text-indigo-600 font-bold">정서적 애착, 공간적 점유, 사회적 교류</span>와 <br/> 
               각 지표별 중요도를 분석하여 지역과의 실제적인 유대 관계를 측정합니다.
             </p>
          </div>

          <div className="bg-white p-10 rounded-[3.5rem] shadow-3xl shadow-slate-200/60 border border-slate-100 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                 <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 shadow-sm">데이터 마이닝 세션</div>
                 <div className="h-[1px] w-20 bg-slate-100"></div>
                 <span className="text-xs font-bold text-slate-400">Hybrid Transformer Model v3.5</span>
              </div>
              
              <textarea
                className="w-full h-64 p-10 bg-slate-50/50 border border-slate-200 rounded-[2.5rem] focus:ring-[12px] focus:ring-indigo-500/5 focus:border-indigo-400 outline-none transition-all text-slate-800 leading-relaxed text-xl placeholder:text-slate-300 shadow-inner"
                placeholder="지역 살기 수기, 방문 리뷰, 블로그 텍스트 등을 입력하십시오..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              
              <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Architecture</span>
                      <span className="text-sm font-bold text-slate-800">Self-Attention</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Engine</span>
                      <span className="text-sm font-bold text-slate-800">Gemini 3 Pro</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Indicators</span>
                      <span className="text-sm font-bold text-slate-800">3 Core Factors</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Weights</span>
                      <span className="text-sm font-bold text-slate-800">Dynamic Scaling</span>
                   </div>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !inputText.trim()}
                  className={`group relative flex items-center gap-5 px-16 py-7 rounded-[2.25rem] font-black text-2xl transition-all overflow-hidden ${
                    isAnalyzing || !inputText.trim()
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-slate-900 text-white hover:bg-black hover:scale-[1.02] active:scale-95 shadow-3xl shadow-indigo-200'
                  }`}
                >
                  <span className="relative z-10">{isAnalyzing ? "알고리즘 연산 중..." : "RPI 분석 실행"}</span>
                  {!isAnalyzing && (
                    <div className="relative z-10 w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center group-hover:rotate-[15deg] transition-transform duration-500">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="bg-rose-50 border border-rose-100 p-8 rounded-[3rem] text-rose-700 font-black flex items-center gap-6 animate-in fade-in zoom-in">
            <div className="w-14 h-14 bg-rose-500 text-white rounded-[1.25rem] flex items-center justify-center text-2xl shadow-xl shadow-rose-200 shrink-0">!</div>
            <div className="flex flex-col">
               <span className="text-xs uppercase tracking-widest text-rose-400 mb-1">알림</span>
               <span className="text-lg">{error}</span>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5 bg-slate-950 p-12 rounded-[4rem] text-white shadow-3xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
                 <div className="relative z-10 w-full">
                    <div className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-300/50 mb-10">최종 관계인구 지수</div>
                    <div className="relative inline-block mb-10">
                       <div className="text-[12rem] font-black leading-none tracking-tighter text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                         {result.rpiScore}
                       </div>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className={`px-8 py-4 rounded-3xl border-2 font-black text-lg tracking-tight mb-4 ${
                         result.rpiScore >= 80 ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 
                         result.rpiScore >= 50 ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400' : 
                         'border-rose-500/30 bg-rose-500/10 text-rose-400'
                       }`}>
                         {result.rpiScore >= 80 ? '안정 정착 단계' : 
                          result.rpiScore >= 50 ? '잠재적 관계 확장' : '초기 진입 단계'}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-7 bg-white p-12 rounded-[4rem] shadow-3xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between group">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-8">핵심 지표별 관계 형성 기여도</h3>
                  <div className="space-y-10">
                    {[
                      { key: 'emo', label: '정서적 애착', color: 'indigo' },
                      { key: 'spa', label: '공간적 점유', color: 'emerald' },
                      { key: 'soc', label: '사회적 교류', color: 'amber' }
                    ].map((item) => {
                      const val = (result.shapValue[item.key] as number) || 0;
                      const percentage = Math.min(Math.abs(val) * 2, 100);
                      return (
                        <div key={item.key}>
                          <div className="flex justify-between items-end mb-3">
                            <span className="text-sm font-black text-slate-800">{item.label}</span>
                            <span className={`text-sm font-black ${val >= 0 ? 'text-indigo-600' : 'text-rose-500'}`}>
                              {val >= 0 ? '+' : ''}{val.toFixed(2)}
                            </span>
                          </div>
                          <div className="w-full h-5 bg-slate-50 rounded-full overflow-hidden p-1.5 border border-slate-100">
                            <div 
                              className={`h-full bg-${item.color}-500 rounded-full transition-all duration-[1.5s] ease-out shadow-sm`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-12 pt-10 border-t border-slate-100 relative">
                   <div className="flex gap-5 items-start">
                      <div className="w-12 h-12 bg-indigo-50 rounded-[1.25rem] flex items-center justify-center shrink-0 text-indigo-500 shadow-sm border border-indigo-100">
                         <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1z" /></svg>
                      </div>
                      <p className="text-base font-bold text-slate-500 leading-relaxed italic">
                        "{result.summary}"
                      </p>
                   </div>
                </div>
              </div>
            </div>

            <RPIVisualization data={result} />
          </div>
        )}

        {history.length > 0 && (
          <div className="pt-24 border-t border-slate-200">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-12 px-2">데이터 저장소</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {setResult(item.result); setInputText(item.text); window.scrollTo({top: 600, behavior: 'smooth'});}}
                  className="bg-white p-8 rounded-[3rem] border border-slate-200 text-left hover:border-indigo-400 hover:shadow-2xl transition-all group"
                >
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-black text-indigo-600">세션 #{item.id}</span>
                    <span className="text-4xl font-black text-slate-900 group-hover:text-indigo-600">
                      {item.result.rpiScore}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-500 line-clamp-2 mb-8 italic">"{item.text}"</p>
                  <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-slate-50">
                    <div className="bg-indigo-500" style={{ width: `${item.result.weights.alpha * 100}%` }}></div>
                    <div className="bg-emerald-500" style={{ width: `${item.result.weights.beta * 100}%` }}></div>
                    <div className="bg-amber-500" style={{ width: `${item.result.weights.gamma * 100}%` }}></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <footer className="mt-40 border-t border-slate-200 py-24 bg-white text-center">
        <div className="max-w-7xl mx-auto px-6">
          <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase">GeoAI Research Laboratory</span>
          <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.2em] mt-4">
            Transformer-based Relationship Population Index Engine v3.5
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
