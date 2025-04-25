class User {
    constructor({ id, filters }) {
        this.id = id;
        this.filters = filters || [];
    }

    subscribeTo(filterId) {
        if (!this.filters.includes(filterId)) {
            this.filters.push(filterId);
        }
    }

    unsubscribeFrom(filterId) {
        this.filters = this.filters.filter(id => id !== filterId);
    }

    notify(message) {
        console.log(`Notify user ${this.id}: ${message}`);
    }

    hasFilter(filterId) {
        return this.filters.includes(filterId);
    }
}

module.exports = User;