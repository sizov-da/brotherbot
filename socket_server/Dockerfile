# Установите базовый образ Node.js
FROM node:20.6

# Установите рабочий каталог внутри образа
WORKDIR /usr/src/app

# Скопируйте файлы package.json и yarn.lock (или package-lock.json) в рабочий каталог
COPY package*.json yarn.lock ./

# Установите зависимости
RUN yarn install

# Скопируйте остальные файлы и каталоги в рабочий каталог
COPY . .

EXPOSE 3000
# Запустите приложение
CMD ["node", "cluster.js"]
