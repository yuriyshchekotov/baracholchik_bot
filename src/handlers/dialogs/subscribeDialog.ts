import type { BotContext } from '../../types';
import SessionManager from "../../db/SessionManager";
import {Session} from "../../db/Session";
import { subscribeUserToFilter } from '../triggers/subscribeTrigger';

export default async function handleSubscribeDialog(ctx: BotContext, session: Session): Promise<void> {
  const userId = ctx.from?.id;
  if (!userId || !ctx.message || !('text' in ctx.message)) return;

  const text = ctx.message.text.trim().toLowerCase();

  if (text === 'отмена' || text === '/cancel') {
    SessionManager.end(userId);
    await ctx.reply('Диалог подписки отменён.');
    return;
  }

  switch (session.step) {
    case 'start':
    case 'askKeywords': {
      const keywords = text.split(',').map(s => s.trim()).filter(Boolean);
      if (keywords.length === 0) {
        await ctx.reply('Пожалуйста, укажи хотя бы одно ключевое слово через запятую.');
        return;
      }

      SessionManager.update(userId, {
        step: 'askAndOr',
        data: { keywords }
      });

      await ctx.reply('Искать все слова (`и`) или любое из них (`или`)? Ответь: *и* или *или*.');
      return;
    }

    case 'askAndOr': {
      const keywords = session.data.keywords;
      const conjunction = text === 'и';

      if (text !== 'и' && text !== 'или') {
        await ctx.reply('Пожалуйста, ответь одним словом: *и* или *или*.');
        return;
      }

      const result = subscribeUserToFilter(userId, keywords, conjunction);

      SessionManager.end(userId);

      if (result.status === 'alreadyExists') {
        await ctx.reply('Ты уже подписан на такой фильтр.');
      } else {
        await ctx.reply(`Фильтр "${result.name}" создан и добавлен в твою подписку.`);
      }
      return;
    }

    default:
      SessionManager.end(userId);
      await ctx.reply('Что-то пошло не так. Диалог завершён.');
  }
}