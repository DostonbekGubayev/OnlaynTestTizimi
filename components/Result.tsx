
import React, { useEffect, useState, useMemo } from 'react';
import { QuizResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { analyzePerformance } from '../geminiService';
import { GoogleGenAI } from "@google/genai";

interface ResultProps {
  result: QuizResult;
  onRestart: () => void;
}

const Result: React.FC<ResultProps> = ({ result, onRestart }) => {
  const [analysis, setAnalysis] = useState<string>('AI tahlil tayyorlanmoqda...');
  const [showCert, setShowCert] = useState(false);
  const [certMessage, setCertMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const certId = useMemo(() => {
    return `DA-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }, []);

  useEffect(() => {
    analyzePerformance(result)
      .then(setAnalysis)
      .catch(() => setAnalysis("Natijalar muvaffaqiyatli tahlil qilindi."));
  }, [result]);

  const toggleCertificate = async () => {
    setShowCert(true);
    if (!certMessage) {
      setIsGenerating(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Dostonbek Academy sertifikati uchun juda qisqa (maksimal 150 ta belgi) tantanali tabrik yozing. 
        O'quvchi: ${result.userName}. Fan: ${result.category}. Natija: ${result.score}/${result.totalQuestions}. 
        Faqat tabrik matnini qaytaring.`;
        
        const response = await ai.models.generateContent({ 
          model: 'gemini-3-flash-preview', 
          contents: prompt 
        });
        setCertMessage(response.text?.trim() || "Muvaffaqiyatli yakunladingiz!");
      } catch (e) {
        setCertMessage("Bilim yo'lidagi muvaffaqiyatlaringiz bardavom bo'lsin!");
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleDownloadPdf = () => {
    const element = document.getElementById('cert-print-area');
    if (!element) return;

    setIsDownloading(true);
    const options = {
      margin: 0,
      filename: `Sertifikat_${result.userName}_${result.category}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { scale: 3, useCORS: true, logging: false, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    // @ts-ignore
    html2pdf().set(options).from(element).save().then(() => {
      setIsDownloading(false);
    });
  };

  const percentage = Math.round((result.score / result.totalQuestions) * 100);

  return (
    <div className="space-y-8 animate-in pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-3xl shadow-xl p-8 border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Natija</h2>
            <div className={`px-5 py-1.5 rounded-full text-xs font-black ${percentage >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
              {percentage}%
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 text-center">
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">To'g'ri</p>
              <p className="text-xl font-black text-emerald-800">{result.score}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
              <p className="text-[10px] font-black text-red-600 uppercase mb-1">Jami</p>
              <p className="text-xl font-black text-red-800">{result.totalQuestions}</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
              <p className="text-[10px] font-black text-indigo-900 uppercase mb-1">Vaqt</p>
              <p className="text-xl font-black text-indigo-900">{Math.floor(result.timeSpent / 60)}m</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Fan</p>
              <p className="text-[10px] font-black text-slate-600 truncate">{result.category}</p>
            </div>
          </div>

          <div className="bg-indigo-950 rounded-3xl p-6 text-white relative overflow-hidden flex-grow border border-indigo-900 shadow-lg">
            <h3 className="text-sm font-black mb-3 flex items-center opacity-70">
              <i className="fas fa-magic mr-2"></i> AI TAHLILI
            </h3>
            <div className="text-sm italic leading-relaxed whitespace-pre-wrap max-h-[200px] overflow-y-auto custom-scrollbar">
              {analysis}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 flex flex-col items-center justify-center min-h-[300px]">
          <div className="relative w-full aspect-square max-w-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={[
                    { name: "To'g'ri", value: result.score },
                    { name: "Xato", value: result.totalQuestions - result.score }
                  ]} 
                  cx="50%" cy="50%" innerRadius="70%" outerRadius="95%" paddingAngle={5} dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f1f5f9" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-black text-indigo-950">{percentage}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 no-print">
        <button onClick={onRestart} className="bg-white text-indigo-950 border-2 border-indigo-950 py-5 rounded-2xl font-black hover:bg-slate-50 shadow-md transition-all active:scale-95 uppercase text-sm">YANGI TEST</button>
        <button onClick={toggleCertificate} className="bg-emerald-600 text-white py-5 rounded-2xl font-black hover:bg-emerald-700 shadow-xl flex items-center justify-center space-x-2 transition-all active:scale-95 uppercase text-sm">
          <i className="fas fa-medal"></i>
          <span>SERTIFIKATNI KO'RISH</span>
        </button>
        <button onClick={() => { toggleCertificate(); setTimeout(handleDownloadPdf, 1500); }} className="bg-indigo-950 text-white py-5 rounded-2xl font-black hover:bg-indigo-900 shadow-xl flex items-center justify-center space-x-2 transition-all active:scale-95 uppercase text-sm">
          <i className="fas fa-file-pdf"></i>
          <span>PDF YUKLAB OLISH</span>
        </button>
      </div>

      {showCert && (
        <div className="fixed inset-0 z-[500] bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-5xl animate-in zoom-in-95 duration-300">
            {/* Sertifikat Konteyneri */}
            <div id="cert-print-area" className="relative bg-white border-[20px] md:border-[30px] border-indigo-950 p-8 md:p-12 text-center shadow-2xl overflow-hidden aspect-[1.414/1] w-full max-w-full flex flex-col justify-between items-center h-full min-h-[580px]">
              
              {/* Podlojka Background */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none grid grid-cols-2 gap-10 p-10 overflow-hidden">
                 {[...Array(8)].map((_, i) => (
                    <div key={i} className="text-5xl font-black text-indigo-900 -rotate-45 whitespace-nowrap uppercase">DOSTONBEK ACADEMY</div>
                 ))}
              </div>

              {/* Yuqori Qism */}
              <div className="relative z-10 flex flex-col items-center w-full">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-950 rounded-2xl flex items-center justify-center text-white text-3xl md:text-4xl font-black mb-4 shadow-xl border-4 border-white">D</div>
                <h1 className="text-4xl md:text-6xl font-black text-indigo-950 uppercase tracking-tighter mb-1">SERTIFIKAT</h1>
                <p className="text-emerald-600 font-black tracking-[0.4em] text-[8px] md:text-[10px] uppercase">Dostonbek Academy Online Test Platformasi</p>
              </div>

              {/* O'rta Qism - Ism va Tabrik */}
              <div className="relative z-10 w-full flex flex-col items-center justify-center flex-grow py-4">
                <p className="text-slate-400 font-bold uppercase text-[9px] md:text-[11px] mb-2 tracking-widest">Ushbu sertifikat faxr bilan taqdim etiladi:</p>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 border-b-2 border-slate-100 pb-2 inline-block px-10">{result.userName}</h2>
                
                <div className="h-20 md:h-24 flex items-center justify-center px-10 md:px-20 overflow-hidden">
                  <p className="text-sm md:text-xl text-slate-700 italic leading-snug font-serif max-w-3xl">
                    {isGenerating ? 'AI tabrik matni tayyorlanmoqda...' : `"${certMessage}"`}
                  </p>
                </div>
              </div>

              {/* Pastki Qism - Ma'lumotlar va Imzolar */}
              <div className="relative z-10 w-full mt-auto">
                <div className="grid grid-cols-3 gap-6 md:gap-12 w-full max-w-3xl mx-auto pt-4 border-t border-slate-100">
                  <div className="text-center">
                    <p className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase mb-1">Ko'rsatkich</p>
                    <p className="font-black text-indigo-950 text-xs md:text-lg">{percentage}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase mb-1">Fan Yo'nalishi</p>
                    <p className="font-black text-indigo-950 uppercase text-[8px] md:text-[11px] truncate max-w-[120px] mx-auto">{result.category}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase mb-1">Sana</p>
                    <p className="font-black text-indigo-950 text-xs md:text-lg">{new Date().toLocaleDateString('uz-UZ')}</p>
                  </div>
                </div>

                <div className="flex items-end justify-between px-10 md:px-20 mt-8 md:mt-12 mb-4">
                  <div className="text-center w-32 md:w-56 relative">
                    <div className="absolute left-0 -top-8 text-[7px] font-mono text-slate-300">ID: {certId}</div>
                    <div className="font-serif text-base md:text-xl text-indigo-900 mb-[-4px] italic">Dostonbek Gubayev</div>
                    <div className="w-full h-[1px] bg-slate-300 mb-1"></div>
                    <p className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Akademiya Direktori</p>
                  </div>

                  <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 md:w-28 md:h-28 border-2 md:border-8 border-double border-indigo-900/20 rounded-full flex items-center justify-center opacity-40">
                        <span className="text-[5px] md:text-[8px] font-black text-indigo-900 -rotate-12 text-center leading-none px-1 uppercase">DOSTONBEK ACADEMY</span>
                    </div>
                  </div>

                  <div className="text-center w-32 md:w-56 opacity-10 flex flex-col items-center">
                     <i className="fas fa-award text-2xl md:text-4xl text-indigo-950 mb-1"></i>
                     <p className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Tasdiqlangan Hujjat</p>
                  </div>
                </div>
              </div>

              {/* Burchak Bezaklari */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-[6px] border-l-[6px] border-indigo-900/10"></div>
              <div className="absolute top-0 right-0 w-12 h-12 border-t-[6px] border-r-[6px] border-indigo-900/10"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-[6px] border-l-[6px] border-indigo-900/10"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-[6px] border-r-[6px] border-indigo-900/10"></div>
            </div>
            
            {/* Modal Tugmalari */}
            <div className="mt-6 flex justify-between w-full no-print px-4">
              <button onClick={() => setShowCert(false)} className="bg-white/10 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors uppercase text-sm">Yopish</button>
              <button 
                onClick={handleDownloadPdf} 
                disabled={isDownloading}
                className="bg-white text-indigo-950 px-10 py-3 rounded-xl font-black shadow-2xl hover:bg-slate-100 transition-all uppercase text-sm flex items-center space-x-2 active:scale-95"
              >
                {isDownloading ? (
                  <>
                    <i className="fas fa-spinner animate-spin"></i>
                    <span>TAYYORLANMOQDA...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-file-download"></i>
                    <span>PDF YUKLAB OLISH</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;
