
export enum Difficulty {
  EASY = 'Oson',
  MEDIUM = 'O\'rtacha',
  HARD = 'Qiyin'
}

export interface User {
  id?: number;
  fullName: string;
  email: string;
  isLoggedIn: boolean;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizResult {
  id?: number;
  userId?: number;
  userName?: string;
  score: number;
  answeredCount: number;
  totalQuestions: number;
  timeSpent: number;
  answers: {
    questionId: number;
    selectedOption: number;
    isCorrect: boolean;
  }[];
  date: string;
  category: string;
  topic?: string;
  subTopic?: string;
}

export interface QuizConfig {
  category: string;
  topic: string;
  subTopic: string;
  difficulty: Difficulty;
  questionCount: number;
}
