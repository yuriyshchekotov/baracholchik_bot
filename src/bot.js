const { Telegraf } = require('telegraf');
const startCommand = require('./handlers/start');
const helpCommand = require('./handlers/help');
const { message } = require('telegraf/filters');
const subscribeCommand = require('./handlers/subscribe');
const notifyCommand = require('./handlers/notify');

const bot = new Telegraf(process.env.BOT_TOKEN);
const { saveMessage } = require('./db/messages');

// Команды
bot.start(startCommand);
bot.help(helpCommand);
bot.command('subscribe', subscribeCommand); // Не уверен, что здесь должно быть
bot.command('notify', notifyCommand);// Не уверен, что здесь должно быть

bot.on(message('text'), (ctx, next) => {
    const text = ctx.message.text;
    const knownCommands = ['start', 'help']; // можно подгрузить из commands.js
    const command = text.split(' ')[0].substring(1); // без '/'

    if (text.startsWith('/') && !knownCommands.includes(command)) {
        return ctx.reply('Команда не распознана 🤷‍♂️');
    }

    return next();
});

bot.on(message(), (ctx) => {
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