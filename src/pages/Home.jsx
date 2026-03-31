import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Compass, Heart, Zap } from 'lucide-react';

const FEATURES = [
  { icon: '🤖', title: 'AI 智能顾问', desc: '随时聊天，个性化推荐你的专属社团' },
  { icon: '🃏', title: '滑动探索', desc: '像刷视频一样发现心仪社团，右滑收藏' },
  { icon: '🎯', title: '精准匹配', desc: '基于兴趣标签，匹配度一目了然' },
  { icon: '⚡', title: '一键报名', desc: '信息填写一次，多个社团批量报名' },
];

const STATS = [
  { num: '200+', label: '入驻社团' },
  { num: '5000+', label: '成功匹配' },
  { num: '98%', label: '满意度' },
  { num: '22', label: '社团分类' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 overflow-x-hidden">
      {/* Hero */}
      <div className="relative overflow-hidden pt-16 pb-8 px-6">
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-40" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100 rounded-full translate-y-1/3 -translate-x-1/3 opacity-40" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-center"
        >
          <div className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-teal-700 text-xs px-3 py-1.5 rounded-full font-medium mb-4">
            <Sparkles size={12} />
            AI 驱动的社团匹配平台
          </div>

          <h1 className="text-4xl font-black text-gray-900 leading-tight mb-3">
            找到你的<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-500">专属社团</span>
          </h1>

          <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xs mx-auto">
            告别百团大战的信息轰炸，用 AI 为你精准匹配最适合的社团，开启精彩大学生活
          </p>

          {/* CTA 按钮 */}
          <div className="flex flex-col gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login?role=student')}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-teal-200 hover:shadow-teal-300 transition-shadow"
            >
              🎓 我是新生，找社团
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login?role=admin')}
              className="w-full bg-white text-gray-700 py-4 rounded-2xl font-bold text-base border border-gray-200 hover:border-gray-300 transition-colors"
            >
              🏢 我是社团负责人
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* 统计数据 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mx-6 mb-6 bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
      >
        <div className="grid grid-cols-4 gap-2">
          {STATS.map(({ num, label }) => (
            <div key={label} className="text-center">
              <p className="text-lg font-black text-teal-600">{num}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 功能亮点 */}
      <div className="px-6 pb-12">
        <h2 className="text-base font-bold text-gray-700 mb-3">为什么选择我们？</h2>
        <div className="grid grid-cols-2 gap-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.4 }}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
            >
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 底部提示 */}
      <div className="text-center pb-8 text-xs text-gray-400">
        © 2024 社团招新智能匹配平台
      </div>
    </div>
  );
}
