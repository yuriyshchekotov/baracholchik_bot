module.exports = [
    { command: 'start', description: 'Список доступных команд' },
    { command: 'help', description: 'Справка по командам' },
    { command: 'subscribe', description: 'Подписаться на рассылку' },
    { command: 'notify', description: 'Отправить тестовое сообщение подписчикам (для разработчиков)' },
    { command: 'search', description: 'Найти в основной базе ключевые слова. Поддерживает --and и --or, по умолчанию --or. Пример: /search -and робот пылесос робот-пылесос' }
];