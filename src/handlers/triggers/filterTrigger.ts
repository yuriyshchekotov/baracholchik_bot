import { BotContext } from '../../types/index.js';
import FilterManager from '../../db/FilterManager.js';
import Message from '../../db/Message.js';
import Filter from '../../db/Filter.js';
import notifyNewFilteredTrigger from './notifyNewFilteredTrigger.js';

const filterTrigger = async (ctx: BotContext, message: Message): Promise<void> => {
  if (!message || !message.text) {
    return; // Нет текста — нечего фильтровать
  }

  const matchingFilters = FilterManager.getMatching(message.text);

  if (matchingFilters.length === 0) {
    return; // Нет сработавших фильтров — дальше не идём
  }

  for (const filter of matchingFilters) {
    await notifyNewFilteredTrigger(ctx, message, filter);
  }
};

export default filterTrigger; 