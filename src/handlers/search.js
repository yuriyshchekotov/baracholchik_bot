const fs = require('fs');
const path = require('path');
const { loadMessages } = require('../db/messages');

module.exports = (ctx) => {
    const input = ctx.message.text.split(' ').slice(1); // убираем "/search"
    if (input.length === 0) {
        return ctx.reply('Укажи ключевые слова: /search <слова>');
    }

    let mode = 'or';
    let keywords = input;

    if (input[0] === '--and' || input[0] === '--or') {
        mode = input[0].substring(2);
        keywords = input.slice(1);
    }

    if (keywords.length === 0) {
        return ctx.reply('Укажи хотя бы одно слово для поиска');
    }

    console.log('🔍 keywords:', keywords);
    console.log('🔍 mode:', mode);

    const allMessages = loadMessages();
    console.log('🔍 allMessages count:', allMessages.length);

    const results = allMessages.filter((msg) => {
        const text = (msg.text || '').toLowerCase();
        return mode === 'and'
            ? keywords.every(word => text.includes(word))
            : keywords.some(word => text.includes(word));
    });

    console.log('🔍 matched results:', results.length);

    const outputPath = path.join(__dirname, '../../data/filtered.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');

    ctx.reply(`🔍 Найдено ${results.length} сообщений по режиму ${mode.toUpperCase()}.\nСохранено в filtered.json`);
};