import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { X, Info, Heart, RotateCcw, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { CLUBS } from '../data/clubs.js';
import MatchBadge from '../components/MatchBadge.jsx';
import EmptyState from '../components/EmptyState.jsx';

function SwipeCard({ club, onSwipe, onDetail, isTop }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);
  const navigate = useNavigate();

  const handleDragEnd = (_, info) => {
    if (info.offset.x > 100) {
      onSwipe('right', club.id);
    } else if (info.offset.x < -100) {
      onSwipe('left', club.id);
    }
  };

  if (!isTop) {
    return (
      <div className="absolute inset-0 rounded-3xl overflow-hidden" style={{ pointerEvents: 'none' }}>
        <CardContent club={club} />
      </div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
    >
      {/* LIKE 覆盖层 */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute inset-0 bg-emerald-500/20 rounded-3xl z-10 flex items-center justify-center"
        pointerEvents="none"
      >
        <div className="border-4 border-emerald-500 rounded-2xl px-6 py-3 rotate-[-15deg]">
          <p className="text-emerald-500 font-black text-3xl">收藏 ❤️</p>
        </div>
      </motion.div>

      {/* NOPE 覆盖层 */}
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute inset-0 bg-red-500/20 rounded-3xl z-10 flex items-center justify-center"
        pointerEvents="none"
      >
        <div className="border-4 border-red-400 rounded-2xl px-6 py-3 rotate-[15deg]">
          <p className="text-red-400 font-black text-3xl">跳过 ✕</p>
        </div>
      </motion.div>

      <button
        className="absolute inset-0 rounded-3xl overflow-hidden w-full h-full"
        onClick={() => navigate(`/club/${club.id}`)}
        onPointerDown={(e) => e.stopPropagation()}
        draggable={false}
      >
        <CardContent club={club} />
      </button>
    </motion.div>
  );
}

function CardContent({ club }) {
  return (
    <div className="w-full h-full rounded-3xl overflow-hidden flex flex-col shadow-xl">
      {/* 顶部渐变区域 */}
      <div
        className="flex-1 flex flex-col items-center justify-center relative"
        style={{ background: `linear-gradient(135deg, ${club.gradientFrom}, ${club.gradientTo})` }}
      >
        <div className="text-8xl mb-3 drop-shadow-lg">{club.emoji}</div>
        <h2 className="text-white text-2xl font-black drop-shadow">{club.name}</h2>
        <p className="text-white/80 text-sm mt-1 px-8 text-center">{club.slogan}</p>

        {/* 匹配度 */}
        {club.matchScore && (
          <div className="mt-3 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
            <span className="text-white font-bold text-sm">
              {club.matchScore >= 85 ? '🔥' : club.matchScore >= 65 ? '⭐' : '💫'} 匹配度 {club.matchScore}%
            </span>
          </div>
        )}
      </div>

      {/* 底部信息区域 */}
      <div className="bg-white px-5 pt-4 pb-5">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {club.tags.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full font-medium">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{club.description}</p>
        <div className="flex gap-3 mt-3 text-xs text-gray-400">
          <span>👥 {club.memberCount}人</span>
          <span>📅 {club.frequency === 'high' ? '每周2次+' : club.frequency === 'medium' ? '每周1次' : '每月2-3次'}</span>
          <span>🏫 {club.founded}年创立</span>
        </div>
      </div>
    </div>
  );
}

export default function Explore() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [history, setHistory] = useState([]); // 用于撤回
  const [exiting, setExiting] = useState(null); // { id, dir }

  // 未被跳过或收藏处理的社团列表
  const clubs = state.rankedClubs.length > 0 ? state.rankedClubs : CLUBS;
  const processedIds = new Set([...state.skipped, ...state.favorites]);
  const remaining = clubs.filter(c => !processedIds.has(c.id));

  const handleSwipe = (dir, clubId) => {
    setExiting({ id: clubId, dir });
    setHistory(prev => [...prev, { id: clubId, dir }]);
    setTimeout(() => {
      setExiting(null);
      if (dir === 'right') {
        dispatch({ type: 'FAVORITE_CLUB', payload: clubId });
      } else {
        dispatch({ type: 'SKIP_CLUB', payload: clubId });
      }
    }, 300);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    if (last.dir === 'right') {
      dispatch({ type: 'UNFAVORITE_CLUB', payload: last.id });
    } else {
      const newSkipped = state.skipped.filter(id => id !== last.id);
      dispatch({ type: 'HYDRATE', payload: { skipped: newSkipped } });
    }
  };

  const topClubs = remaining.slice(0, 3);

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-gray-50 overflow-hidden">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4 bg-gray-50 flex-shrink-0">
        <div>
          <h1 className="text-xl font-black text-gray-900">发现社团</h1>
          <p className="text-xs text-gray-400">
            {state.userProfile ? `为你精选 ${clubs.length} 个社团` : '探索所有社团'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button onClick={handleUndo} className="p-2 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50">
              <RotateCcw size={18} className="text-gray-500" />
            </button>
          )}
          <button
            onClick={() => navigate('/matches')}
            className="relative p-2 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50"
          >
            <Heart size={18} className="text-gray-500" />
            {state.favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {state.favorites.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 卡片区域 */}
      <div className="flex-1 flex items-center justify-center px-5 overflow-hidden">
        {topClubs.length > 0 ? (
          <div className="relative w-full" style={{ height: '480px' }}>
            {/* 后面的卡片（层次感） */}
            {topClubs[2] && (
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-lg"
                style={{ transform: 'translateY(16px) scale(0.94)', zIndex: 1 }}>
                <CardContent club={topClubs[2]} />
              </div>
            )}
            {topClubs[1] && (
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-lg"
                style={{ transform: 'translateY(8px) scale(0.97)', zIndex: 2 }}>
                <CardContent club={topClubs[1]} />
              </div>
            )}
            {/* 顶部可交互卡片 */}
            <AnimatePresence>
              {topClubs[0] && (
                <motion.div
                  key={topClubs[0].id}
                  className="absolute inset-0"
                  style={{ zIndex: 10 }}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <SwipeCard
                    club={topClubs[0]}
                    onSwipe={handleSwipe}
                    isTop={true}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <EmptyState
            emoji="🎉"
            title="探索完毕！"
            desc={`你已经浏览了所有社团，收藏了 ${state.favorites.length} 个感兴趣的社团`}
            btnText={state.favorites.length > 0 ? '查看我的收藏' : '重新开始'}
            btnTo={state.favorites.length > 0 ? '/matches' : '/profile'}
          />
        )}
      </div>

      {/* 底部操作按钮 + 滑动提示 */}
      {topClubs.length > 0 && (
        <div className="flex flex-col items-center pb-20 pt-2 flex-shrink-0 gap-3">
          <div className="flex items-center justify-center gap-5">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSwipe('left', topClubs[0].id)}
              className="w-14 h-14 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center hover:shadow-lg transition-shadow"
            >
              <X size={24} className="text-red-400" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(`/club/${topClubs[0].id}`)}
              className="w-12 h-12 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center hover:shadow-lg transition-shadow"
            >
              <Info size={20} className="text-blue-400" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSwipe('right', topClubs[0].id)}
              className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full shadow-md shadow-teal-200 flex items-center justify-center hover:shadow-lg hover:shadow-teal-300 transition-shadow"
            >
              <Heart size={24} className="text-white" />
            </motion.button>
          </div>
          {/* 滑动提示文字 */}
          <div className="flex items-center justify-between w-64">
            <span className="text-sm font-medium text-red-300">← 左滑跳过</span>
            <span className="text-sm font-medium text-teal-400">右滑收藏 →</span>
          </div>
        </div>
      )}
    </div>
  );
}
