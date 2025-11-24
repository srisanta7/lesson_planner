export enum AppView {
  LESSON_PLANNER = 'LESSON_PLANNER',
  QUIZ_GENERATOR = 'QUIZ_GENERATOR',
  VISUAL_AID = 'VISUAL_AID',
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizData {
  title: string;
  questions: QuizQuestion[];
}

export enum GradeLevel {
  KINDERGARTEN = 'Kindergarten',
  ELEMENTARY = 'Elementary School (1-5)',
  MIDDLE = 'Middle School (6-8)',
  HIGH = 'High School (9-12)',
  UNIVERSITY = 'University',
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  data: any | null;
}
