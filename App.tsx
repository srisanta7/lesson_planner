import React, { useState } from 'react';
import { AppView } from './types';
import { LessonPlanner } from './components/LessonPlanner';
import { QuizGenerator } from './components/QuizGenerator';
import { VisualAids } from './components/VisualAids';
import { BookOpen, BrainCircuit, Image as ImageIcon, GraduationCap } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LESSON_PLANNER);

  const renderContent = () => {
    switch (currentView) {
      case AppView.LESSON_PLANNER:
        return <LessonPlanner />;
      case AppView.QUIZ_GENERATOR:
        return <QuizGenerator />;
      case AppView.VISUAL_AID:
        return <VisualAids />;
      default:
        return <LessonPlanner />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 flex-shrink-0 h-auto md:h-screen sticky top-0 z-10 md:static">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">TutorMind AI</h1>
            <p className="text-xs text-slate-500 font-medium">Teacher's Assistant</p>
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setCurrentView(AppView.LESSON_PLANNER)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentView === AppView.LESSON_PLANNER
                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm ring-1 ring-indigo-200'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Lesson Planner</span>
          </button>

          <button
            onClick={() => setCurrentView(AppView.QUIZ_GENERATOR)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentView === AppView.QUIZ_GENERATOR
                ? 'bg-purple-50 text-purple-700 font-semibold shadow-sm ring-1 ring-purple-200'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <BrainCircuit className="w-5 h-5" />
            <span>Quiz Creator</span>
          </button>

          <button
            onClick={() => setCurrentView(AppView.VISUAL_AID)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentView === AppView.VISUAL_AID
                ? 'bg-pink-50 text-pink-700 font-semibold shadow-sm ring-1 ring-pink-200'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <span>Visual Aids</span>
          </button>
        </nav>

        <div className="p-4 mt-auto hidden md:block">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 text-center leading-relaxed">
              Enhance your teaching with Gemini 2.5 models. Generate plans, quizzes, and images instantly.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {currentView === AppView.LESSON_PLANNER && 'Create a Lesson Plan'}
              {currentView === AppView.QUIZ_GENERATOR && 'Generate Assessment'}
              {currentView === AppView.VISUAL_AID && 'Create Teaching Visuals'}
            </h2>
            <p className="text-slate-500 mt-1">
              {currentView === AppView.LESSON_PLANNER && 'Structure your class time effectively.'}
              {currentView === AppView.QUIZ_GENERATOR && 'Create multiple choice questions with explanations.'}
              {currentView === AppView.VISUAL_AID && 'Generate custom diagrams and illustrations.'}
            </p>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

export default App;
