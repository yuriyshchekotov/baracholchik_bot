# 1. Базовый образ с Node.js
FROM node:20-alpine

# 2. Установим рабочую директорию
WORKDIR /app

# 3. Копируем package*.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# 4. Копируем всё остальное
COPY . .

# 5. Собираем TypeScript
RUN npm run build

# 6. Старт бота
CMD ["node", "dist/index.js"]