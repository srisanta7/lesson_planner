import React, { useState } from 'react';
import { GenerationState } from '../types';
import { generateEducationalImage } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';
import { Image as ImageIcon, Download } from 'lucide-react';

export const VisualAids: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [state, setState] = useState<GenerationState>({ isLoading: false, error: null, data: null });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setState({ isLoading: true, error: null, data: null });
    try {
      const imageUrl = await generateEducationalImage(prompt);
      setState({ isLoading: false, error: null, data: imageUrl });
    } catch (err) {
      setState({ isLoading: false, error: (err as Error).message, data: null });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <ImageIcon className="w-6 h-6 text-pink-600" />
          Visual Aid Generator
        </h2>
        <form onSubmit={handleSubmit} className="gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A diagram of the human heart, The water cycle, Ancient Roman colosseum"
                className="flex-1 rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
                required
              />
              <button
                type="submit"
                disabled={state.isLoading}
                className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-6 py-2.5 rounded-lg transition disabled:opacity-50"
              >
                Generate
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Powered by Gemini 2.5 Flash Image. Generates schematic or illustrative educational visuals.
            </p>
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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-in fade-in zoom-in duration-500">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-700">Generated Visual Aid</h3>
            <a 
              href={state.data} 
              download={`tutor-aid-${Date.now()}.png`}
              className="flex items-center gap-2 text-sm text-pink-600 hover:text-pink-700 font-medium"
            >
              <Download className="w-4 h-4" /> Download
            </a>
          </div>
          <div className="bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex justify-center">
            <img 
              src={state.data} 
              alt="Generated visual aid" 
              className="max-h-[500px] object-contain w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};
