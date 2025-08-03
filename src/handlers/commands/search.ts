import { BotContext } from '../../types/index.js';

const searchCommand = async (ctx: BotContext): Promise<void> => {
  if (!ctx.message || !('text' in ctx.message)) {
    await ctx.reply('Ошибка: сообщение не содержит текст');
    return;
  }

  const input = ctx.message.text.split(' ').slice(1); // убираем "/search"

  if (input.length === 0) {
    await ctx.reply('Укажи имя фильтра: /search <имя фильтра>');
    return;
  }

  const filterName = input.join(' ');

  // TODO: В будущем здесь нужно:
  // 1. Найти фильтр по имени через FilterManager.
  // 2. Загрузить сохранённые сообщения, связанные с этим фильтром.
  // 3. Вернуть пользователю список сообщений или файл с результатами.
  // Сейчас пока выводим заглушку для сохранения архитектуры.

  console.log(`🔍 Поиск сообщений для фильтра: ${filterName}`);

  await ctx.reply(`🔍 Поиск сообщений по фильтру "${filterName}" пока в разработке.`);
};

export default searchCommand; 