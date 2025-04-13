const { addRecipient } = require('../db/recipients');

module.exports = (ctx) => {
    const chatId = ctx.chat.id;
    const added = addRecipient(chatId);

    if (added) {
        ctx.reply('Вы подписались на рассылку ✅');
    } else {
        ctx.reply('Вы уже были подписаны 😉');
    }
};