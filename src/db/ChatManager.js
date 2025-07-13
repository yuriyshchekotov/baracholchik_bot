import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../../data/chats.json');

class ChatManager {
    constructor() {
        this.chats = [];
        this.ensureDbFile();
        this.loadChats();
    }

    ensureDbFile() {
        if (!fs.existsSync(DB_PATH)) {
            fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
            fs.writeFileSync(DB_PATH, '[]', 'utf-8');
        }
    }

    loadChats() {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        this.chats = JSON.parse(data);
    }

    saveChats() {
        fs.writeFileSync(DB_PATH, JSON.stringify(this.chats, null, 2), 'utf-8');
    }

    getById(id) {
        return this.chats.find(chat => chat.id === id);
    }

    addIfNotExists({ id, title, type }) {
        let chat = this.getById(id);
        if (!chat) {
            chat = {
                id,
                title,
                type,
                follow: true,
                joinedAt: new Date().toISOString(),
                leftAt: null
            };
            this.chats.push(chat);
            this.saveChats();
        }
        return chat;
    }

    setFollow(chatId, bool) {
        const chat = this.getById(chatId);
        if (chat) {
            chat.follow = bool;
            if (bool) {
                chat.joinedAt = new Date().toISOString();
                chat.leftAt = null;
            } else {
                chat.leftAt = new Date().toISOString();
            }
            this.saveChats();
        }
    }

    getFollowedChats() {
        return this.chats.filter(chat => chat.follow);
    }
}

export default new ChatManager();