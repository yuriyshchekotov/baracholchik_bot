import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

import { BotContext, HandlerFunction } from './types/index.js';
import startCommand from './handlers/commands/start.js';
import helpCommand from './handlers/commands/help.js';
import subscribeCommand from './handlers/commands/subscribe.js';
import notifyCommand from './handlers/commands/notify.js';
import searchCommand from './handlers/commands/search.js';
import chatsCommand from './handlers/commands/chats.js';
import permitCommand from './handlers/commands/permit.js';
import forbidCommand from './handlers/commands/forbid.js';
import subscriptionsCommand from './handlers/commands/subscriptions.js';
import unsubscribeCommand from './handlers/commands/unsubscribe.js';
import unsubscribeAllCommand from './handlers/commands/unsubscribe-all.js';
import messageEventHandler from './handlers/events/message.js';
import myChatMemberHandler from './handlers/events/myChatMember.js';
import requirePermission from './handlers/middleware/requirePermission.js';

const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN!);
console.log('🤖 Бот инициализирован');

// --- Команды и требуемые для них права доступа ---
bot.command('start', requirePermission('admin_all', startCommand));
bot.command('help', requirePermission('admin_all', helpCommand));
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
bot.on('my_chat_member', myChatMemberHandler);

console.log('📦 Команды загружены и обработчики установлены');
bot.on('message', (ctx) => {
  console.log('📨 Поймано событие message:', ctx.message);
});

export default bot; 