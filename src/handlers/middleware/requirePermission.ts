import type { BotContext, HandlerFunction, MiddlewareFunction } from '../../types';
import UserManager from '../../db/UserManager';

const requirePermission: MiddlewareFunction = (permissionName: string, handler: HandlerFunction) => {
  return async (ctx: BotContext) => {
    const userId = ctx.from?.id;
    if (!userId) {
      console.log('❌ No user ID found in context');
      await ctx.reply('Ошибка: не удалось определить пользователя');
      return;
    }

    const user = UserManager.getById(userId);
    if (!user || !user.hasPermission(permissionName)) {
      console.log(`❌ Permission denied: User ${userId} doesn't have permission '${permissionName}'`);
      await ctx.reply('У вас нет прав для выполнения этой команды 🔒');
      return;
    }
    return handler(ctx);
  };
};

export default requirePermission; 