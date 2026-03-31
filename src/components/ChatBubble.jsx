import { useNavigate } from 'react-router-dom';
import TypeWriter from './TypeWriter.jsx';

export function AiBubble({ message, isTyping, onTypeDone }) {
  const navigate = useNavigate();
  return (
    <div className="flex gap-2 items-start">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-sm flex-shrink-0">
        🤖
      </div>
      <div className="max-w-[80%]">
        <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
          {isTyping ? (
            <TypeWriter
              text={message.text}
              speed={30}
              onDone={onTypeDone}
              className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap"
            />
          ) : (
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{message.text}</p>
          )}
        </div>
        {/* 推荐社团卡片 */}
        {message.clubs && message.clubs.length > 0 && !isTyping && (
          <div className="mt-2 space-y-2">
            {message.clubs.map(club => (
              <button
                key={club.id}
                onClick={() => navigate(`/club/${club.id}`)}
                className="w-full bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 hover:bg-gray-50 hover:border-teal-200 transition-all shadow-sm text-left"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${club.gradientFrom}, ${club.gradientTo})` }}
                >
                  {club.emoji}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{club.name}</p>
                  <p className="text-xs text-gray-500 truncate">{club.slogan}</p>
                </div>
                <span className="text-teal-500 text-xs flex-shrink-0">查看 →</span>
              </button>
            ))}
          </div>
        )}
        <p className="text-[10px] text-gray-400 mt-1 ml-1">AI 顾问</p>
      </div>
    </div>
  );
}

export function UserBubble({ text }) {
  return (
    <div className="flex gap-2 items-start justify-end">
      <div className="max-w-[75%]">
        <div className="bg-teal-500 rounded-2xl rounded-tr-sm px-4 py-3">
          <p className="text-sm text-white leading-relaxed">{text}</p>
        </div>
        <p className="text-[10px] text-gray-400 mt-1 text-right mr-1">我</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-sm flex-shrink-0">
        😊
      </div>
    </div>
  );
}
