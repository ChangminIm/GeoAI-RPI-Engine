
import React, { useState, useEffect, useRef } from 'react';
import { analyzeRelationshipContext } from './services/gemini';
import { AnalysisResult, HistoryItem } from './types';
import RPIVisualization from './components/RPIVisualization';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // 결과가 업데이트될 때 결과 섹션으로 부드럽게 스크롤
  useEffect(() => {
    if (result && resultRef.current) {
      const offset = resultRef.current.offsetTop - 100;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }, [result]);

  const handleAnalyze = async () => {
    if (!inputText.trim() || isAnalyzing) return;
    
    // 1. 상태 전면 초기화 (두 번째 분석 시 충돌 방지)
    setIsAnalyzing(true);
    setError(null);
    setResult(null); 
    
    try {
      // 2. API 호출
      const analysisResult = await analyzeRelationshipContext(inputText);
      
      // 3. 결과 반영
      setResult(analysisResult);
      
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substr(2, 5).toUpperCase(),
        timestamp: Date.now(),
        text: inputText,
        result: analysisResult
      };
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 7)]);
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError(err.message || '분석 과정에서 기술적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      // 에러 시 스크롤을 위로 올려 사용자가 에러를 확인하게 함
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setResult(null);
    setError(null);
    setTimeout(() => {
      setResult(item.result);
      setInputText(item.text);
    }, 50);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 pb-32">
      <header className="bg-white/80 border-b border-slate-200 sticky top-0 z-50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-indigo-200 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-700 to-cyan-500 opacity-90 group-hover:scale-110 transition-transform duration-500"></div>
              <svg className="w-7 h-7 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-slate-900 leading-none mb-1">GeoAI <span className="text-indigo-600">관계인구 엔진</span></h1>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Contextual Intelligence Framework</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-8">
            <div className="text-right">
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Engine Status</div>
              <div className="text-xs font-black text-emerald-500 flex items-center gap-1.5 justify-end">
                <span className={`w-1.5 h-1.5 rounded-full ${isAnalyzing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></span>
                {isAnalyzing ? '연산 처리 중' : '분석 대기 중'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-16 space-y-16">
        <section className="relative">
          <div className="max-w-3xl mb-12">
             <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
               텍스트 맥락 학습 기반 <br/> 
               <span className="bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">관계인구 지수</span> 정밀 모델링
             </h2>
             <p className="text-xl text-slate-500 font-medium leading-relaxed">
               단순 방문 기록을 넘어선 심리적 정주 유대감을 측정합니다. <br/>
               개인의 수기 데이터에서 <span className="text-indigo-600 font-bold underline decoration-indigo-200 underline-offset-8">정서, 공간, 사회적</span> 맥락을 정밀하게 추출합니다.
             </p>
          </div>

          <div className="bg-white p-10 rounded-[3.5rem] shadow-3xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                 <div className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100">분석 콘솔 (Analysis)</div>
                 <div className="h-[1px] w-24 bg-slate-100"></div>
                 <span className="text-xs font-bold text-slate-400 italic">Gemini 3 Pro + Attention Analytics</span>
              </div>
              
              <textarea
                className="w-full h-72 p-10 bg-slate-50 border border-slate-200 rounded-[2.5rem] focus:ring-[16px] focus:ring-indigo-500/5 focus:border-indigo-400 outline-none transition-all text-slate-800 leading-relaxed text-xl placeholder:text-slate-300 shadow-inner resize-none"
                placeholder="지역 살기 수기, 방문 리뷰, 블로그 텍스트 등을 입력하십시오..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isAnalyzing}
              />
              
              <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Architecture</span>
                      <span className="text-sm font-bold text-slate-800">Self-Attention</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">AI Engine</span>
                      <span className="text-sm font-bold text-slate-800">Gemini 3 Pro</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Explainability</span>
                      <span className="text-sm font-bold text-slate-800">XAI Framework</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Metric Scale</span>
                      <span className="text-sm font-bold text-slate-800">0 - 100 Index</span>
                   </div>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !inputText.trim()}
                  className={`group relative flex items-center gap-6 px-16 py-8 rounded-[2.5rem] font-black text-2xl transition-all overflow-hidden ${
                    isAnalyzing || !inputText.trim()
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-slate-900 text-white hover:bg-black hover:scale-[1.02] active:scale-95 shadow-2xl shadow-indigo-200'
                  }`}
                >
                  <span className="relative z-10">{isAnalyzing ? "지표 연산 중..." : "RPI 분석 실행"}</span>
                  {!isAnalyzing && (
                    <div className="relative z-10 w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center group-hover:rotate-[20deg] transition-transform duration-500 shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                  )}
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-indigo-600 flex items-center justify-center">
                      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="bg-rose-50 border border-rose-100 p-8 rounded-[3rem] text-rose-700 font-black flex items-center gap-8 animate-in fade-in zoom-in">
            <div className="w-16 h-16 bg-rose-500 text-white rounded-[1.5rem] flex items-center justify-center text-3xl shadow-2xl shrink-0">!</div>
            <div className="flex flex-col">
               <span className="text-xs uppercase tracking-widest text-rose-400 mb-1">System Message</span>
               <span className="text-lg">{error}</span>
            </div>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-rose-400 hover:text-rose-600 text-sm font-bold underline"
            >
              닫기
            </button>
          </div>
        )}

        <div ref={resultRef}>
          {result && (
            <div className="space-y-20 animate-in fade-in slide-in-from-bottom-12 duration-1000">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-5 bg-slate-950 p-16 rounded-[4.5rem] text-white shadow-3xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-cyan-500/10 opacity-60"></div>
                  <div className="relative z-10 w-full">
                      <div className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-300/60 mb-10">관계인구 종합 지수</div>
                      <div className="relative inline-block mb-10">
                        <div className="text-[14rem] font-black leading-none tracking-tighter text-white drop-shadow-[0_0_60px_rgba(255,255,255,0.2)]">
                          {result.rpiScore}
                        </div>
                      </div>
                      <div className={`px-10 py-5 rounded-[2rem] border-2 font-black text-xl tracking-tight mb-6 shadow-2xl ${
                        result.rpiScore >= 80 ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' : 
                        result.rpiScore >= 50 ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400' : 
                        'border-rose-500/40 bg-rose-500/10 text-rose-400'
                      }`}>
                        {result.rpiScore >= 80 ? '안정 정착 단계' : 
                        result.rpiScore >= 50 ? '유망 관계 확장 단계' : '초기 진입 단계'}
                      </div>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-white p-14 rounded-[4.5rem] shadow-3xl border border-slate-100 flex flex-col justify-between">
                  <div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-12 flex items-center gap-4">
                      <span className="w-1.5 h-8 bg-indigo-600 rounded-full"></span>
                      지표 기여도 분석
                    </h3>
                    <div className="space-y-12">
                      {[
                        { key: 'emo', label: '정서적 애착', color: 'indigo' },
                        { key: 'spa', label: '공간적 점유', color: 'emerald' },
                        { key: 'soc', label: '사회적 교류', color: 'amber' }
                      ].map((item) => {
                        const val = (result.shapValue[item.key] as number) || 0;
                        const percentage = Math.min(Math.abs(val) * 2, 100);
                        return (
                          <div key={item.key}>
                            <div className="flex justify-between items-end mb-4 px-1">
                              <span className="text-base font-black text-slate-800">{item.label}</span>
                              <span className={`text-lg font-black ${val >= 0 ? 'text-indigo-600' : 'text-rose-500'}`}>
                                {val >= 0 ? '+' : ''}{val.toFixed(2)}
                              </span>
                            </div>
                            <div className="w-full h-6 bg-slate-50 rounded-full overflow-hidden p-1.5 border border-slate-100 shadow-inner">
                              <div 
                                className={`h-full bg-${item.color}-500 rounded-full transition-all duration-[2s] ease-out`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-14 pt-12 border-t border-slate-100 flex gap-6 items-start">
                    <div className="w-16 h-16 bg-indigo-50 rounded-[1.75rem] flex items-center justify-center shrink-0 text-indigo-500 shadow-sm border border-indigo-100">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1z" /></svg>
                    </div>
                    <p className="text-lg font-bold text-slate-500 leading-relaxed italic">
                      "{result.summary}"
                    </p>
                  </div>
                </div>
              </div>

              <RPIVisualization data={result} />
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="pt-24 border-t border-slate-200">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.5em] mb-12">Data Archive</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-2">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadFromHistory(item)}
                  className={`bg-white p-10 rounded-[3rem] border text-left hover:shadow-3xl transition-all group ${
                    result?.id === item.id ? 'border-indigo-500 shadow-xl' : 'border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-xs font-black text-indigo-600">ID: #{item.id}</span>
                    <span className="text-5xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {item.result.rpiScore}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-500 line-clamp-2 mb-10 italic">"{item.text}"</p>
                  <div className="flex gap-2 h-2 rounded-full overflow-hidden bg-slate-50 border border-slate-100">
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
      
      <footer className="mt-48 border-t border-slate-200 py-24 bg-white text-center">
        <div className="max-w-7xl mx-auto px-6">
          <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase">GeoAI Research Core</span>
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em] mt-6">
            Optimized for Vercel Deployment & XAI Framework v3.5
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
