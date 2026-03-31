import { CLUBS } from '../data/clubs.js';

/**
 * 简单标签交集匹配算法
 * 匹配度 = 交集标签数 / 社团标签数 * 100%
 * 时间偏好一致额外 +10%
 * 上限 99%，下限 20%（保底）
 */
export function calcMatchScore(userProfile, club) {
  const { tags: userTags = [], timePrefer: userTime = 'flexible', frequency: userFreq = 'medium' } = userProfile;

  const clubTags = club.tags || [];
  if (clubTags.length === 0) return 20;

  // 标签交集
  const intersection = userTags.filter(tag => clubTags.includes(tag));
  let score = (intersection.length / clubTags.length) * 80;

  // 时间偏好加分
  if (userTime === 'flexible' || club.timePrefer === 'flexible' || userTime === club.timePrefer) {
    score += 10;
  }

  // 活动频率加分
  if (userFreq === club.frequency) {
    score += 9;
  }

  // 保底+上限
  score = Math.max(20, Math.min(99, Math.round(score)));
  return score;
}

/**
 * 根据用户画像对所有社团排序
 */
export function getRankedClubs(userProfile) {
  return CLUBS
    .map(club => ({ ...club, matchScore: calcMatchScore(userProfile, club) }))
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * 匹配等级文字
 */
export function getMatchLevel(score) {
  if (score >= 85) return { label: '超级匹配', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
  if (score >= 65) return { label: '强烈推荐', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' };
  if (score >= 45) return { label: '值得尝试', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
  return { label: '可以了解', color: 'text-gray-500', bg: 'bg-gray-50 border-gray-200' };
}
