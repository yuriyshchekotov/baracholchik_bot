

const userManager = require('../../db/UserManager');

module.exports = async function unsubscribeAllCommand(ctx) {
  const userId = ctx.from.id;
  const user = userManager.getById(userId) || userManager.addUserIfNotExists(userId);

  user.filters = [];
  userManager.saveUser(user);

  await ctx.reply(
    'Вы отписались ото всех фильтров.\n' +
    'Чтобы подписаться на новые, используйте команду /subscribe.'
  );
};