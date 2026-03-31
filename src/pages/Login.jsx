import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

const DEFAULTS = {
  student: {
    login: { id: '2024010001', password: '123456' },
    register: { name: '张小明', id: '2024010001', phone: '138****1234', password: '123456' },
  },
  admin: {
    login: { id: 'T20180032', password: '123456' },
    register: { name: '李老师', id: 'T20180032', phone: '139****5678', password: '123456' },
  },
};

const ROLE_CONFIG = {
  student: {
    label: '新生',
    emoji: '🎓',
    idLabel: '学号',
    idPlaceholder: '请输入学号',
    gradient: 'from-teal-500 to-teal-600',
    bg: 'from-teal-50 via-white to-blue-50',
    dest: '/profile',
  },
  admin: {
    label: '社团负责人',
    emoji: '🏢',
    idLabel: '工号',
    idPlaceholder: '请输入工号',
    gradient: 'from-slate-600 to-slate-700',
    bg: 'from-slate-50 via-white to-gray-50',
    dest: '/admin',
  },
};

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const role = params.get('role') === 'admin' ? 'admin' : 'student';
  const cfg = ROLE_CONFIG[role];
  const defaults = DEFAULTS[role];

  const [tab, setTab] = useState('login');
  const [showPwd, setShowPwd] = useState(false);
  const [loginForm, setLoginForm] = useState(defaults.login);
  const [regForm, setRegForm] = useState(defaults.register);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    navigate(cfg.dest);
  };

  const handleRegister = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    navigate(cfg.dest);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${cfg.bg} flex flex-col`}>
      {/* 顶部返回 */}
      <div className="px-5 pt-12 pb-2">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-full hover:bg-black/5 transition-colors inline-flex items-center gap-1.5 text-gray-500 text-sm"
        >
          <ArrowLeft size={18} />
          返回首页
        </button>
      </div>

      {/* 头部身份标识 */}
      <div className="text-center px-6 pt-4 pb-6">
        <div className="text-5xl mb-3">{cfg.emoji}</div>
        <h1 className="text-2xl font-black text-gray-900">{cfg.label}登录</h1>
        <p className="text-gray-400 text-sm mt-1">欢迎使用社团招新智能匹配平台</p>
      </div>

      {/* 登录/注册卡片 */}
      <div className="flex-1 px-5">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tab 切换 */}
          <div className="flex border-b border-gray-100">
            {['login', 'register'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3.5 text-sm font-bold transition-colors ${
                  tab === t
                    ? 'text-gray-900 border-b-2 border-gray-900 -mb-px'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {t === 'login' ? '账号登录' : '注册账号'}
              </button>
            ))}
          </div>

          <div className="p-5">
            <AnimatePresence mode="wait">
              {tab === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">{cfg.idLabel}</label>
                    <input
                      type="text"
                      value={loginForm.id}
                      onChange={e => setLoginForm(p => ({ ...p, id: e.target.value }))}
                      placeholder={cfg.idPlaceholder}
                      className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal-400 transition-colors bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">密码</label>
                    <div className="relative">
                      <input
                        type={showPwd ? 'text' : 'password'}
                        value={loginForm.password}
                        onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                        placeholder="请输入密码"
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal-400 transition-colors bg-gray-50 pr-11"
                      />
                      <button
                        onClick={() => setShowPwd(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                      >
                        {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400 px-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-teal-500" />
                      记住我
                    </label>
                    <button className="text-teal-500 hover:text-teal-600">忘记密码？</button>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleLogin}
                    disabled={loading}
                    className={`w-full py-4 rounded-2xl font-bold text-white text-base mt-2 flex items-center justify-center gap-2 transition-all bg-gradient-to-r ${cfg.gradient} shadow-lg`}
                  >
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />登录中...</>
                    ) : '登录'}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {[
                    { field: 'name', label: '姓名', type: 'text', placeholder: '请输入姓名' },
                    { field: 'id', label: cfg.idLabel, type: 'text', placeholder: cfg.idPlaceholder },
                    { field: 'phone', label: '手机号', type: 'tel', placeholder: '请输入手机号' },
                    { field: 'password', label: '设置密码', type: 'password', placeholder: '请设置密码' },
                  ].map(({ field, label, type, placeholder }) => (
                    <div key={field}>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
                      <input
                        type={type}
                        value={regForm[field]}
                        onChange={e => setRegForm(p => ({ ...p, [field]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal-400 transition-colors bg-gray-50"
                      />
                    </div>
                  ))}

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleRegister}
                    disabled={loading}
                    className={`w-full py-4 rounded-2xl font-bold text-white text-base mt-2 flex items-center justify-center gap-2 transition-all bg-gradient-to-r ${cfg.gradient} shadow-lg`}
                  >
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />注册中...</>
                    ) : '立即注册'}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 提示文字 */}
        <p className="text-center text-xs text-gray-400 mt-4 px-6">
          登录即代表同意《用户协议》和《隐私政策》
        </p>
        <p className="text-center text-xs text-gray-400 mt-1">
          账号密码已预填，直接点击登录即可体验
        </p>
      </div>

      <div className="h-12" />
    </div>
  );
}
