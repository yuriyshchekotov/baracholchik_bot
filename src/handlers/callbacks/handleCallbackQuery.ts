import SessionManager from '../../db/SessionManager';
import { subscribeUserToFilter } from '../triggers/subscribeTrigger';
import type { BotContext } from "../../types";

const handleCallbackQuery = async (ctx: BotContext): Promise<void> => {
    const callbackQuery = ctx.callbackQuery;

    if (callbackQuery && 'data' in callbackQuery) {
        const data = callbackQuery.data;
        console.log('🔘 Получен callback_query:', data);

        const userId = ctx.from?.id;
        if (!userId) return;

        if (data === 'filter_mode_and' || data === 'filter_mode_or') {
            const session = SessionManager.get(userId);
            if (!session || session.command !== 'subscribe') {
                await ctx.answerCbQuery('Сессия не найдена');
                return;
            }

            const conjunction = data === 'filter_mode_and';
            const keywords = session.data.keywords || [];

            if (keywords.length === 0) {
                await ctx.answerCbQuery('Ключевые слова не найдены');
                return;
            }

            // Create the filter immediately
            const result = subscribeUserToFilter(userId, keywords, conjunction);
            
            // Delete the message with buttons
            await ctx.deleteMessage().catch(() => {});
            
            // End the session
            SessionManager.end(userId);

            if (result.status === 'alreadyExists') {
                await ctx.reply('Ты уже подписан на такой фильтр.');
            } else {
                await ctx.reply(`Фильтр "${result.name}" создан и добавлен в твою подписку.`);
            }
            
            return;
        }

        await ctx.answerCbQuery('Кнопка нажата!');
    } else {
        console.warn('Получен callback_query без data');
    }
};

export default handleCallbackQuery;