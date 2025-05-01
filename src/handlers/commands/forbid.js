const UserManager = require('../../db/UserManager');

module.exports = async function forbidCommand(ctx) {
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length !== 2) {
        return ctx.reply('Использование: /forbid <userId> <permission>');
    }

    const [userIdRaw, permission] = args;
    const userId = parseInt(userIdRaw, 10);
    if (isNaN(userId)) {
        return ctx.reply('userId должен быть числом');
    }

    const user = UserManager.getById(userId);
    if (!user) {
        return ctx.reply('Пользователь не найден');
    }

    user.forbidTo(permission);
    UserManager.saveUser(user);
    ctx.reply(`❌ Право "${permission}" отозвано у пользователя ${userId}`);
};