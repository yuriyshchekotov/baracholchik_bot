const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');

const startCommand = require('./handlers/commands/start');
const helpCommand = require('./handlers/commands/help');
const subscribeCommand = require('./handlers/commands/subscribe');
const notifyCommand = require('./handlers/commands/notify');
const searchCommand = require('./handlers/commands/search');

const messageEventHandler = require('./handlers/events/message');

const bot = new Telegraf(process.env.BOT_TOKEN);

// --- Команды ---
bot.start(startCommand);
bot.help(helpCommand);
bot.command('subscribe', subscribeCommand);
bot.command('notify', notifyCommand);
bot.command('search', searchCommand);

// --- Обработка неизвестных команд ---
bot.on(message('text'), async (ctx, next) => {
    const text = ctx.message.text;
    const knownCommands = ['start', 'help', 'subscribe', 'notify', 'search'];
    const command = text.split(' ')[0].substring(1);

    if (text.startsWith('/') && !knownCommands.includes(command)) {
        await ctx.reply('Команда не распознана 🤷‍♂️');
        return;
    }

    await next();
});

// --- Обработка событий ---
bot.on(message(), messageEventHandler);
bot.on('my_chat_member', require('./handlers/events/myChatMember'));

module.exports = bot;