import { BotContext } from '../../types/index.js';
import commands from '../../commands.js';

const startCommand = (ctx: BotContext): void => {
  let response = 'Доступные команды:\n\n';
  commands.forEach((cmd) => {
    response += `/${cmd.command} – ${cmd.description}\n`;
  });

  ctx.reply(response);
};

export default startCommand; 