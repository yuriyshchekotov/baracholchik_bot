const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/messages.json');

// Убедимся, что файл существует
function ensureDbFile() {
    if (!fs.existsSync(DB_PATH)) {
        fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
        fs.writeFileSync(DB_PATH, '[]', 'utf-8');
    }
}

// Загружаем все сообщения
function loadMessages() {
    ensureDbFile();
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
}

// Сохраняем новое сообщение
function saveMessage(msg) {
    const messages = loadMessages();
    messages.push(msg);
    fs.writeFileSync(DB_PATH, JSON.stringify(messages, null, 2), 'utf-8');
}

// Получить последние N сообщений
function getLatestMessages(count = 5) {
    const messages = loadMessages();
    return messages.slice(-count).reverse(); // последние, начиная с самого свежего
}

module.exports = {
    saveMessage,
    getLatestMessages,
};