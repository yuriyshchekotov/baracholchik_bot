

import userManager from '../../db/UserManager.js';
import filterManager from '../../db/FilterManager.js';

export default async function subscriptionsCommand(ctx) {
  const userId = ctx.from.id;
  const user = userManager.getById(userId) || userManager.addUserIfNotExists(userId);
  const userFilters = user.filters;

  if (!userFilters || userFilters.length === 0) {
    return ctx.reply(
      'Активных фильтров нет.\n' +
      'Чтобы подписаться на фильтр — используйте команду /subscribe и ключевое слово.'
    );
  }

  const lines = ['Ваши активные фильтры:'];

  for (const filterId of userFilters) {
    const filter = filterManager.getById(filterId);
    if (filter) {
      lines.push(`${filter.id} — ${filter.name}`);
    } else {
      lines.push(`${filterId} — [неизвестный фильтр]`);
    }
  }

  lines.push('');
  lines.push('Чтобы подписаться на новый фильтр — используйте команду /subscribe и ключевое слово.');
  lines.push('Чтобы отписаться от всех фильтров — используйте команду /unsubscribe-all.');
  lines.push('Чтобы отписаться от конкретных фильтров — используйте команду /unsubscribe и id или имена одного или нескольких фильтров.');

  await ctx.reply(lines.join('\n'));
};