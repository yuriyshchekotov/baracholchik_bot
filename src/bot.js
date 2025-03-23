const { Telegraf } = require('telegraf');
const startCommand = require('./handlers/start');
const helpCommand = require('./handlers/help');

const bot = new Telegraf(process.env.BOT_TOKEN);
const { saveMessage } = require('./db/messages');

// Команды
bot.start(startCommand);
bot.help(helpCommand);

// Все сообщения
bot.on('message', (ctx) => {
    const from = ctx.from.username || ctx.from.first_name;
    const text = ctx.message.text || '[не текстовое сообщение]';
    const chatId = ctx.chat.id;

    console.log(`[${chatId}] ${from}: ${text}`);

    saveMessage({
        chatId,
        from,
        text,
        date: new Date().toISOString(),
    });
});

module.exports = bot;