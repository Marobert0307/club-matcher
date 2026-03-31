import { createContext, useContext, useReducer, useEffect } from 'react';
import { profileStorage, favoritesStorage, applicationStorage, skippedStorage } from '../utils/storage.js';
import { getRankedClubs } from '../utils/matching.js';

const AppContext = createContext(null);

const initialState = {
  userProfile: null,       // { tags, timePrefer, frequency }
  rankedClubs: [],         // 排好序的社团列表（含 matchScore）
  favorites: [],           // 已收藏的社团 ID 列表
  skipped: [],             // 已跳过的社团 ID 列表
  applications: [],        // 报名记录
  currentExploreIndex: 0, // 当前探索到第几张卡片
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PROFILE': {
      const profile = action.payload;
      const rankedClubs = getRankedClubs(profile);
      return { ...state, userProfile: profile, rankedClubs, currentExploreIndex: 0, skipped: [] };
    }
    case 'FAVORITE_CLUB': {
      const id = action.payload;
      if (state.favorites.includes(id)) return state;
      favoritesStorage.add(id);
      return { ...state, favorites: [...state.favorites, id] };
    }
    case 'UNFAVORITE_CLUB': {
      const id = action.payload;
      favoritesStorage.remove(id);
      return { ...state, favorites: state.favorites.filter(f => f !== id) };
    }
    case 'SKIP_CLUB': {
      const id = action.payload;
      skippedStorage.add(id);
      return { ...state, skipped: [...state.skipped, id] };
    }
    case 'ADVANCE_CARD': {
      return { ...state, currentExploreIndex: state.currentExploreIndex + 1 };
    }
    case 'ADD_APPLICATION': {
      const app = action.payload;
      if (state.applications.find(a => a.clubId === app.clubId)) return state;
      applicationStorage.add(app);
      return { ...state, applications: [...state.applications, app] };
    }
    case 'ADD_APPLICATIONS_BATCH': {
      const apps = action.payload;
      const newApps = apps.filter(a => !state.applications.find(e => e.clubId === a.clubId));
      if (newApps.length === 0) return state;
      applicationStorage.addMany(newApps);
      return { ...state, applications: [...state.applications, ...newApps] };
    }
    case 'HYDRATE': {
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 从 localStorage 恢复状态
  useEffect(() => {
    const profile = profileStorage.get();
    const favorites = favoritesStorage.get();
    const applications = applicationStorage.get();
    const skipped = skippedStorage.get();

    let rankedClubs = [];
    if (profile) {
      rankedClubs = getRankedClubs(profile);
    }

    dispatch({
      type: 'HYDRATE',
      payload: { userProfile: profile, rankedClubs, favorites, applications, skipped },
    });
  }, []);

  // profile 变化时持久化
  useEffect(() => {
    if (state.userProfile) {
      profileStorage.set(state.userProfile);
    }
  }, [state.userProfile]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
