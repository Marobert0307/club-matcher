import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, BarChart3, Edit, ChevronRight } from 'lucide-react';
import { CLUBS } from '../data/clubs.js';
import { useApp } from '../context/AppContext.jsx';

const MOCK_STATS = { total: 127, pending: 34, interview: 28, admitted: 18 };

const STAT_BLOCKS = [
  { label: '总申请', value: MOCK_STATS.total, emoji: '📋', filter: 'all' },
  { label: '待审核', value: MOCK_STATS.pending, emoji: '⏳', filter: 'submitted' },
  { label: '面试中', value: MOCK_STATS.interview, emoji: '🎤', filter: 'interview' },
  { label: '已录取', value: MOCK_STATS.admitted, emoji: '✅', filter: 'admitted' },
];

export default function Admin() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('clubs');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleStatClick = (filter) => {
    setFilterStatus(filter);
    setActiveTab('applications');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-5 pt-12 pb-5 text-white">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/')} className="p-2 rounded-full bg-white/10 hover:bg-white/20">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div>
            <h1 className="text-xl font-black">社团管理后台</h1>
            <p className="text-white/70 text-xs">管理员视角</p>
          </div>
        </div>

        {/* 统计 — 可点击筛选 */}
        <div className="grid grid-cols-4 gap-2">
          {STAT_BLOCKS.map(({ label, value, emoji, filter }) => (
            <motion.button
              key={label}
              whileTap={{ scale: 0.93 }}
              onClick={() => handleStatClick(filter)}
              className={`rounded-xl p-2 text-center transition-all ${
                activeTab === 'applications' && filterStatus === filter
                  ? 'bg-white/30 ring-2 ring-white/60'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <div className="text-lg mb-0.5">{emoji}</div>
              <p className="text-white font-black text-lg leading-none">{value}</p>
              <p className="text-white/60 text-[10px] mt-0.5">{label}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 flex">
        {[
          { id: 'clubs', label: '社团列表', icon: '🏢' },
          { id: 'applications', label: '申请管理', icon: '📋' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'text-teal-600 border-teal-500'
                : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* 内容 */}
      <div className="px-4 py-4">
        {activeTab === 'clubs' && (
          <div className="space-y-3">
            {CLUBS.map((club, i) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => navigate(`/admin/club/${club.id}`)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${club.gradientFrom}, ${club.gradientTo})` }}
                  >
                    {club.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-800 text-sm">{club.name}</h3>
                      <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{club.slogan}</p>
                    <div className="flex gap-3 mt-1.5 text-xs text-gray-400">
                      <span>👥 {club.memberCount}人</span>
                      <span>📥 招募{club.recruitCount}人</span>
                      <span className="bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full font-medium">招新中</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'applications' && (
          <AdminApplications
            applications={state.applications}
            filterStatus={filterStatus}
            onClearFilter={() => setFilterStatus('all')}
          />
        )}
      </div>
    </div>
  );
}

const STATUS_LABELS = {
  all: '全部',
  submitted: '待审核',
  viewed: '已查看',
  interview: '面试中',
  admitted: '已录取',
};

function AdminApplications({ applications, filterStatus = 'all', onClearFilter }) {
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState({});

  const mockApplicants = [
    { id: 1, name: '张小明', college: '计算机学院', clubId: 1, clubName: '篮球社', matchScore: 88, time: '今天 10:23', status: 'submitted' },
    { id: 2, name: '李梅', college: '艺术学院', clubId: 2, clubName: '摄影社', matchScore: 92, time: '今天 09:15', status: 'viewed' },
    { id: 3, name: '王强', college: '工学院', clubId: 3, clubName: '编程与AI研究会', matchScore: 95, time: '昨天 18:30', status: 'interview' },
    { id: 4, name: '刘婷', college: '文学院', clubId: 4, clubName: '吉他社', matchScore: 79, time: '昨天 14:20', status: 'admitted' },
    { id: 5, name: '陈杰', college: '体育学院', clubId: 1, clubName: '篮球社', matchScore: 85, time: '2天前', status: 'submitted' },
    ...applications.map((app, i) => ({
      id: 100 + i,
      name: '张小明',
      college: '计算机学院',
      clubId: app.clubId,
      clubName: app.clubName,
      matchScore: Math.floor(Math.random() * 30 + 65),
      time: app.appliedAt,
      status: app.status,
    })),
  ];

  const STATUS_ACTIONS = {
    submitted: { label: '标记已查看', next: 'viewed', color: 'text-blue-500 bg-blue-50' },
    viewed: { label: '邀请面试', next: 'interview', color: 'text-purple-500 bg-purple-50' },
    interview: { label: '发放录取', next: 'admitted', color: 'text-teal-500 bg-teal-50' },
    admitted: { label: '已录取 ✓', next: null, color: 'text-gray-400 bg-gray-50' },
  };

  const handleAction = (id, nextStatus) => {
    if (!nextStatus) return;
    setStatuses(prev => ({ ...prev, [id]: nextStatus }));
  };

  const filtered = filterStatus === 'all'
    ? mockApplicants
    : mockApplicants.filter(a => (statuses[a.id] || a.status) === filterStatus);

  return (
    <div className="space-y-3">
      {/* 筛选状态提示 */}
      {filterStatus !== 'all' && (
        <div className="flex items-center justify-between bg-teal-50 border border-teal-100 rounded-xl px-3 py-2">
          <span className="text-sm text-teal-700 font-medium">
            当前筛选：{STATUS_LABELS[filterStatus]}
            <span className="ml-1.5 text-teal-400 font-normal">（共 {filtered.length} 条）</span>
          </span>
          <button
            onClick={onClearFilter}
            className="text-xs text-teal-600 font-semibold bg-teal-100 hover:bg-teal-200 px-2.5 py-1 rounded-full transition-colors"
          >
            清除筛选
          </button>
        </div>
      )}
      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          <p className="text-3xl mb-3">📭</p>
          暂无{STATUS_LABELS[filterStatus]}的申请
        </div>
      )}
      {filtered.map((app, i) => {
        const currentStatus = statuses[app.id] || app.status;
        const action = STATUS_ACTIONS[currentStatus];
        const score = app.matchScore;
        return (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {app.name[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-800 text-sm">{app.name}</p>
                  <p className="text-xs text-gray-500 truncate">{app.college} · {app.clubName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{app.time}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  score >= 85 ? 'bg-emerald-50 text-emerald-600' : score >= 65 ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'
                }`}>
                  {score}% 匹配
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${action.color}`}>
                {currentStatus === 'submitted' ? '待审核' : currentStatus === 'viewed' ? '已查看' : currentStatus === 'interview' ? '面试中' : '已录取'}
              </span>
              <button
                onClick={() => handleAction(app.id, action.next)}
                disabled={!action.next}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                  action.next ? 'bg-teal-500 text-white hover:bg-teal-600' : 'bg-gray-100 text-gray-400'
                }`}
              >
                {action.label}
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
