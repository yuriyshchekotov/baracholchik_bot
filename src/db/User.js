class User {
    constructor({ id, filters, permissions }) {
        this.id = id;
        this.filters = filters || [];
        this.permissions = permissions || [];
    }

    subscribeTo(filterId) {
        if (!this.filters.includes(filterId)) {
            this.filters.push(filterId);
        }
    }

    unsubscribeFrom(filterId) {
        this.filters = this.filters.filter(id => id !== filterId);
    }

    async notify(ctx, message) {
        console.log(`Notify user ${this.id}: ${message}`);
        await ctx.telegram.sendMessage(this.id, message);
    }

    hasFilter(filterId) {
        return this.filters.includes(filterId);
    }

    permitTo(permissionName) {
        if (!this.permissions.includes(permissionName)) {
            this.permissions.push(permissionName);
        }
    }

    forbidTo(permissionName) {
        this.permissions = this.permissions.filter(p => p !== permissionName);
    }

    hasPermission(permissionName) {
        return this.permissions.includes(permissionName);
    }
}

module.exports = User;