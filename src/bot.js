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
const subscriptionsCommand = require('./handlers/commands/subscriptions');
const unsubscribeCommand = require('./handlers/commands/unsubscribe');
const unsubscribeAllCommand = require('./handlers/commands/unsubscribe-all');
const messageEventHandler = require('./handlers/events/message');
const requirePermission = require('./handlers/middleware/requirePermission');

const bot = new Telegraf(process.env.BOT_TOKEN);
console.log('🤖 Бот инициализирован');

// --- Команды и требуемые для них права доступа ---
bot.command('start', requirePermission('admin_all',startCommand));
bot.command('help', requirePermission('admin_all',helpCommand));
bot.command('subscriptions', subscriptionsCommand);
bot.command('subscribe', requirePermission('admin_all', subscribeCommand));
bot.command('unsubscribe', requirePermission('admin_all', unsubscribeCommand));
bot.command('unsubscribe-all', requirePermission('admin_all', unsubscribeAllCommand));
bot.command('notify', requirePermission('admin_all', notifyCommand));
bot.command('search', requirePermission('admin_all', searchCommand));
bot.command('chats', requirePermission('admin_all', chatsCommand));
bot.command('permit', requirePermission('admin_all', permitCommand));
bot.command('forbid', requirePermission('admin_all', forbidCommand));

// --- Обработка неизвестных команд ---
bot.on(message('text'), async (ctx, next) => {
    console.log(`📥 Получено текстовое сообщение: ${ctx.message.text}`);
    const text = ctx.message.text;
    const knownCommands = [
      'start', 'help', 'subscribe', 'unsubscribe', 'unsubscribe-all', 'subscriptions',
      'notify', 'search', 'chats', 'permit', 'forbid'
    ];
    const command = text.split(' ')[0].substring(1);

    if (text.startsWith('/') && !knownCommands.includes(command)) {
        await ctx.reply('Команда не распознана 🤷‍♂️');
        return;
    }

    await next();
});

// --- Обработка событий ---
bot.on(message('text'), messageEventHandler);
bot.on('my_chat_member', require('./handlers/events/myChatMember'));

console.log('📦 Команды загружены и обработчики установлены');
bot.on('message', (ctx) => {
    console.log('📨 Поймано событие message:', ctx.message);
});
module.exports = bot;