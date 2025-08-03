import type { BotContext } from '../../types';
import { subscribeUserToFilter } from '../triggers/subscribeTrigger';
import SessionManager from '../../db/SessionManager';

const subscribeCommand = async (ctx: BotContext): Promise<void> => {
  if (!ctx.message || !('text' in ctx.message)) {
    await ctx.reply('Ошибка: сообщение не содержит текст');
    return;
  }

  const userId = ctx.chat?.id;
  if (!userId) {
    await ctx.reply('Ошибка: не удалось определить пользователя.');
    return;
  }

  const text = ctx.message.text;
  const parts = text.split(' ').slice(1); // отрезаем "/subscribe"

  if (parts.length === 0) {
    // Запуск диалога, если нет аргументов
    SessionManager.start(userId, 'subscribe');
    await ctx.reply('🧐 Какие ключевые слова тебя интересуют? Напиши через запятую.');
    return;
  }

  const conjunction = parts.includes('-and');
  const keywords = parts.filter(p => p !== '-and');

  if (keywords.length === 0) {
    await ctx.reply('Нужно указать хотя бы одно ключевое слово.');
    return;
  }

  const result = subscribeUserToFilter(userId, keywords, conjunction);

  if (result.status === 'alreadyExists') {
    await ctx.reply('Ты уже подписан на такой фильтр.');
    return;
  }

  await ctx.reply(`Фильтр "${result.name}" создан и добавлен в твою подписку.`);
};

export default subscribeCommand;