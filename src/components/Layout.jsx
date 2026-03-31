import { useLocation, useNavigate } from 'react-router-dom';
import { Compass, Heart, Bot, User } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const NAV_ITEMS = [
  { path: '/explore', icon: Compass, label: '探索' },
  { path: '/ai-advisor', icon: Bot, label: 'AI顾问' },
  { path: '/matches', icon: Heart, label: '收藏' },
  { path: '/my-applications', icon: User, label: '我的' },
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useApp();

  const showNav = NAV_ITEMS.some(n => location.pathname.startsWith(n.path));

  return (
    <div className="h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative overflow-hidden">
      <main className="flex-1 min-h-0 overflow-hidden flex flex-col">
        {children}
      </main>

      {showNav && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 z-50">
          <div className="flex items-center justify-around h-16">
            {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
              const active = location.pathname.startsWith(path);
              const badge = path === '/matches' ? state.favorites.length : 0;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`flex flex-col items-center gap-0.5 px-4 py-2 transition-colors ${
                    active ? 'text-teal-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <div className="relative">
                    <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                    {badge > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {badge > 9 ? '9+' : badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-medium">{label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
