const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/recipients.json');

function ensureRecipientsFile() {
    if (!fs.existsSync(DB_PATH)) {
        fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
        fs.writeFileSync(DB_PATH, '[]', 'utf-8');
    }
}

function getRecipients() {
    ensureRecipientsFile();
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
}

function addRecipient(chatId) {
    const recipients = getRecipients();
    if (!recipients.includes(chatId)) {
        recipients.push(chatId);
        fs.writeFileSync(DB_PATH, JSON.stringify(recipients, null, 2), 'utf-8');
        return true;
    }
    return false;
}

module.exports = {
    getRecipients,
    addRecipient,
};