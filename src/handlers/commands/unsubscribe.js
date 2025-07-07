

const userManager = require('../../db/UserManager');
const filterManager = require('../../db/FilterManager');

module.exports = async function unsubscribeCommand(ctx) {
  const userId = ctx.from.id;
  const args = ctx.message.text.split(' ').slice(1);

  if (args.length === 0) {
    return ctx.reply('Укажите хотя бы один ID или имя фильтра для отписки.\nПример: /unsubscribe 5 велосипед');
  }

  const user = userManager.getById(userId) || userManager.addUserIfNotExists(userId);

  const allUserFilters = user.filters.map(id => filterManager.getById(id)).filter(Boolean);
  const toRemove = [];

  for (const arg of args) {
    const asNumber = parseInt(arg, 10);
    if (!isNaN(asNumber)) {
      if (user.filters.includes(asNumber)) {
        toRemove.push(asNumber);
      }
    } else {
      const match = allUserFilters.find(f => f.name.toLowerCase() === arg.toLowerCase());
      if (match) {
        toRemove.push(match.id);
      }
    }
  }

  if (toRemove.length === 0) {
    return ctx.reply('Фильтры не найдены среди ваших активных подписок.');
  }

  for (const id of toRemove) {
    user.unsubscribeFrom(id);
  }

  userManager.saveUser(user);

  await ctx.reply(`Вы отписались от фильтров: ${toRemove.join(', ')}`);
};