import { useNavigate } from 'react-router-dom';

export default function EmptyState({ emoji = '🌟', title, desc, btnText, btnTo, btnAction }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="text-6xl mb-4">{emoji}</div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-6 leading-relaxed">{desc}</p>
      {(btnText && (btnTo || btnAction)) && (
        <button
          onClick={btnAction || (() => navigate(btnTo))}
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-full font-medium transition-colors"
        >
          {btnText}
        </button>
      )}
    </div>
  );
}
