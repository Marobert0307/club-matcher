import { AI_TEMPLATES } from '../data/aiTemplates.js';
import { CLUBS } from '../data/clubs.js';

/**
 * 解析用户输入，匹配关键词，返回回复文本和推荐社团列表
 */
export function generateAIReply(input, userProfile = null) {
  const text = input.toLowerCase();

  // 处理快捷问题
  if (input === '__recommend__') {
    const clubs = userProfile?.tags?.length
      ? CLUBS.filter(c => c.tags.some(t => userProfile.tags.includes(t))).slice(0, 4)
      : CLUBS.slice(0, 4);
    return {
      text: AI_TEMPLATES.quickReplies.recommend,
      clubs,
    };
  }
  if (input === '__weekend__') {
    const clubs = CLUBS.filter(c => c.timePrefer === 'weekend').slice(0, 4);
    return { text: AI_TEMPLATES.quickReplies.weekend, clubs };
  }
  if (input === '__programming__') {
    const clubs = CLUBS.filter(c => c.category === 'tech').slice(0, 4);
    return { text: AI_TEMPLATES.quickReplies.programming, clubs };
  }
  if (input === '__sports_music__') {
    const clubs = [
      ...CLUBS.filter(c => c.category === 'sports').slice(0, 2),
      ...CLUBS.filter(c => c.category === 'music').slice(0, 2),
    ];
    return { text: AI_TEMPLATES.quickReplies.sports_music, clubs };
  }

  // 关键词匹配
  let matched = null;
  let matchedClubs = [];

  for (const [key, config] of Object.entries(AI_TEMPLATES.keywords)) {
    const found = config.words.some(w => text.includes(w));
    if (found) {
      matched = config;
      // 根据 categoryIds 过滤社团
      if (config.categoryIds && config.categoryIds.length > 0) {
        matchedClubs = CLUBS.filter(c => config.categoryIds.includes(c.category)).slice(0, 4);
      } else if (config.timeFilter) {
        matchedClubs = CLUBS.filter(c => c.timePrefer === config.timeFilter || c.timePrefer === 'flexible').slice(0, 4);
      }
      break;
    }
  }

  if (matched && matchedClubs.length > 0) {
    return {
      text: matched.reply(matchedClubs),
      clubs: matchedClubs,
    };
  }

  // Fallback
  const fallbacks = AI_TEMPLATES.fallback;
  const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
  return { text: fallback, clubs: [] };
}

/**
 * 生成社团 AI 氛围总结
 */
export function generateClubSummary(club) {
  const summaryFn = AI_TEMPLATES.summaries[club.aiSummaryType];
  if (summaryFn) return summaryFn(club);
  return `${club.name}是一个充满活力的校园社团，等待着有缘人的加入。`;
}
