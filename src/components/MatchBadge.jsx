import { getMatchLevel } from '../utils/matching.js';

export default function MatchBadge({ score, size = 'md' }) {
  const level = getMatchLevel(score);
  const isLg = size === 'lg';

  return (
    <span className={`inline-flex items-center gap-1 border rounded-full font-semibold ${level.bg} ${level.color} ${
      isLg ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'
    }`}>
      <span className={isLg ? 'text-base' : 'text-xs'}>
        {score >= 85 ? '🔥' : score >= 65 ? '⭐' : score >= 45 ? '💫' : '✨'}
      </span>
      {score}% · {level.label}
    </span>
  );
}
