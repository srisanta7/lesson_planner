import React, { useState } from 'react';
import { GradeLevel, GenerationState } from '../types';
import { generateLessonPlan } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';
import { BookOpen, Copy, Check } from 'lucide-react';

export const LessonPlanner: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState<GradeLevel>(GradeLevel.ELEMENTARY);
  const [duration, setDuration] = useState('45');
  const [state, setState] = useState<GenerationState>({ isLoading: false, error: null, data: null });
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setState({ isLoading: true, error: null, data: null });
    try {
      const plan = await generateLessonPlan(topic, grade, duration);
      setState({ isLoading: false, error: null, data: plan });
    } catch (err) {
      setState({ isLoading: false, error: (err as Error).message, data: null });
    }
  };

  const handleCopy = () => {
    if (state.data) {
      navigator.clipboard.writeText(state.data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          Lesson Plan Generator
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Lesson Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Photosynthesis, The French Revolution, Fractions"
              className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Grade Level</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value as GradeLevel)}
              className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              {Object.values(GradeLevel).map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Minutes)</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="15">15 mins (Mini-lesson)</option>
              <option value="30">30 mins</option>
              <option value="45">45 mins (Standard)</option>
              <option value="60">60 mins</option>
              <option value="90">90 mins (Block)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={state.isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {state.isLoading ? 'Generating...' : 'Create Lesson Plan'}
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

      {state.data && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 relative animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            onClick={handleCopy}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
          <div className="prose prose-slate max-w-none whitespace-pre-wrap">
            {state.data}
          </div>
        </div>
      )}
    </div>
  );
};
