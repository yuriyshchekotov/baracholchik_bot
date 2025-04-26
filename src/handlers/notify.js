const userManager = require('../db/UserManager');
const filterManager = require('../db/FilterManager');

module.exports = async (ctx) => {
    const messageText = ctx.message?.text;
    if (!messageText) {
        return ctx.reply('Сообщение пустое или не текстовое.');
    }

    const matchingFilters = filterManager.getMatching(messageText);
    if (matchingFilters.length === 0) {
        return ctx.reply('Нет совпадений ни с одним фильтром.');
    }

    const matchingFilterIds = matchingFilters.map(f => f.id);
    const users = userManager.getAll();

    const recipients = users.filter(user =>
        user.filters.some(filterId => matchingFilterIds.includes(filterId))
    );

    if (recipients.length === 0) {
        return ctx.reply('Нет подписчиков для подходящих фильтров.');
    }

    const results = await Promise.allSettled(
        recipients.map(user =>
            ctx.telegram.sendMessage(user.id, `Найдено новое сообщение: ${messageText}`)
        )
    );

    const failed = results
        .map((r, i) => ({ status: r.status, reason: r.reason, chatId: recipients[i].id }))
        .filter(r => r.status === 'rejected');

    if (failed.length > 0) {
        console.log('❌ Ошибки при рассылке:');
        failed.forEach(f =>
            console.log(`- chatId ${f.chatId}: ${f.reason?.description || f.reason?.message || 'unknown error'}`)
        );
    }

    ctx.reply(`Рассылка завершена. Сообщение отправлено ${recipients.length} пользователям, с ошибками: ${failed.length}`);
};