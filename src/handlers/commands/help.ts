import { BotContext } from '../../types/index.js';
import commands from '../../commands.js';

const helpCommand = (ctx: BotContext): void => {
  let response = 'Справка по командам:\n\n';
  commands.forEach((cmd) => {
    response += `/${cmd.command} – ${cmd.description}\n`;
  });

  ctx.reply(response);
};

export default helpCommand; 