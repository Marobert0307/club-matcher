import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { CLUBS } from '../data/clubs.js';
import { useApp } from '../context/AppContext.jsx';
import { personalInfoStorage } from '../utils/storage.js';

const STATUSES = ['submitted', 'viewed', 'interview', 'admitted'];

function randomStatus() {
  const weights = [0.4, 0.3, 0.2, 0.1];
  const rand = Math.random();
  let cum = 0;
  for (let i = 0; i < weights.length; i++) {
    cum += weights[i];
    if (rand < cum) return STATUSES[i];
  }
  return 'submitted';
}

export default function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const isBatch = id === 'batch';

  // 要报名的社团
  const clubs = isBatch
    ? (state.rankedClubs.length > 0
        ? state.rankedClubs.filter(c => state.favorites.includes(c.id))
        : CLUBS.filter(c => state.favorites.includes(c.id)))
    : [CLUBS.find(c => c.id === Number(id))].filter(Boolean);

  // 过滤已报名
  const toApply = clubs.filter(c => !state.applications.some(a => a.clubId === c.id));

  // 个人信息（预填）
  const [info, setInfo] = useState(personalInfoStorage.get);

  const handleChange = (field, val) => {
    setInfo(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    personalInfoStorage.set(info);
    await new Promise(r => setTimeout(r, 1200));

    if (isBatch) {
      const apps = toApply.map(c => ({
        clubId: c.id,
        clubName: c.name,
        clubEmoji: c.emoji,
        gradientFrom: c.gradientFrom,
        gradientTo: c.gradientTo,
        status: randomStatus(),
        appliedAt: new Date().toLocaleDateString('zh-CN'),
      }));
      dispatch({ type: 'ADD_APPLICATIONS_BATCH', payload: apps });
    } else {
      const club = clubs[0];
      dispatch({
        type: 'ADD_APPLICATION',
        payload: {
          clubId: club.id,
          clubName: club.name,
          clubEmoji: club.emoji,
          gradientFrom: club.gradientFrom,
          gradientTo: club.gradientTo,
          status: randomStatus(),
          appliedAt: new Date().toLocaleDateString('zh-CN'),
        },
      });
    }
    setLoading(false);
    setSubmitted(true);
  };

  if (!isBatch && clubs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">社团不存在</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle size={40} className="text-white" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-2xl font-black text-gray-900 mb-2">报名成功！🎉</h2>
          <p className="text-gray-500 mb-2">
            {isBatch ? `已向 ${toApply.length} 个社团提交报名` : `已向「${clubs[0]?.name}」提交报名`}
          </p>
          <p className="text-sm text-gray-400 mb-8">社团负责人将尽快与你联系，请保持手机畅通</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/my-applications')}
              className="bg-teal-500 text-white py-3 px-8 rounded-2xl font-bold"
            >
              查看报名进度
            </button>
            <button
              onClick={() => navigate('/explore')}
              className="text-gray-500 text-sm"
            >
              继续探索社团
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-black text-gray-900">
              {isBatch ? `批量报名 (${toApply.length}个)` : `报名 · ${clubs[0]?.name}`}
            </h1>
            <p className="text-xs text-gray-400">填写后一键提交</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 pb-32 overflow-y-auto">
        {/* 报名社团列表（批量时展示） */}
        {isBatch && (
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <h3 className="font-bold text-gray-700 text-sm mb-3">报名社团</h3>
            <div className="space-y-2">
              {toApply.map(club => (
                <div key={club.id} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${club.gradientFrom}, ${club.gradientTo})` }}
                  >
                    {club.emoji}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{club.name}</span>
                </div>
              ))}
              {toApply.length === 0 && (
                <p className="text-sm text-gray-400 py-2">收藏的社团均已报名</p>
              )}
            </div>
          </div>
        )}

        {/* 个人信息表单 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-700 text-sm mb-3">个人信息（预填，可修改）</h3>
          <div className="space-y-3">
            {[
              { field: 'name', label: '姓名', type: 'text' },
              { field: 'college', label: '学院', type: 'text' },
              { field: 'major', label: '专业', type: 'text' },
              { field: 'phone', label: '手机号', type: 'tel' },
            ].map(({ field, label, type }) => (
              <div key={field}>
                <label className="block text-xs text-gray-500 mb-1 font-medium">{label}</label>
                <input
                  type={type}
                  value={info[field] || ''}
                  onChange={e => handleChange(field, e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-teal-400 transition-colors"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">自我介绍</label>
              <textarea
                value={info.intro || ''}
                onChange={e => handleChange('intro', e.target.value)}
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-teal-400 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* 温馨提示 */}
        <div className="mt-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
          <p className="text-xs text-amber-700 leading-relaxed">
            💡 提交后你的信息将发送给社团负责人审核，录取结果会通过手机通知你。信息保存后下次报名可自动复用。
          </p>
        </div>
      </div>

      {/* 底部提交 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-5 py-4 z-50">
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={loading || (isBatch && toApply.length === 0)}
          onClick={handleSubmit}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
            loading
              ? 'bg-teal-400 text-white'
              : (isBatch && toApply.length === 0)
              ? 'bg-gray-100 text-gray-400'
              : 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-200'
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              提交中...
            </>
          ) : (isBatch && toApply.length === 0) ? '所有社团已报名' : '确认提交报名 🚀'}
        </motion.button>
      </div>
    </div>
  );
}
