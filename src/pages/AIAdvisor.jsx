import { useState, useEffect, useRef } from 'react';
import { Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiBubble, UserBubble } from '../components/ChatBubble.jsx';
import { generateAIReply } from '../utils/aiEngine.js';
import { useApp } from '../context/AppContext.jsx';
import { AI_TEMPLATES } from '../data/aiTemplates.js';

const QUICK_QUESTIONS = [
  { label: '🎯 推荐适合我的', value: '__recommend__' },
  { label: '📅 周末活动多的', value: '__weekend__' },
  { label: '💻 编程相关社团', value: '__programming__' },
  { label: '⚽🎵 运动+音乐', value: '__sports_music__' },
];

let msgId = 0;
const newId = () => ++msgId;

export default function AIAdvisor() {
  const { state } = useApp();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typingId, setTypingId] = useState(null);
  const endRef = useRef(null);

  // 初始化欢迎消息
  useEffect(() => {
    const welcomeId = newId();
    setMessages([{
      id: welcomeId,
      type: 'ai',
      text: AI_TEMPLATES.greeting,
      clubs: [],
    }]);
    setTypingId(welcomeId);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const userMsg = { id: newId(), type: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // 模拟 AI 思考延迟
    setTimeout(() => {
      const { text: replyText, clubs } = generateAIReply(text, state.userProfile);
      const aiId = newId();
      setMessages(prev => [...prev, { id: aiId, type: 'ai', text: replyText, clubs }]);
      setTypingId(aiId);
    }, 600 + Math.random() * 400);
  };

  const handleTypeDone = (id) => {
    if (typingId === id) setTypingId(null);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-12 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-xl">
            🤖
          </div>
          <div>
            <h1 className="font-black text-gray-900">AI 社团顾问</h1>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              <span className="text-xs text-gray-400">在线 · 随时回复</span>
            </div>
          </div>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {msg.type === 'ai' ? (
                <AiBubble
                  message={msg}
                  isTyping={typingId === msg.id}
                  onTypeDone={() => handleTypeDone(msg.id)}
                />
              ) : (
                <UserBubble text={msg.text} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* AI 思考中 */}
        {typingId === null && messages.length > 0 && messages[messages.length - 1].type === 'user' && (
          <div className="flex gap-2 items-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-sm flex-shrink-0">
              🤖
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* 快捷问题 */}
      <div className="bg-white px-4 pt-3 border-t border-gray-50 flex-shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {QUICK_QUESTIONS.map(q => (
            <button
              key={q.value}
              onClick={() => sendMessage(q.value)}
              className="flex-shrink-0 bg-gray-50 hover:bg-teal-50 hover:text-teal-600 border border-gray-200 hover:border-teal-200 text-gray-600 text-xs px-3 py-2 rounded-full whitespace-nowrap transition-colors font-medium"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* 输入框 */}
      <div className="bg-white px-4 pb-4 pt-2 flex gap-2 flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder="告诉我你的兴趣爱好..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal-400 transition-colors"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => sendMessage(input)}
          disabled={!input.trim()}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${
            input.trim()
              ? 'bg-teal-500 hover:bg-teal-600 text-white'
              : 'bg-gray-100 text-gray-300'
          }`}
        >
          <Send size={16} />
        </motion.button>
      </div>
    </div>
  );
}
