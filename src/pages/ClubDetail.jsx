import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Users, Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import { CLUBS } from '../data/clubs.js';
import { useApp } from '../context/AppContext.jsx';
import MatchBadge from '../components/MatchBadge.jsx';
import AISummary from '../components/AISummary.jsx';

export default function ClubDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const club = CLUBS.find(c => c.id === Number(id));
  if (!club) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-gray-400 mb-4">社团不存在</p>
        <button onClick={() => navigate(-1)} className="text-teal-500">返回</button>
      </div>
    </div>
  );

  const rankedClub = state.rankedClubs.find(c => c.id === club.id);
  const matchScore = rankedClub?.matchScore;
  const isFav = state.favorites.includes(club.id);
  const isApplied = state.applications.some(a => a.clubId === club.id);

  const toggleFav = () => {
    if (isFav) {
      dispatch({ type: 'UNFAVORITE_CLUB', payload: club.id });
    } else {
      dispatch({ type: 'FAVORITE_CLUB', payload: club.id });
    }
  };

  const FREQ_LABEL = { high: '每周2次+', medium: '每周1次', low: '每月2-3次' };
  const TIME_LABEL = { weekday: '工作日', weekend: '周末', flexible: '时间灵活' };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* 顶部 Banner */}
      <div
        className="relative pt-12 pb-8 px-5"
        style={{ background: `linear-gradient(135deg, ${club.gradientFrom}, ${club.gradientTo})` }}
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute top-12 left-5 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>

        <div className="text-center mt-4">
          <div className="text-7xl mb-3 drop-shadow-lg">{club.emoji}</div>
          <h1 className="text-white text-2xl font-black mb-1">{club.name}</h1>
          <p className="text-white/80 text-sm">{club.slogan}</p>
          {matchScore && (
            <div className="mt-3 flex justify-center">
              <MatchBadge score={matchScore} size="lg" />
            </div>
          )}
        </div>
      </div>

      {/* 内容区 */}
      <div className="pb-32">
        {/* AI 氛围总结 */}
        <div className="mt-4">
          <AISummary club={club} />
        </div>

        {/* 基本信息 */}
        <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-3">基本信息</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users size={15} className="text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">社团人数</p>
                <p className="text-sm font-semibold text-gray-800">{club.memberCount} 人</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <Calendar size={15} className="text-green-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">成立时间</p>
                <p className="text-sm font-semibold text-gray-800">{club.founded} 年</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock size={15} className="text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">活动频率</p>
                <p className="text-sm font-semibold text-gray-800">{FREQ_LABEL[club.frequency]}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <MapPin size={15} className="text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">活动时间</p>
                <p className="text-sm font-semibold text-gray-800">{TIME_LABEL[club.timePrefer]}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 社团简介 */}
        <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-2">社团简介</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{club.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {club.tags.map(tag => (
              <span key={tag} className="bg-teal-50 text-teal-700 text-xs px-2.5 py-1 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 活动照片墙 */}
        <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-3">活动掠影</h2>
          <div className="grid grid-cols-4 gap-2">
            {club.photos.map((emoji, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl flex items-center justify-center text-3xl"
                style={{ background: `linear-gradient(135deg, ${club.gradientFrom}40, ${club.gradientTo}40)` }}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>

        {/* 学长学姐说 */}
        <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-3">学长学姐说</h2>
          <div className="space-y-3">
            {club.reviews.map((review, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                  {review.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-500 mb-1">{review.name}</p>
                  <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-3 py-2">
                    <p className="text-sm text-gray-700 leading-relaxed">{review.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 近期活动 */}
        <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-3">近期活动</h2>
          <div className="space-y-2">
            {club.activities.map((act, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: club.gradientFrom }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-gray-800 text-sm">{act.title}</p>
                    <span className="text-xs text-gray-400 flex-shrink-0">{act.date}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 招新要求 */}
        <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-2">招新要求</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{club.requirements}</p>
          <div className="mt-2 bg-teal-50 rounded-xl px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-teal-700 font-medium">本期招募名额</span>
            <span className="text-teal-600 font-bold">{club.recruitCount} 人</span>
          </div>
        </div>
      </div>

      {/* 底部固定栏 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-5 py-4 z-50">
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleFav}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl border-2 font-semibold text-sm transition-all ${
              isFav
                ? 'border-teal-400 bg-teal-50 text-teal-600'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <Heart size={16} className={isFav ? 'fill-teal-400 text-teal-400' : ''} />
            {isFav ? '已收藏' : '收藏'}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(isApplied ? '/my-applications' : `/apply/${club.id}`)}
            className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${
              isApplied
                ? 'bg-gray-100 text-gray-400'
                : 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md shadow-teal-200'
            }`}
          >
            {isApplied ? '✓ 已报名，查看进度' : '立即报名 →'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
