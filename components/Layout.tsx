
import React from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  setView: (view: any) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, setView, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="glass-effect sticky top-0 z-50 border-b border-slate-200 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView('setup')}>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 transform hover:rotate-6 transition-transform">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Dostonbek Academy</h1>
              <p className="text-[10px] text-indigo-600 font-bold tracking-[0.2em]">INTELLIGENT TESTING</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-slate-600 font-semibold">
            <a href="/components/webSaytUchun/index.html" className="hover:text-indigo-600 transition-colors">Bosh sahifa</a>
            <button onClick={() => setView('setup')} className="hover:text-indigo-600 transition-colors">Test olish</button>
            <button onClick={() => setView('history')} className="hover:text-indigo-600 transition-colors">Natijalar</button>
            <a href="http://dostonbekacademy.uz/courses" className="hover:text-indigo-600 transition-colors">Kurslar</a>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-slate-900">{user.fullName}</p>
                  <button onClick={onLogout} className="text-[10px] text-red-500 font-bold hover:underline uppercase">Chiqish</button>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-indigo-600 flex items-center justify-center text-indigo-600 font-bold shadow-inner">
                  {user.fullName.charAt(0)}
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setView('login')}
                className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95 text-sm"
              >
                Kirish
              </button>
            )}
          </div>
        </div>
      </nav>
      
      <main className="flex-grow bg-slate-50/50">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Dostonbek Academy</h3>
            <p className="text-sm leading-relaxed">Biz bilan birga bilimingizni eng yuqori darajaga olib chiqing.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Tezkor havolalar</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/components/webSaytUchun/index.html" className="hover:text-white transition-colors">Bosh sahifa</a></li>
              <li><a href="/components/webSaytUchun/courses.html" className="hover:text-white transition-colors">Kurslar ro'yxati</a></li>
              <li><button onClick={() => setView('setup')} className="hover:text-white transition-colors">Test topshirish</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Aloqa</h4>
            <p className="text-sm">Manzil: Jomboy tumani Uztelekom binosi</p>
            <p className="text-sm">Telegram: @dostonbek_academy</p>
            <p className="text-sm"><a href="tel">+998 93 289 99 16</a></p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-8 mt-8 border-t border-slate-800 text-center text-[10px] tracking-widest font-bold">
          &copy; {new Date().getFullYear()} DOSTONBEK ACADEMY AI SYSTEM.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
