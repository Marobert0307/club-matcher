import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { CLUBS } from '../data/clubs.js';

export default function AdminClub() {
  const { id } = useParams();
  const navigate = useNavigate();
  const club = CLUBS.find(c => c.id === Number(id));
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: club?.name || '',
    slogan: club?.slogan || '',
    description: club?.description || '',
    requirements: club?.requirements || '',
    recruitCount: club?.recruitCount || 0,
    memberCount: club?.memberCount || 0,
  });

  if (!club) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-400">社团不存在</p>
    </div>
  );

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigate('/admin');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-5 pt-12 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-black text-gray-900 truncate">编辑：{club.name}</h1>
            <p className="text-xs text-gray-400">修改社团信息</p>
          </div>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
            style={{ background: `linear-gradient(135deg, ${club.gradientFrom}, ${club.gradientTo})` }}
          >
            {club.emoji}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 pb-32 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <h3 className="font-bold text-gray-700 text-sm">基本信息</h3>
          {[
            { field: 'name', label: '社团名称' },
            { field: 'slogan', label: '一句话介绍' },
          ].map(({ field, label }) => (
            <div key={field}>
              <label className="block text-xs text-gray-500 mb-1 font-medium">{label}</label>
              <input
                type="text"
                value={form[field]}
                onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-teal-400"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">社团简介</label>
            <textarea
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-teal-400 resize-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <h3 className="font-bold text-gray-700 text-sm">招新设置</h3>
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">招新要求</label>
            <textarea
              value={form.requirements}
              onChange={e => setForm(p => ({ ...p, requirements: e.target.value }))}
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-teal-400 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1 font-medium">招募名额</label>
              <input
                type="number"
                value={form.recruitCount}
                onChange={e => setForm(p => ({ ...p, recruitCount: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-teal-400"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1 font-medium">当前人数</label>
              <input
                type="number"
                value={form.memberCount}
                onChange={e => setForm(p => ({ ...p, memberCount: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-5 py-4 z-50">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
            saved ? 'bg-teal-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-800'
          }`}
        >
          {saved ? (
            <><CheckCircle size={18} /> 保存成功！</>
          ) : (
            <><Save size={18} /> 保存修改</>
          )}
        </motion.button>
      </div>
    </div>
  );
}
