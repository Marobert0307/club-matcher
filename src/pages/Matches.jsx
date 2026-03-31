import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, X, ChevronRight, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { CLUBS } from '../data/clubs.js';
import MatchBadge from '../components/MatchBadge.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Matches() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const favoriteClubs = state.rankedClubs.length > 0
    ? state.rankedClubs.filter(c => state.favorites.includes(c.id))
    : CLUBS.filter(c => state.favorites.includes(c.id)).map(c => ({ ...c, matchScore: 75 }));

  // 按匹配度排序
  const sorted = [...favoriteClubs].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  const handleBatchApply = () => {
    navigate('/apply/batch');
  };

  const handleUnfav = (e, clubId) => {
    e.stopPropagation();
    dispatch({ type: 'UNFAVORITE_CLUB', payload: clubId });
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-gray-900">我的收藏</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {sorted.length > 0 ? `共收藏 ${sorted.length} 个社团` : '还没有收藏哦'}
            </p>
          </div>
          {sorted.length > 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBatchApply}
              className="flex items-center gap-1.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm shadow-teal-200"
            >
              <Zap size={14} />
              一键报名
            </motion.button>
          )}
        </div>
      </div>

      {/* 内容 */}
      <div className="px-4 py-4">
        {sorted.length === 0 ? (
          <EmptyState
            emoji="💝"
            title="还没有收藏"
            desc="去探索页滑动发现感兴趣的社团，右滑或点击心形按钮即可收藏"
            btnText="去探索"
            btnTo="/explore"
          />
        ) : (
          <div className="space-y-3">
            {sorted.map((club, i) => {
              const isApplied = state.applications.some(a => a.clubId === club.id);
              return (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/club/${club.id}`)}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    {/* Logo */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${club.gradientFrom}, ${club.gradientTo})` }}
                    >
                      {club.emoji}
                    </div>

                    {/* 信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-800 truncate">{club.name}</h3>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">{club.slogan}</p>
                        </div>
                        <button
                          onClick={(e) => handleUnfav(e, club.id)}
                          className="p-1.5 rounded-full hover:bg-red-50 transition-colors flex-shrink-0"
                        >
                          <X size={14} className="text-gray-300 hover:text-red-400" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {club.matchScore ? (
                          <MatchBadge score={club.matchScore} />
                        ) : (
                          <span className="text-xs text-gray-400">点击查看详情</span>
                        )}
                        {isApplied ? (
                          <span className="text-xs font-semibold text-teal-500 bg-teal-50 px-2 py-0.5 rounded-full">
                            ✓ 已报名
                          </span>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/apply/${club.id}`); }}
                            className="text-xs font-semibold text-teal-600 hover:text-teal-700"
                          >
                            报名 →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* 底部提示 */}
            <div className="py-4 text-center">
              <button
                onClick={() => navigate('/explore')}
                className="text-sm text-teal-500 hover:text-teal-600 font-medium"
              >
                + 继续探索更多社团
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
