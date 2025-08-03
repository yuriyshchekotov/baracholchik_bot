import type { Command } from './types';

const commands: Command[] = [
    { command: 'start', description: 'Список доступных команд' },
    { command: 'help', description: 'Справка по командам' },
    { command: 'subscribe', description: 'Подписаться на рассылку' },
    { command: 'notify', description: 'Отправить тестовое сообщение подписчикам (для разработчиков)' },
    { command: 'search', description: 'Найти в основной базе ключевые слова. Поддерживает --and и --or, по умолчанию --or. Пример: /search -and робот пылесос робот-пылесос' },
    { command: 'subscriptions', description: 'Посмотреть список активных фильтров-подписок' },
    { command: 'unsubscribe', description: 'Отписаться от одного или нескольких фильтров по ID или имени' },
    { command: 'unsubscribe-all', description: 'Отписаться ото всех фильтров' }
];

export default commands; 