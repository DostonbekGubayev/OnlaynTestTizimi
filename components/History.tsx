
import React, { useEffect, useState } from 'react';
import { QuizResult } from '../types';
import { apiService } from '../apiService';

interface HistoryProps {
  onBack: () => void;
}

const History: React.FC<HistoryProps> = ({ onBack }) => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await apiService.getAllResults();
      // Score bo'yicha saralash
      const sortedData = [...data].sort((a, b) => b.score - a.score);
      setResults(sortedData);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800">Natijalar tarixi</h2>
          <p className="text-slate-500">Eng yaxshi natija ko'rsatgan o'quvchilar ro'yxati</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-bold hover:underline flex items-center space-x-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7 7-7"></path></svg>
          <span>Qaytish</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Yuklanmoqda...</div>
      ) : results.length === 0 ? (
        <div className="py-20 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">Hozircha hech qanday natija yo'q.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">O'rin</th>
                <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">O'quvchi</th>
                <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Fan</th>
                <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Natija</th>
                <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Vaqt</th>
                <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Sana</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {results.map((res, index) => (
                <tr key={index} className="group hover:bg-slate-50 transition-colors">
                  <td className="py-4 font-bold text-slate-400">{index + 1}</td>
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                        index === 1 ? 'bg-slate-200 text-slate-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-indigo-50 text-indigo-600'
                      }`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : res.userName?.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-700">{res.userName}</span>
                    </div>
                  </td>
                  <td className="py-4 text-slate-600 text-sm">{res.category}</td>
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{res.score} / {res.totalQuestions}</span>
                      <div className="w-24 h-1 bg-slate-100 rounded-full mt-1">
                        <div 
                          className={`h-full rounded-full ${res.score / res.totalQuestions >= 0.7 ? 'bg-green-500' : 'bg-indigo-500'}`} 
                          style={{ width: `${(res.score / res.totalQuestions) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-slate-500 text-sm">
                    {Math.floor(res.timeSpent / 60)}m {res.timeSpent % 60}s
                  </td>
                  <td className="py-4 text-slate-400 text-xs">
                    {new Date(res.date).toLocaleDateString('uz-UZ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;
