const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');

const startCommand = require('./handlers/commands/start');
const helpCommand = require('./handlers/commands/help');
const subscribeCommand = require('./handlers/commands/subscribe');
const notifyCommand = require('./handlers/commands/notify');
const searchCommand = require('./handlers/commands/search');
const chatsCommand = require('./handlers/commands/chats');
const permitCommand = require('./handlers/commands/permit');
const forbidCommand = require('./handlers/commands/forbid');

const messageEventHandler = require('./handlers/events/message');
const requirePermission = require('./handlers/middleware/requirePermission');

const bot = new Telegraf(process.env.BOT_TOKEN);

// --- Команды и требуемые для них права доступа ---
bot.command('start', requirePermission('admin_all',startCommand));
bot.command('help', requirePermission('admin_all',helpCommand));
bot.command('subscribe', requirePermission('admin_all', subscribeCommand));
bot.command('notify', requirePermission('admin_all', notifyCommand));
bot.command('search', requirePermission('admin_all', searchCommand));
bot.command('chats', requirePermission('admin_all', chatsCommand));
bot.command('permit', requirePermission('admin_all', permitCommand));
bot.command('forbid', requirePermission('admin_all', forbidCommand));

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