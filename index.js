require('dotenv').config();
const bot = require('./src/bot');
const commands = require('./src/commands');

bot.launch().then(() => {
    bot.telegram.setMyCommands(commands);
    console.log('Бот запущен...');
});