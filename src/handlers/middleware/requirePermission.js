const UserManager = require('../../db/UserManager');

function requirePermission(permissionName, handler) {
    return async (ctx) => {
        const userId = ctx.from?.id;
        const user = UserManager.getById(userId);
        if (!user || !user.hasPermission(permissionName)) return;
        return handler(ctx);
    };
}

module.exports = requirePermission;