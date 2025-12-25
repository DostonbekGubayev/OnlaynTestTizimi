
import { QuizResult, User } from './types';

// Jakarta EE backend URL dostonbekacademy.uz domeniga ulandi
const API_BASE_URL = 'http://dostonbekacademy.uz/api';

export const apiService = {
  // Natijani bazaga saqlash (POST /api/results)
  saveResult: async (result: QuizResult): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      });
      if (!response.ok) throw new Error('Natijani saqlashda xatolik');
    } catch (error) {
      console.warn('Backend connection failed, using local fallback:', error);
      // Fallback: local storage (internet bo'lmaganda yoki backend tayyor bo'lmaganda)
      const localResults = JSON.parse(localStorage.getItem('quiz_history') || '[]');
      localResults.push(result);
      localStorage.setItem('quiz_history', JSON.stringify(localResults));
    }
  },

  // Barcha natijalarni olish (GET /api/results)
  getAllResults: async (): Promise<QuizResult[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/results`);
      if (!response.ok) throw new Error('Natijalarni yuklashda xatolik');
      return await response.json();
    } catch (error) {
      console.warn('Backend fetch failed, using local storage:', error);
      return JSON.parse(localStorage.getItem('quiz_history') || '[]');
    }
  },

  // Login simulatsiyasi (Jakarta EE Auth /api/login bilan bog'lanishi mumkin)
  login: async (email: string, fullName: string): Promise<User> => {
    // Real tizimda bu yerda API chaqirilib, JWT yoki Session olinadi
    const user = { fullName, email, isLoggedIn: true };
    localStorage.setItem('current_user', JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem('current_user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};
