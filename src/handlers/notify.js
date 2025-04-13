const { getRecipients } = require('../db/recipients');

module.exports = async (ctx) => {
    const recipients = getRecipients();

    const results = await Promise.allSettled(
        recipients.map(chatId =>
            ctx.telegram.sendMessage(chatId, 'test message... will be replaced to real data later')
        )
    );

    const failed = results
        .map((r, i) => ({ status: r.status, reason: r.reason, chatId: recipients[i] }))
        .filter(r => r.status === 'rejected');

    if (failed.length > 0) {
        console.log('❌ Ошибки при рассылке:');
        failed.forEach(f =>
            console.log(`- chatId ${f.chatId}: ${f.reason?.description || f.reason?.message || 'unknown error'}`)
        );
    }

    ctx.reply(`Рассылка завершена. Всего: ${recipients.length}, с ошибками: ${failed.length}`);
};