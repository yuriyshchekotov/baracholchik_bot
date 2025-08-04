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
      const normalizedText = text.replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
      const keywords = normalizedText.split(' ').filter(Boolean);
      if (keywords.length === 0) {
        await ctx.reply('Пожалуйста, укажи хотя бы одно ключевое слово. Можно указать сразу несколько, через запятую или через пробел. Я смогу искать как строго по всем словам сразу, так и по любому из слов');
        return;
      }

      SessionManager.update(userId, {
        step: 'askAndOr',
        data: { keywords }
      });

      await ctx.reply('Искать все слова или любое из них*? Варианты ответа: \N и - все слова должны быть в одном сообщении (в любом порядке) \N или достаточно одного слова \N *Если вы указывали слова через плюс, они в любом случае будут искаться как одно');
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