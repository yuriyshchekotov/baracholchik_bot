import userManager from '../../db/UserManager.js';
import filterManager from '../../db/FilterManager.js';

function generateFilterName(keywords, conjunction) {
    if (keywords.length === 1) return keywords[0];
    const joiner = conjunction ? ' И ' : ' ИЛИ ';
    return keywords.join(joiner);
}

function isSameFilter(f1, f2) {
    if (f1.conjunction !== f2.conjunction) return false;

    const a = new Set(f1.keywords.map(k => k.toLowerCase()));
    const b = new Set(f2.keywords.map(k => k.toLowerCase()));

    if (a.size !== b.size) return false;

    for (const word of a) {
        if (!b.has(word)) return false;
    }

    return true;
}

export default async function subscribeCommand(ctx) {
    const text = ctx.message.text;
    const parts = text.split(' ').slice(1); // отрезаем "/subscribe"

    if (parts.length === 0) {
        return ctx.reply('Укажи ключевые слова, например: /subscribe вакансия удалёнка -and');
    }

    const conjunction = parts.includes('-and');
    const keywords = parts.filter(p => p !== '-and');

    if (keywords.length === 0) {
        return ctx.reply('Нужно указать хотя бы одно ключевое слово.');
    }

    const userId = ctx.chat.id;
    const user = userManager.addUserIfNotExists(userId);
    const userFilters = user.filters
        .map(id => filterManager.getById(id))
        .filter(Boolean);

    const candidate = { keywords, conjunction };
    const alreadyHas = userFilters.some(f => isSameFilter(f, candidate));

    if (alreadyHas) {
        return ctx.reply('Ты уже подписан на такой фильтр.');
    }

    const name = generateFilterName(keywords, conjunction);
    const newFilter = filterManager.addFilter({
        name,
        keywords,
        conjunction,
        regex: []
    });

    user.subscribeTo(newFilter.id);
    userManager.saveUser(user);

    return ctx.reply(`Фильтр "${name}" создан и добавлен в твою подписку.`);
};