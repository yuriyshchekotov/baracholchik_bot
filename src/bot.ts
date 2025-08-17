import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

import type { BotContext, HandlerFunction } from './types';
import startCommand from './handlers/commands/start';
import helpCommand from './handlers/commands/help';
import subscribeCommand from './handlers/commands/subscribe';
import notifyCommand from './handlers/commands/notify';
import searchCommand from './handlers/commands/search';
import chatsCommand from './handlers/commands/chats';
import permitCommand from './handlers/commands/permit';
import forbidCommand from './handlers/commands/forbid';
import subscriptionsCommand from './handlers/commands/subscriptions';
import unsubscribeCommand from './handlers/commands/unsubscribe';
import unsubscribeAllCommand from './handlers/commands/unsubscribe-all';
import messageEventHandler from './handlers/events/message';
import myChatMemberHandler from './handlers/events/myChatMember';
import requirePermission from './handlers/middleware/requirePermission';

const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN!);
console.log('🤖 Бот инициализирован');

// --- Команды и требуемые для них права доступа ---
bot.command('start', requirePermission('user_casual', startCommand));
bot.command('help', requirePermission('user_casual', helpCommand));
bot.command('subscriptions', requirePermission('user_casual', subscriptionsCommand));
bot.command('subscribe', requirePermission('user_casual', subscribeCommand));
bot.command('unsubscribe', requirePermission('user_casual', unsubscribeCommand));
bot.command('unsubscribe-all', requirePermission('user_casual', unsubscribeAllCommand));
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