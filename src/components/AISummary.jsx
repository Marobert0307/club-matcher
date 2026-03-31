import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import TypeWriter from './TypeWriter.jsx';
import { generateClubSummary } from '../utils/aiEngine.js';

export default function AISummary({ club }) {
  const [summary] = useState(() => generateClubSummary(club));
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 600);
    return () => clearTimeout(t);
  }, [club.id]);

  return (
    <div className="mx-4 mb-4 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100 rounded-2xl p-4">
      <div className="flex items-center gap-1.5 mb-2">
        <Sparkles size={14} className="text-teal-500" />
        <span className="text-xs font-semibold text-teal-600">AI 氛围解读</span>
        <span className="text-xs text-gray-400 ml-1">由 AI 生成</span>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">
        {started ? (
          <TypeWriter text={summary} speed={25} />
        ) : (
          <span className="text-gray-300">AI 正在分析...</span>
        )}
      </p>
    </div>
  );
}
