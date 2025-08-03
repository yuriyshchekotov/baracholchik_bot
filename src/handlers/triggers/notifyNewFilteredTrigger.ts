import type { BotContext } from '../../types';
import UserManager from '../../db/UserManager';
import Message from '../../db/Message';
import Filter from '../../db/Filter';

function escapeMarkdown(text: string): string {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
}

const notifyNewFilteredTrigger = async (ctx: BotContext, message: Message, filter: Filter): Promise<void> => {
  const matchingUsers = UserManager.getAll().filter(user =>
    user.hasFilter(filter.id)
  );

  if (matchingUsers.length === 0) {
    return;
  }

  const chatId = message.chatId;
  const messageId = message.messageId;
  const text = escapeMarkdown(message.text);
  const filterName = escapeMarkdown(filter.name);

  const link = `https://t.me/c/${String(chatId).replace('-100', '')}/${messageId}`;

  const notification = `📢 Новость по теме *${filterName}*:\n` +
    `В чате \`${chatId}\` появилось сообщение:\n` +
    `> ${text}\n\n` +
    `[Перейти к сообщению](${link})`;

  await Promise.allSettled(
    matchingUsers.map(user =>
      ctx.telegram.sendMessage(user.id, notification, {
        parse_mode: 'MarkdownV2',
        link_preview_options: { is_disabled: true }
      })
    )
  );
};

export default notifyNewFilteredTrigger; 