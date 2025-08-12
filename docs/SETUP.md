# 🚀 Руководство по установке и настройке BrotherBot

Это подробное руководство поможет вам настроить и запустить BrotherBot на вашем сервере или локальной машине.

## 📋 Предварительные требования

### Системные требования

- **Node.js** 16.0 или выше
- **npm** или **yarn** 
- **Docker** и **Docker Compose** (рекомендуется)
- **Git** для клонирования репозитория

### Для продакшена дополнительно:

- **SSL сертификаты** (Let's Encrypt рекомендуется)
- **Домен** для HTTPS соединения
- **Telegram Bot Token** (получить у @BotFather)

---

## 🏠 Локальная разработка

### 1. Клонирование репозитория

```bash
git clone https://github.com/your-username/brotherbot.git
cd brotherbot
```

### 2. Установка зависимостей

#### Backend (Socket Server)
```bash
cd socket_server
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

### 3. Настройка базы данных

#### Запуск ArangoDB через Docker
```bash
cd ../db
docker-compose up -d
```

ArangoDB будет доступна по адресу: `http://localhost:8529`

**Учетные данные по умолчанию:**
- Пользователь: `root`
- Пароль: (пустой при первом запуске)

### 4. Конфигурация переменных окружения

Создайте файл `.env` в корне проекта:

```bash
# .env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=8529
DB_NAME=brotherbot
BOT_TOKEN=your_telegram_bot_token
```

### 5. Запуск сервисов

#### Запуск Backend
```bash
cd socket_server
npm start
```

#### Запуск Frontend (в новом терминале)
```bash
cd frontend
npm start
```

### 6. Доступ к приложению

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3000 (Socket.io)
- **ArangoDB**: http://localhost:8529

---

## 🐳 Запуск через Docker

### 1. Быстрый старт

```bash
# Клонирование репозитория
git clone https://github.com/your-username/brotherbot.git
cd brotherbot

# Запуск всех сервисов
docker-compose up -d
```

### 2. Проверка статуса

```bash
docker-compose ps
```

### 3. Просмотр логов

```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f socket_server
docker-compose logs -f frontend
```

### 4. Остановка сервисов

```bash
docker-compose down
```

---

## 🌐 Продакшн развертывание

### 1. Подготовка сервера

#### Обновление системы (Ubuntu/Debian)
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx
```

#### Установка Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Установка Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### 2. Настройка SSL сертификатов

#### Получение сертификатов Let's Encrypt
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

#### Автоматическое обновление сертификатов
```bash
sudo crontab -e
# Добавьте строку:
0 12 * * * /usr/bin/certbot renew --quiet
```

### 3. Конфигурация Nginx

Создайте файл `/etc/nginx/sites-available/brotherbot`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.io Backend
    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Активируйте конфигурацию:
```bash
sudo ln -s /etc/nginx/sites-available/brotherbot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Настройка переменных окружения

Создайте файл `.env.production`:

```bash
NODE_ENV=production
PORT=3000
FRONTEND_PORT=3001
DB_HOST=localhost
DB_PORT=8529
DB_NAME=brotherbot_prod
BOT_TOKEN=your_production_bot_token
SSL_KEY_PATH=/etc/letsencrypt/live/your-domain.com/privkey.pem
SSL_CERT_PATH=/etc/letsencrypt/live/your-domain.com/fullchain.pem
SSL_CA_PATH=/etc/letsencrypt/live/your-domain.com/chain.pem
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

### 5. Обновление конфигурации SSL в коде

Отредактируйте `socket_server/index.js`:

```javascript
const httpsOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH),
    ca: fs.readFileSync(process.env.SSL_CA_PATH)
};

const io = require("socket.io")(httpsServer, {
    cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || "*",
        methods: ["GET", "POST"],
        credentials: true
    },
});
```

### 6. Создание systemd сервисов

#### Backend сервис
Создайте файл `/etc/systemd/system/brotherbot-backend.service`:

```ini
[Unit]
Description=BrotherBot Backend Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/brotherbot/socket_server
Environment=NODE_ENV=production
ExecStart=/usr/bin/node cluster.js
Restart=on-failure
RestartSec=10
KillMode=process

[Install]
WantedBy=multi-user.target
```

#### Активация сервиса
```bash
sudo systemctl daemon-reload
sudo systemctl enable brotherbot-backend
sudo systemctl start brotherbot-backend
sudo systemctl status brotherbot-backend
```

### 7. Настройка мониторинга

#### Установка PM2 (альтернатива systemd)
```bash
sudo npm install -g pm2

# Запуск приложения
cd /var/www/brotherbot/socket_server
pm2 start cluster.js --name "brotherbot-backend"

# Автозапуск при перезагрузке
pm2 startup
pm2 save
```

---

## 🔧 Настройка Telegram Bot

### 1. Создание бота

1. Напишите @BotFather в Telegram
2. Отправьте `/newbot`
3. Следуйте инструкциям для создания бота
4. Сохраните полученный токен

### 2. Настройка команд бота

Отправьте @BotFather команду `/setcommands` и добавьте:

```
start - Начать работу с ботом
help - Помощь по использованию
login - Войти в веб-приложение
tasks - Показать мои задачи
```

### 3. Настройка веб-приложения

Отправьте @BotFather команду `/setmenubutton` и укажите URL вашего приложения:
```
https://your-domain.com
```

---

## 🔍 Диагностика и устранение неполадок

### Проверка статуса сервисов

```bash
# Docker
docker-compose ps
docker-compose logs service_name

# Systemd
sudo systemctl status brotherbot-backend
sudo journalctl -u brotherbot-backend -f

# PM2
pm2 status
pm2 logs brotherbot-backend
```

### Проверка подключений

```bash
# Проверка портов
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :3001
sudo netstat -tlnp | grep :8529

# Проверка SSL сертификатов
openssl s_client -connect your-domain.com:443 -servername your-domain.com
```

### Проверка базы данных

```bash
# Подключение к ArangoDB
curl -X GET http://localhost:8529/_api/version

# Проверка коллекций
curl -X GET http://localhost:8529/_api/collection
```

### Типичные проблемы

#### 1. CORS ошибки
Убедитесь, что домен добавлен в `ALLOWED_ORIGINS`

#### 2. SSL сертификаты
Проверьте пути к сертификатам и права доступа:
```bash
sudo ls -la /etc/letsencrypt/live/your-domain.com/
```

#### 3. База данных недоступна
Проверьте статус ArangoDB:
```bash
docker-compose logs db
```

#### 4. Socket.io подключение не работает
Проверьте настройки Nginx и firewall:
```bash
sudo ufw status
sudo nginx -t
```

---

## 🔄 Обновление приложения

### 1. Резервное копирование

```bash
# Резервная копия базы данных
docker exec arango_container arangodump --server.endpoint tcp://127.0.0.1:8529 --output-directory /backup

# Резервная копия кода
cp -r /var/www/brotherbot /var/www/brotherbot_backup_$(date +%Y%m%d)
```

### 2. Обновление кода

```bash
cd /var/www/brotherbot
git pull origin main
```

### 3. Обновление зависимостей

```bash
cd socket_server
npm install

cd ../frontend
npm install
npm run build
```

### 4. Перезапуск сервисов

```bash
# Docker
docker-compose restart

# Systemd
sudo systemctl restart brotherbot-backend

# PM2
pm2 restart brotherbot-backend
```

---

## 📊 Мониторинг производительности

### Настройка логирования

Добавьте в `socket_server/index.js`:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Мониторинг ресурсов

```bash
# Использование ресурсов
htop
df -h
free -h

# Мониторинг Docker
docker stats

# Логи Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🛡️ Безопасность

### 1. Настройка firewall

```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 8529 # только для разработки
```

### 2. Обновление системы

```bash
# Автоматические обновления безопасности
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 3. Ограничение доступа к базе данных

Настройте ArangoDB для доступа только с localhost:

```javascript
// arangodb.conf
[server]
endpoint = tcp://127.0.0.1:8529
```

---

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи сервисов
2. Убедитесь в правильности конфигурации
3. Проверьте статус всех компонентов
4. Создайте issue в репозитории с описанием проблемы

**Полезные команды для сбора информации:**

```bash
# Системная информация
uname -a
node --version
npm --version
docker --version

# Статус сервисов
systemctl status brotherbot-backend
docker-compose ps

# Логи
journalctl -u brotherbot-backend --since "1 hour ago"
```
