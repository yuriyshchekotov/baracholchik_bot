import { BotContext } from '../../types/index.js';
import ChatManager from '../../db/ChatManager.js';

const myChatMemberHandler = async (ctx: BotContext): Promise<void> => {
  const payload = ctx.myChatMember;
  if (!payload || !payload.chat || !payload.new_chat_member || !payload.new_chat_member.status) return;

  const chat = payload.chat;

  // Игнорируем личные переписки
  if (chat.type === 'private') return;

  const status = payload.new_chat_member.status;

  // Если бот покинул чат, был удалён или ограничен — отключаем follow
  const leftStatuses = ['left', 'kicked'];

  if (leftStatuses.includes(status)) {
    ChatManager.setFollow(chat.id, false);
    console.log(`👋 Бот покинул чат ${chat.title || '(без названия)'} (${chat.id})`);
  }

  // Если бот был добавлен в чат — включаем follow
  const joinedStatuses = ['member', 'administrator', 'restricted'];
  if (joinedStatuses.includes(status)) {
    ChatManager.addIfNotExists({
      id: chat.id,
      title: chat.title || '(без названия)',
      type: chat.type
    });
    ChatManager.setFollow(chat.id, true);
    console.log(`🤖 Бот добавлен в чат ${chat.title || '(без названия)'} (${chat.id})`);
  }
};

export default myChatMemberHandler; 