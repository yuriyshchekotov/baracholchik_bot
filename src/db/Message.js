class Message {
    constructor({ messageId, chatId, from, text, date = new Date().toISOString() }) {
        this.messageId = messageId;
        this.chatId = chatId;
        this.from = from;
        this.text = text;
        this.date = date;
    }
}

module.exports = Message;