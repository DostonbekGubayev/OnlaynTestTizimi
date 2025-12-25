
import React, { useState, useEffect, useRef } from 'react';
import { Question, QuizResult } from '../types';

interface QuizProps {
  questions: Question[];
  category: string;
  topic?: string;
  subTopic?: string;
  onComplete: (result: QuizResult) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, category, topic, subTopic, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [timeLeft, setTimeLeft] = useState(questions.length * 45);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleForceFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleForceFinish = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    const answers = questions.map((q, idx) => ({
      questionId: q.id,
      selectedOption: selectedAnswers[idx],
      isCorrect: selectedAnswers[idx] !== -1 && selectedAnswers[idx] === q.correctAnswerIndex
    }));

    const score = answers.filter(a => a.isCorrect).length;
    const answeredCount = selectedAnswers.filter(a => a !== -1).length;

    onComplete({
      score,
      answeredCount,
      totalQuestions: questions.length,
      timeSpent: (questions.length * 45) - timeLeft,
      answers,
      date: new Date().toISOString(),
      category,
      topic,
      subTopic
    });
  };

  const question = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  if (!question) return <div className="p-10 text-center font-bold">Savollar yuklanmoqda...</div>;

  return (
    <div className="space-y-6 animate-in">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100 gap-4">
        <div className="flex items-center space-x-4 flex-grow">
          <div className="flex flex-col">
            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest leading-none mb-1">SAVOL {currentIndex + 1} / {questions.length}</span>
            <span className="text-indigo-600 font-black text-xs truncate max-w-[200px]">{subTopic}</span>
          </div>
          <div className="h-2 flex-grow max-w-md bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className={`font-mono text-xl font-black ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-slate-700'}`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
          <button 
            type="button"
            onClick={() => setShowConfirm(true)}
            className="bg-red-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black hover:bg-red-700 transition-all shadow-lg shadow-red-100 uppercase"
          >
            Yakunlash
          </button>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-slate-100 relative min-h-[450px]">
        <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-12 leading-snug">
          {question.text}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(idx)}
              className={`p-6 rounded-2xl text-left transition-all border-2 flex items-center ${
                selectedAnswers[currentIndex] === idx 
                  ? 'border-indigo-600 bg-indigo-50 shadow-sm' 
                  : 'border-slate-50 bg-slate-50 hover:border-slate-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 text-sm font-black flex-shrink-0 ${
                selectedAnswers[currentIndex] === idx ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 border border-slate-200'
              }`}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span className={`font-bold text-lg ${selectedAnswers[currentIndex] === idx ? 'text-indigo-900' : 'text-slate-700'}`}>
                {option}
              </span>
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mt-16 pt-8 border-t border-slate-50">
          <button
            type="button"
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className={`flex items-center space-x-2 font-bold ${currentIndex === 0 ? 'text-slate-300 pointer-events-none' : 'text-slate-600 hover:text-indigo-600'}`}
          >
            <i className="fas fa-chevron-left"></i>
            <span>ORQAGA</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (currentIndex === questions.length - 1) {
                setShowConfirm(true);
              } else {
                setCurrentIndex(prev => prev + 1);
              }
            }}
            className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl flex items-center space-x-2 active:scale-95"
          >
            <span>{currentIndex === questions.length - 1 ? 'YAKUNLASH' : 'KEYINGISI'}</span>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* Tasdiqlash Modali */}
      {showConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-exclamation-triangle text-3xl text-red-600"></i>
            </div>
            <h4 className="text-xl font-black text-slate-800 mb-2">Testni yakunlaysizmi?</h4>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">Hamma javoblar natijalarga saqlanadi.</p>
            <div className="flex flex-col space-y-3">
              <button 
                onClick={handleForceFinish}
                className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700"
              >
                HA, YAKUNLASH
              </button>
              <button 
                onClick={() => setShowConfirm(false)}
                className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200"
              >
                DAVOM ETISH
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
