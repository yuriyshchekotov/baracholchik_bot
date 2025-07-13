const commands = require('../../commands');

module.exports = (ctx) => {
    let response = 'Бот создан для получения отфильтрованной информации из телеграм-чатов (например, групп с объявлениями) \n\n Внимание! Бот находится в альфа-версии, возможны сбои \n\nДоступные команды:\n\n';
    commands.forEach((cmd) => {
        response += `/${cmd.command} – ${cmd.description}\n`;
    });

    ctx.reply(response);
};