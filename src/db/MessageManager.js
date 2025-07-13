import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Message from './Message.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../../data/messages.json');

class MessageManager {
    constructor() {
        this.messages = [];
        this.ensureDbFile();
        this.loadMessages();
    }

    ensureDbFile() {
        if (!fs.existsSync(DB_PATH)) {
            fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
            fs.writeFileSync(DB_PATH, '[]', 'utf-8');
        }
    }

    loadMessages() {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        const rawMessages = JSON.parse(data);
        this.messages = rawMessages.map(obj => new Message(obj));
    }

    saveAll() {
        const plain = this.messages.map(m => ({
            messageId: m.messageId,
            chatId: m.chatId,
            from: m.from,
            text: m.text,
            date: m.date
        }));
        fs.writeFileSync(DB_PATH, JSON.stringify(plain, null, 2), 'utf-8');
    }

    addMessage(message) {
        this.messages.push(message);
        this.saveAll();
    }

    getLatestMessages(count = 5) {
        return [...this.messages].slice(-count).reverse();
    }
}

export default new MessageManager();