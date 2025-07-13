import userManager from '../../db/UserManager.js';

function escapeMarkdown(text) {
    return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
}

export default async function notifyNewFilteredTrigger(ctx, message, filter) {
    const matchingUsers = userManager.getAll().filter(user =>
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
                disable_web_page_preview: true
            })
        )
    );
};