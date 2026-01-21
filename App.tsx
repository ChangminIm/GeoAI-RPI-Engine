
import React, { useState, useEffect, useRef } from 'react';
import { analyzeRelationshipContext } from './services/gemini';
import { AnalysisResult, HistoryItem } from './types';
import RPIVisualization from './components/RPIVisualization';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && resultRef.current) {
      const offset = resultRef.current.offsetTop - 100;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }, [result]);

  const handleAnalyze = async () => {
    if (!inputText.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    setError(null);
    setResult(null); 
    
    try {
      const analysisResult = await analyzeRelationshipContext(inputText);
      setResult(analysisResult);
      
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substr(2, 5).toUpperCase(),
        timestamp: Date.now(),
        text: inputText,
        result: analysisResult
      };
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 7)]);
    } catch (err: any) {
      setError(err.message || '분석 과정에서 문제가 발생했습니다.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!resultRef.current || isDownloading) return;
    setIsDownloading(true);
    
    try {
      const element = resultRef.current;
      
      // 캡처 최적화 설정
      const canvas = await html2canvas(element, {
        scale: 1.5, // 용량과 품질의 균형 (기존 2.0에서 하향)
        useCORS: true,
        backgroundColor: '#f8fafc',
        logging: false,
        height: element.scrollHeight, // 전체 높이 캡처
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc) => {
          // 캡처용 클론에서 다운로드 버튼 숨기기
          const btn = clonedDoc.querySelector('.pdf-ignore');
          if (btn) (btn as HTMLElement).style.display = 'none';
        }
      });

      // JPEG 압축 적용 (0.75 품질로 용량 최소화)
      const imgData = canvas.toDataURL('image/jpeg', 0.75);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // 첫 페이지 추가
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      // 내용이 길 경우 다음 페이지 자동 생성
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }
      
      pdf.save(`RPI_Report_${new Date().getTime()}.pdf`);
    } catch (err) {
      console.error('PDF creation failed:', err);
      alert('PDF 리포트 생성 중 오류가 발생했습니다.');
    } finally {
      setIsDownloading(false);
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

  const getScoreInfo = (score: number) => {
    if (score >= 85) return { label: 'Settlement: 생활 인구화', desc: '지역과 심리적, 공간적으로 완전히 동화된 정주 인구 수준의 유대를 보입니다.', color: 'emerald' };
    if (score >= 60) return { label: 'Bonding: 유대 강화 단계', desc: '주기적인 방문과 사회적 교류를 통해 지역의 주요 관계자로 자리 잡았습니다.', color: 'indigo' };
    if (score >= 35) return { label: 'Formation: 관계 형성 단계', desc: '지역에 대한 호감을 바탕으로 고유의 활동 범위를 넓혀가는 탐색기입니다.', color: 'amber' };
    return { label: 'Entry: 초기 진입 단계', desc: '단순 방문자 이상의 관심을 갖기 시작한 초기 인지 단계입니다.', color: 'rose' };
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
                 <div className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100">분석 콘솔 (Analysis Console)</div>
                 <div className="h-[1px] w-24 bg-slate-100"></div>
                 <span className="text-xs font-bold text-slate-400 italic">Gemini 3 Pro + Attention Framework</span>
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
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Methodology</span>
                      <span className="text-sm font-bold text-slate-800">Self-Attention</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Processing</span>
                      <span className="text-sm font-bold text-slate-800">Context Mining</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Evaluation</span>
                      <span className="text-sm font-bold text-slate-800">XAI Metric</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Standard</span>
                      <span className="text-sm font-bold text-slate-800">RPI Standard v2</span>
                   </div>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !inputText.trim()}
                  className={`group relative flex items-center gap-6 px-16 py-8 rounded-[2.5rem] font-black text-2xl transition-all overflow-hidden ${
                    isAnalyzing || !inputText.trim()
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
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
            <button onClick={() => setError(null)} className="ml-auto text-rose-400 hover:text-rose-600 text-sm font-bold underline">닫기</button>
          </div>
        )}

        <div ref={resultRef} className="rounded-[4rem] overflow-hidden">
          {result && (
            <div className="space-y-20 p-8 bg-slate-50">
              <div className="flex justify-between items-center mb-4 pdf-ignore">
                 <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic opacity-20">Analysis Report Generated by GeoAI</h3>
                 <button 
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-2xl font-black text-sm text-slate-600 hover:bg-slate-50 transition-all shadow-lg shadow-slate-200/50 active:scale-95"
                 >
                   {isDownloading ? (
                     <span className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                   ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                   )}
                   {isDownloading ? '생성 중...' : 'PDF 리포트 다운로드'}
                 </button>
              </div>

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
                        result.rpiScore >= 85 ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' : 
                        result.rpiScore >= 60 ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400' : 
                        result.rpiScore >= 35 ? 'border-amber-500/40 bg-amber-500/10 text-amber-400' :
                        'border-rose-500/40 bg-rose-500/10 text-rose-400'
                      }`}>
                        {getScoreInfo(result.rpiScore).label}
                      </div>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-white p-14 rounded-[4.5rem] shadow-3xl border border-slate-100 flex flex-col gap-10">
                  <div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-8 flex items-center gap-4">
                      <span className="w-1.5 h-8 bg-indigo-600 rounded-full"></span>
                      지표별 관계 스펙트럼
                    </h3>
                    
                    {/* 레전드 섹션 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                      {[
                        { range: '85 - 100', color: 'bg-emerald-500', label: 'Settlement', desc: '정주 및 완벽 동화' },
                        { range: '60 - 84', color: 'bg-indigo-500', label: 'Bonding', desc: '강력한 정서적 유대' },
                        { range: '35 - 59', color: 'bg-amber-500', label: 'Formation', desc: '관계 형성 및 탐색기' },
                        { range: '0 - 34', color: 'bg-rose-500', label: 'Entry', desc: '초기 인지 및 진입' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100">
                          <div className={`w-3 h-10 rounded-full ${item.color} shrink-0`}></div>
                          <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.range}</div>
                            <div className="text-sm font-black text-slate-800 leading-tight">{item.label}: {item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>

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
                            <div className="flex justify-between items-end mb-4 px-1">
                              <span className="text-base font-black text-slate-800">{item.label}</span>
                              <span className={`text-lg font-black ${val >= 0 ? 'text-indigo-600' : 'text-rose-500'}`}>
                                {val >= 0 ? '+' : ''}{val.toFixed(2)}
                              </span>
                            </div>
                            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-${item.color}-500 transition-all duration-[2s] ease-out`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-100 flex gap-6 items-start">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0 text-indigo-500 border border-indigo-100">
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1z" /></svg>
                    </div>
                    <p className="text-lg font-bold text-slate-600 leading-relaxed italic">
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
          <div className="pt-24 border-t border-slate-200 pdf-ignore">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.5em] mb-12">Data Archive</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-2">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadFromHistory(item)}
                  className={`bg-white p-10 rounded-[3rem] border text-left hover:shadow-3xl transition-all group ${
                    result?.rpiScore === item.result.rpiScore ? 'border-indigo-500 shadow-xl' : 'border-slate-200'
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
