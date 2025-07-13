import MessageManager from '../../db/MessageManager.js';
import ChatManager from '../../db/ChatManager.js';
import Message from '../../db/Message.js';
import filterTrigger from '../triggers/filterTrigger.js';

console.log('📨 Вошли в messageEventHandler');

export default async function messageEventHandler(ctx) {

    const msg = ctx.message;
    if (msg.chat.type !== 'private') {
        ChatManager.addIfNotExists({
            id: msg.chat.id,
            title: msg.chat.title || '(без названия)',
            type: msg.chat.type,
        });
    }

    if (!msg || (!msg.text && !msg.caption)) {
        // Пока обрабатываем только текстовые и подписанные медиа-сообщения
        return;
    }

    const text = msg.text || msg.caption; // Обрабатываем текст либо подпись к медиа
    const from = msg.from?.username || msg.from?.first_name || 'unknown';
    const chatId = msg.chat.id;

    console.log(`[${chatId}] ${from}: ${text}`);

    const newMessage = new Message({
        messageId: msg.message_id,
        chatId,
        from,
        text,
        date: new Date(msg.date * 1000).toISOString()
    });

    // Сохраняем сообщение в базу
    MessageManager.addMessage(newMessage);

    // Передаём сообщение в фильтровщик
    await filterTrigger(ctx, newMessage);
};