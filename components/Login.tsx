
import React, { useState } from 'react';
import { apiService } from '../apiService';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;
    
    setLoading(true);
    const user = await apiService.login(email, fullName);
    onLogin(user);
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 mt-10 animate-in slide-in-from-top-4 duration-500">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-100">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
        </div>
        <h2 className="text-2xl font-black text-slate-800">Xush kelibsiz!</h2>
        <p className="text-slate-500 text-sm mt-1">Dostonbek Academy platformasiga kiring</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">To'liq ism-sharif</label>
          <input 
            type="text" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors font-medium"
            placeholder="Masalan: Garry Poter"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email manzil</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors font-medium"
            placeholder="example@academy.com"
            required
          />
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Kirilmoqda...' : 'Tizimga kirish'}
        </button>
      </form>
      
      <p className="text-center text-slate-400 text-xs mt-8">
        Bu platforma Dostonbek Academy o'quv markazi tomonidan ommaga taqdim qilingan.
      </p>
    </div>
  );
};

export default Login;
