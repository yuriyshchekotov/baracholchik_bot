const fs = require('fs');
const path = require('path');
const User = require('./User');

const DB_PATH = path.join(__dirname, '../../data/users.json');

class UserManager {
    constructor() {
        this.users = [];
        this.ensureUsersFile();
        this.loadUsers();
    }

    ensureUsersFile() {
        if (!fs.existsSync(DB_PATH)) {
            fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
            fs.writeFileSync(DB_PATH, '[]', 'utf-8');
        }
    }

    loadUsers() {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        const rawUsers = JSON.parse(data);
        this.users = rawUsers.map(obj => new User(obj));
    }

    saveUsers() {
        const plain = this.users.map(user => ({
            id: user.id,
            filters: user.filters
        }));
        fs.writeFileSync(DB_PATH, JSON.stringify(plain, null, 2), 'utf-8');
    }

    getAll() {
        return this.users;
    }

    getById(id) {
        return this.users.find(user => user.id === id);
    }

    addUserIfNotExists(id) {
        let user = this.getById(id);
        if (!user) {
            user = new User({ id, filters: [] });
            this.users.push(user);
            this.saveUsers();
        }
        return user;
    }

    saveUser(user) {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            this.users[index] = user;
            this.saveUsers();
        }
    }
}

module.exports = new UserManager();