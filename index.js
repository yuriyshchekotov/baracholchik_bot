import 'dotenv/config';
import bot from './src/bot.js';
import commands from './src/commands.js';

console.log('🔑 BOT_TOKEN =', process.env.BOT_TOKEN ? '[OK]' : '[MISSING]');

bot.telegram.getMe()
  .then(info => {
    console.log('👤 Информация о боте:', info);
  })
  .catch(err => {
    console.error('❌ Не удалось получить информацию о боте:', err);
  });

bot.catch((err, ctx) => {
  console.error('❗ Ошибка в обработке:', err);
});

bot.launch()
  .then(() => {
    bot.telegram.setMyCommands(commands);
    console.log('🚀 Бот запущен и слушает события');
  })
  .catch(err => {
    console.error('❌ Ошибка при запуске бота:', err);
  });
