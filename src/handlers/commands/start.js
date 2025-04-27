const commands = require('../../commands');

module.exports = (ctx) => {
    let response = 'Доступные команды:\n\n';
    commands.forEach((cmd) => {
        response += `/${cmd.command} – ${cmd.description}\n`;
    });

    ctx.reply(response);
};