import React, { useState } from 'react';
import { GradeLevel, GenerationState, QuizData } from '../types';
import { generateQuiz } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';
import { BrainCircuit, CheckCircle2, HelpCircle } from 'lucide-react';

export const QuizGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState<GradeLevel>(GradeLevel.MIDDLE);
  const [questionCount, setQuestionCount] = useState(5);
  const [state, setState] = useState<GenerationState>({ isLoading: false, error: null, data: null });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setState({ isLoading: true, error: null, data: null });
    try {
      const quiz = await generateQuiz(topic, grade, questionCount);
      setState({ isLoading: false, error: null, data: quiz });
    } catch (err) {
      setState({ isLoading: false, error: (err as Error).message, data: null });
    }
  };

  const quizData = state.data as QuizData | null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <BrainCircuit className="w-6 h-6 text-purple-600" />
          AI Quiz Creator
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Quiz Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Solar System, Basic Grammar, World War II"
              className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value as GradeLevel)}
              className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-purple-500 outline-none bg-white"
            >
              {Object.values(GradeLevel).map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Number of Questions</label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-purple-500 outline-none bg-white"
            >
              <option value={3}>3 Questions</option>
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={state.isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {state.isLoading ? 'Generating Quiz...' : 'Generate Quiz'}
            </button>
          </div>
        </form>
      </div>

      {state.error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {state.error}
        </div>
      )}

      {state.isLoading && <LoadingSpinner />}

      {quizData && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-800">{quizData.title}</h3>
              <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                {quizData.questions.length} Questions
              </span>
           </div>

           {quizData.questions.map((q, idx) => (
             <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50">
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-purple-600 text-white rounded-full font-bold text-sm">
                      {idx + 1}
                    </span>
                    <p className="text-lg font-medium text-slate-800 pt-0.5">{q.question}</p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((option, oIdx) => {
                      const isCorrect = option === q.correctAnswer;
                      return (
                        <div 
                          key={oIdx} 
                          className={`p-3 rounded-lg border ${
                            isCorrect 
                              ? "bg-green-50 border-green-200" 
                              : "bg-white border-slate-200"
                          } flex items-center justify-between`}
                        >
                          <span className={`${isCorrect ? "text-green-800 font-medium" : "text-slate-600"}`}>
                            {option}
                          </span>
                          {isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm flex gap-2 items-start">
                    <HelpCircle className="w-5 h-5 flex-shrink-0 text-blue-600" />
                    <p><span className="font-semibold">Explanation:</span> {q.explanation}</p>
                  </div>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};
