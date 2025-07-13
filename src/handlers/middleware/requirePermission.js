import UserManager from '../../db/UserManager.js';

function requirePermission(permissionName, handler) {
    return async (ctx) => {
        const userId = ctx.from?.id;
        const user = UserManager.getById(userId);
        if (!user || !user.hasPermission(permissionName)) {
            console.log(`❌ Permission denied: User ${userId} doesn't have permission '${permissionName}'`);
            await ctx.reply('У вас нет прав для выполнения этой команды 🔒');
            return;
        }
        return handler(ctx);
    };
}

export default requirePermission;