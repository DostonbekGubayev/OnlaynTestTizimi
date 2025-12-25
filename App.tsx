
import React, { useState } from 'react';
import { QuizConfig, Question, QuizResult, User } from './types';
import { generateQuizQuestions } from './geminiService';
import { apiService } from './apiService';
import Setup from './components/Setup';
import Quiz from './components/Quiz';
import Result from './components/Result';
import Layout from './components/Layout';
import History from './components/History';
import Login from './components/Login';

const App: React.FC = () => {
  const [view, setView] = useState<'setup' | 'quiz' | 'result' | 'loading' | 'history' | 'login'>('setup');
  const [user, setUser] = useState<User | null>(apiService.getCurrentUser());
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartQuiz = async (quizConfig: QuizConfig) => {
    if (!user) {
      setError("Testni boshlash uchun avval tizimga kiring!");
      setView('login');
      return;
    }
    
    setConfig(quizConfig);
    setView('loading');
    setError(null);
    
    try {
      const generatedQuestions = await generateQuizQuestions(quizConfig);
      if (!generatedQuestions || generatedQuestions.length === 0) {
        throw new Error("Savollar generatsiya qilinmadi.");
      }
      setQuestions(generatedQuestions);
      setView('quiz');
    } catch (err: any) {
      setError(err.message || "Savollarni yuklashda kutilmagan xatolik.");
      setView('setup');
    }
  };

  const handleQuizComplete = (result: QuizResult) => {
    const finalResult = { ...result, userName: user?.fullName, userId: user?.id };
    setLastResult(finalResult);
    setView('result');
    apiService.saveResult(finalResult).catch(err => console.error("History saving error:", err));
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setView('setup');
  };

  const handleLogout = () => {
    apiService.logout();
    setUser(null);
    setView('setup');
  };

  return (
    <Layout user={user} setView={setView} onLogout={handleLogout}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between animate-bounce z-50 relative">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i>
              <span className="font-medium">{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-900 font-bold p-2">&times;</button>
          </div>
        )}

        {view === 'login' && <Login onLogin={handleLogin} />}
        
        {view === 'setup' && (
          <div className="relative">
            {!user && (
              <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm rounded-3xl flex items-center justify-center border-2 border-dashed border-indigo-200">
                <div className="text-center p-8 bg-white shadow-2xl rounded-2xl max-w-sm">
                  <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Tizimga kiring</h3>
                  <p className="text-slate-500 mb-6 text-sm">Testlarni boshlash va natijalarni saqlash uchun profilga kiring.</p>
                  <button onClick={() => setView('login')} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all">Kirish</button>
                </div>
              </div>
            )}
            <Setup onStart={handleStartQuiz} />
          </div>
        )}
        
        {view === 'loading' && (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-indigo-600 border-r-4 border-r-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-indigo-600 font-black text-xs">AI</span>
                 </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-black text-slate-800">AI savollarni tayyorlamoqda...</p>
              <p className="text-slate-400 font-medium">Bu bir necha soniya vaqt olishi mumkin.</p>
            </div>
            {config && (
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 max-w-xs mt-6">
                <p className="text-indigo-800 text-xs font-bold leading-relaxed">
                  "{config.subTopic}" mavzusi bo'yicha eng dolzarb va professional savollar generatsiya qilinmoqda.
                </p>
              </div>
            )}
          </div>
        )}

        {view === 'quiz' && config && (
          <Quiz 
            questions={questions} 
            category={config.category}
            topic={config.topic}
            subTopic={config.subTopic}
            onComplete={handleQuizComplete} 
          />
        )}

        {view === 'result' && lastResult && (
          <Result 
            result={lastResult} 
            onRestart={() => setView('setup')} 
          />
        )}

        {view === 'history' && (
          <History onBack={() => setView('setup')} />
        )}
      </div>
    </Layout>
  );
};

export default App;
