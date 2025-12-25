
import React, { useState, useEffect } from 'react';
import { QuizConfig, Difficulty } from '../types';

interface SetupProps {
  onStart: (config: QuizConfig) => void;
}

const categoryStructure: Record<string, Record<string, string[]>> = {
  'Ingliz tili': {
    'Zamonlar (Tenses)': [
      'Present Simple', 'Present Continuous', 'Present Perfect', 
      'Past Simple', 'Past Continuous', 'Past Perfect',
      'Future Simple', 'Future Continuous', 'Future Perfect'
    ],
    'Grammatika': ['Articles', 'Modal Verbs', 'Passive Voice', 'Conditionals', 'Reported Speech'],
    'Lug\'at boyligi': ['Daily Routine', 'Business English', 'Travel & Tourism', 'Technology']
  },
  'Matematika': {
    'Algebra': ['Chiziqli tenglamalar', 'Kvadrat tenglamalar', 'Logarifmlar', 'Funksiyalar'],
    'Geometriya': ['Planimetriya', 'Stereometriya', 'Vektorlar', 'Trigonometriya'],
    'Analiz': ['Hosilalar', 'Integrallar', 'Limitlar']
  },
  'Biologiya': {
    'Botanika': ['O\'simlik to\'qimalari', 'Gulli o\'simliklar', 'Daraxtlar va butalar'],
    'Zoologiya': ['Bir hujayralilar', 'Bo\'g\'imoyoqlilar', 'Sudralib yuruvchilar', 'Sutemizuvchilar'],
    'Odam anatomiyasi': ['Skelet sistemasi', 'Qon aylanish sistemasi', 'Asab sistemasi', 'Hazm qilish']
  },
  'Kimyo': {
    'Anorganik kimyo': ['Metallar va nometallar', 'Oksidlar', 'Kislota va tuzlar', 'Davriy jadval'],
    'Organik kimyo': ['Alkanlar', 'Alkenlar va Alkinlar', 'Spirtlar', 'Karbon kislotalar'],
    'Umumiy kimyo': ['Atom tuzilishi', 'Kimyoviy bog\'lanish', 'Reaksiya tezligi']
  },
  'Tarix': {
    'O\'zbekiston tarixi': ['Qadimgi davr', 'Amir Temur davri', 'Xonliklar davri', 'Mustaqillik yillari'],
    'Jahon tarixi': ['Qadimgi Misr va Gretsiya', 'O\'rta asrlar', 'Birinchi jahon urushi', 'Ikkinchi jahon urushi']
  },
  'Rus tili': {
    'Grammatika': ['Padéji (Kelishiklar)', 'Glagoli (Fe\'llar)', 'Rodi (Jinslar)', 'Prilagatelniye'],
    'Leksika': ['Rabota i Professiya', 'Semya i Dom', 'Puteshestviye', 'Tehnologii']
  },
  'Informatika': {
    'Dasturlash': ['Python asoslari', 'JavaScript & React', 'Java Spring', 'Ma\'lumotlar tuzilmasi'],
    'Sun\'iy Intellekt': ['Mashinali o\'rganish', 'Neyron tarmoqlar', 'NLP']
  },
    'Ona tili va Adabiyot': {
    'Ona tili': ['Gramatika', 'Zamonlar', 'Marfologiya', 'Sintaksis'],
    'Adabiyot': ['Mumtoz Adabiyot', 'Sheriyat', 'Zamonaviy adabiyot']
    
  }
};

const Setup: React.FC<SetupProps> = ({ onStart }) => {
  const [category, setCategory] = useState('Ingliz tili');
  const [topic, setTopic] = useState('Zamonlar (Tenses)');
  const [subTopic, setSubTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [count, setCount] = useState(20);

  useEffect(() => {
    const currentCategoryTopics = categoryStructure[category];
    if (currentCategoryTopics) {
      const firstTopic = Object.keys(currentCategoryTopics)[0];
      setTopic(firstTopic);
    }
  }, [category]);

  useEffect(() => {
    const currentCategoryTopics = categoryStructure[category];
    if (currentCategoryTopics && currentCategoryTopics[topic]) {
      const firstSub = currentCategoryTopics[topic][0];
      setSubTopic(firstSub);
    }
  }, [category, topic]);

  const categories = Object.keys(categoryStructure);
  const topics = categoryStructure[category] ? Object.keys(categoryStructure[category]) : [];
  const subTopics = (categoryStructure[category] && topic && categoryStructure[category][topic]) 
    ? categoryStructure[category][topic] 
    : [];

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8 flex items-center space-x-4">
        <div className="w-12 h-12 bg-indigo-900 rounded-2xl flex items-center justify-center text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">Fan va Mavzuni tanlang</h2>
          <p className="text-slate-500 font-medium">Dostonbek Academy professional test platformasi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <label className="text-xs font-black text-indigo-900 uppercase tracking-widest">1. Fanni tanlang</label>
          <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`p-4 rounded-2xl text-left font-bold transition-all border-2 ${
                  category === cat ? 'border-indigo-900 bg-indigo-50 text-indigo-900 shadow-sm' : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-xs font-black text-emerald-600 uppercase tracking-widest">2. Yo'nalish va mavzu</label>
            <select 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-emerald-500"
            >
              {topics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {subTopics.map((s) => (
              <button
                key={s}
                onClick={() => setSubTopic(s)}
                className={`p-3 rounded-xl text-left text-sm font-semibold transition-all border-2 ${
                  subTopic === s ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">3. Shartlar</label>
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              {Object.values(Difficulty).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
                    difficulty === diff ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-4 text-center">Savollar: <span className="text-indigo-900">{count} ta</span></label>
            <input 
              type="range" min="5" max="40" step="5" value={count} 
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-900"
            />
          </div>

          <div className="p-5 bg-indigo-950 rounded-3xl text-white relative overflow-hidden shadow-xl">
             <div className="relative z-10">
               <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Tanlov</p>
               <h4 className="font-bold text-lg leading-tight">{category}</h4>
               <p className="text-xs opacity-70 mt-1">{subTopic}</p>
             </div>
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path></svg>
             </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => onStart({ category, topic, subTopic, difficulty, questionCount: count })}
        className="w-full mt-10 bg-indigo-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-950 transition-all shadow-2xl flex items-center justify-center space-x-4 active:scale-[0.98]"
      >
        <span>TESTNI BOSHLASH</span>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7"></path></svg>
      </button>
    </div>
  );
};

export default Setup;
