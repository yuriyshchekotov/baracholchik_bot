import filterManager from '../../db/FilterManager.js';
import notifyNewFilteredTrigger from './notifyNewFilteredTrigger.js';

export default async function filterTrigger(ctx, message) {
    if (!message || !message.text) {
        return; // Нет текста — нечего фильтровать
    }

    const matchingFilters = filterManager.getMatching(message.text);

    if (matchingFilters.length === 0) {
        return; // Нет сработавших фильтров — дальше не идём
    }

    for (const filter of matchingFilters) {
        await notifyNewFilteredTrigger(ctx, message, filter);
    }
};