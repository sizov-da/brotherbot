FROM node:20.6 as build-stage



# Установите рабочий каталог внутри образа
WORKDIR /usr/src/app

# Скопируйте файлы package.json и yarn.lock в рабочий каталог
COPY package*.json yarn.lock ./

# Установите зависимости
RUN yarn install

# Скопируйте остальные файлы и каталоги в рабочий каталог
COPY . .

# Собираем production-версию приложения
RUN yarn run build

# Используем образ Nginx для запуска приложения
FROM nginx:stable-alpine as production-stage
# Копируем собранные файлы из предыдущего этапа
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html




# Копируем конфигурацию Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80 для доступа к приложению
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
