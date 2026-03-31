import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { TAG_CATEGORIES, TIME_OPTIONS, FREQ_OPTIONS } from '../data/tags.js';
import { useApp } from '../context/AppContext.jsx';

const TOTAL_STEPS = 3;

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [timePrefer, setTimePrefer] = useState('flexible');
  const [frequency, setFrequency] = useState('medium');

  const toggleCategory = (id) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredCategories = TAG_CATEGORIES.filter(c => selectedCategories.includes(c.id));

  const handleFinish = () => {
    const profile = { tags: selectedTags, timePrefer, frequency, categories: selectedCategories };
    dispatch({ type: 'SET_PROFILE', payload: profile });
    navigate('/explore');
  };

  const canNext =
    (step === 1 && selectedCategories.length > 0) ||
    (step === 2 && selectedTags.length > 0) ||
    step === 3;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4">
        <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/')} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div className="flex-1">
          <p className="text-xs text-gray-400 mb-1">步骤 {step}/{TOTAL_STEPS}</p>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full"
              animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-2xl font-black text-gray-900 mt-2 mb-1">你喜欢什么？</h2>
              <p className="text-gray-500 text-sm mb-5">选择你感兴趣的大类（可多选）</p>
              <div className="grid grid-cols-2 gap-3 pb-4">
                {TAG_CATEGORIES.map(cat => {
                  const selected = selectedCategories.includes(cat.id);
                  return (
                    <motion.button
                      key={cat.id}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => toggleCategory(cat.id)}
                      className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                        selected
                          ? 'border-teal-400 bg-teal-50'
                          : 'border-gray-100 bg-white hover:border-gray-200'
                      }`}
                    >
                      {selected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                      <div className="text-3xl mb-2">{cat.emoji}</div>
                      <p className="font-bold text-gray-800 text-sm">{cat.name}</p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-2xl font-black text-gray-900 mt-2 mb-1">精选标签</h2>
              <p className="text-gray-500 text-sm mb-5">点击选择你喜欢的细分标签</p>
              <div className="space-y-4 pb-4">
                {filteredCategories.map(cat => (
                  <div key={cat.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{cat.emoji}</span>
                      <span className="font-semibold text-gray-700 text-sm">{cat.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cat.tags.map(tag => {
                        const selected = selectedTags.includes(tag);
                        return (
                          <motion.button
                            key={tag}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                              selected
                                ? 'bg-teal-500 text-white border-teal-500'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {tag}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-2xl font-black text-gray-900 mt-2 mb-1">时间偏好</h2>
              <p className="text-gray-500 text-sm mb-5">告诉我们你的空闲时间，匹配更精准</p>

              <div className="space-y-4 pb-4">
                <div>
                  <p className="font-semibold text-gray-700 mb-2">活动时间</p>
                  <div className="flex gap-2">
                    {TIME_OPTIONS.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setTimePrefer(opt.id)}
                        className={`flex-1 py-3 rounded-xl border-2 text-center transition-all ${
                          timePrefer === opt.id
                            ? 'border-teal-400 bg-teal-50'
                            : 'border-gray-100 bg-white hover:border-gray-200'
                        }`}
                      >
                        <p className={`font-bold text-sm ${timePrefer === opt.id ? 'text-teal-600' : 'text-gray-700'}`}>
                          {opt.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-700 mb-2">活动频率</p>
                  <div className="flex gap-2">
                    {FREQ_OPTIONS.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setFrequency(opt.id)}
                        className={`flex-1 py-3 rounded-xl border-2 text-center transition-all ${
                          frequency === opt.id
                            ? 'border-teal-400 bg-teal-50'
                            : 'border-gray-100 bg-white hover:border-gray-200'
                        }`}
                      >
                        <p className={`font-bold text-sm ${frequency === opt.id ? 'text-teal-600' : 'text-gray-700'}`}>
                          {opt.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 画像预览 */}
                {selectedTags.length > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs font-semibold text-gray-500 mb-2">你的兴趣标签</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTags.map(tag => (
                        <span key={tag} className="bg-teal-100 text-teal-700 px-2.5 py-1 rounded-full text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部按钮 */}
      <div className="px-5 pb-10 pt-4 bg-white">
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={!canNext}
          onClick={() => step < TOTAL_STEPS ? setStep(s => s + 1) : handleFinish()}
          className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
            canNext
              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-200'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {step < TOTAL_STEPS ? (
            <>下一步 <ArrowRight size={18} /></>
          ) : (
            <>🚀 开始探索</>
          )}
        </motion.button>
      </div>
    </div>
  );
}
