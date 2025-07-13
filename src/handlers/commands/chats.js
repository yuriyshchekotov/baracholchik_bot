import ChatManager from '../../db/ChatManager.js';

export default async function chatsCommand(ctx) {
    const chats = ChatManager.getFollowedChats();

    if (chats.length === 0) {
        return ctx.reply('Нет активных чатов.');
    }

    const lines = chats.map(chat => {
        const title = chat.title || '(без названия)';
        return `• ${title} (${chat.id}) [${chat.type}]`;
    });

    await ctx.reply(`📋 Активные чаты:\n` + lines.join('\n'));
};