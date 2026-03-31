const KEYS = {
  USER_PROFILE: 'cm_user_profile',
  FAVORITES: 'cm_favorites',
  APPLICATIONS: 'cm_applications',
  PERSONAL_INFO: 'cm_personal_info',
  SKIPPED: 'cm_skipped',
  CHAT_HISTORY: 'cm_chat_history',
};

function get(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// 用户画像
export const profileStorage = {
  get: () => get(KEYS.USER_PROFILE, null),
  set: (profile) => set(KEYS.USER_PROFILE, profile),
  clear: () => localStorage.removeItem(KEYS.USER_PROFILE),
};

// 收藏的社团 ID 列表
export const favoritesStorage = {
  get: () => get(KEYS.FAVORITES, []),
  add: (clubId) => {
    const list = get(KEYS.FAVORITES, []);
    if (!list.includes(clubId)) set(KEYS.FAVORITES, [...list, clubId]);
  },
  remove: (clubId) => {
    const list = get(KEYS.FAVORITES, []);
    set(KEYS.FAVORITES, list.filter(id => id !== clubId));
  },
  has: (clubId) => get(KEYS.FAVORITES, []).includes(clubId),
  clear: () => localStorage.removeItem(KEYS.FAVORITES),
};

// 报名记录
export const applicationStorage = {
  get: () => get(KEYS.APPLICATIONS, []),
  add: (app) => {
    const list = get(KEYS.APPLICATIONS, []);
    const exists = list.find(a => a.clubId === app.clubId);
    if (!exists) set(KEYS.APPLICATIONS, [...list, app]);
  },
  addMany: (apps) => {
    const list = get(KEYS.APPLICATIONS, []);
    const newApps = apps.filter(a => !list.find(e => e.clubId === a.clubId));
    set(KEYS.APPLICATIONS, [...list, ...newApps]);
  },
  has: (clubId) => get(KEYS.APPLICATIONS, []).some(a => a.clubId === clubId),
  clear: () => localStorage.removeItem(KEYS.APPLICATIONS),
};

// 个人信息
const DEFAULT_PERSONAL_INFO = {
  name: '张小明',
  college: '计算机学院',
  major: '计算机科学与技术',
  phone: '138****1234',
  intro: '我是一名热爱探索新事物的大一新生，平时喜欢打篮球和写代码。希望在大学里找到志同道合的伙伴，一起挑战和成长！',
};

export const personalInfoStorage = {
  get: () => get(KEYS.PERSONAL_INFO, DEFAULT_PERSONAL_INFO),
  set: (info) => set(KEYS.PERSONAL_INFO, info),
  getDefault: () => DEFAULT_PERSONAL_INFO,
};

// 跳过的社团
export const skippedStorage = {
  get: () => get(KEYS.SKIPPED, []),
  add: (clubId) => {
    const list = get(KEYS.SKIPPED, []);
    if (!list.includes(clubId)) set(KEYS.SKIPPED, [...list, clubId]);
  },
  clear: () => localStorage.removeItem(KEYS.SKIPPED),
};

// 聊天记录
export const chatStorage = {
  get: () => get(KEYS.CHAT_HISTORY, []),
  set: (msgs) => set(KEYS.CHAT_HISTORY, msgs),
  clear: () => localStorage.removeItem(KEYS.CHAT_HISTORY),
};
