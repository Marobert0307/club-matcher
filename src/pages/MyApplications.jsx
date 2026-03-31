import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import StatusTracker from '../components/StatusTracker.jsx';
import EmptyState from '../components/EmptyState.jsx';

const STATUS_LABEL = {
  submitted: { text: '等待审核', color: 'text-amber-500', bg: 'bg-amber-50' },
  viewed: { text: '已被查看', color: 'text-blue-500', bg: 'bg-blue-50' },
  interview: { text: '面试邀请', color: 'text-purple-600', bg: 'bg-purple-50' },
  admitted: { text: '🎉 已录取', color: 'text-teal-600', bg: 'bg-teal-50' },
};

export default function MyApplications() {
  const navigate = useNavigate();
  const { state } = useApp();
  const apps = state.applications;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-gray-900">我的</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {apps.length > 0 ? `已报名 ${apps.length} 个社团` : '开始你的社团之旅'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/profile')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="重新设置兴趣画像"
            >
              <Settings size={20} className="text-gray-500" />
            </button>
            <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* 内容 */}
      <div className="px-4 py-4">
        {/* 统计卡片 */}
        {apps.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: '已报名', value: apps.length, color: 'text-teal-600' },
              { label: '面试邀请', value: apps.filter(a => a.status === 'interview').length, color: 'text-purple-600' },
              { label: '已录取', value: apps.filter(a => a.status === 'admitted').length, color: 'text-orange-500' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-2xl p-3 shadow-sm text-center">
                <p className={`text-2xl font-black ${color}`}>{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* 报名列表 */}
        {apps.length === 0 ? (
          <EmptyState
            emoji="📋"
            title="还没有报名记录"
            desc="探索感兴趣的社团，右滑收藏后一键报名"
            btnText="去探索社团"
            btnTo="/explore"
          />
        ) : (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-gray-500 px-1">报名记录</h2>
            {apps.map((app, i) => {
              const statusInfo = STATUS_LABEL[app.status] || STATUS_LABEL.submitted;
              return (
                <motion.div
                  key={app.clubId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/club/${app.clubId}`)}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${app.gradientFrom}, ${app.gradientTo})` }}
                    >
                      {app.clubEmoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-gray-800 truncate">{app.clubName}</h3>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${statusInfo.color} ${statusInfo.bg}`}>
                          {statusInfo.text}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">报名时间：{app.appliedAt}</p>
                    </div>
                  </div>

                  {/* 状态进度条 */}
                  <div className="overflow-x-auto">
                    <StatusTracker status={app.status} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
