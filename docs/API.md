# 📡 BrotherBot Socket.io API Документация

Этот документ описывает все Socket.io события, используемые в BrotherBot для взаимодействия между клиентом и сервером.

## 🔐 Аутентификация

### Подключение к серверу

При подключении клиент должен передать данные аутентификации:

```javascript
const socket = io("https://your-server.com", {
  auth: {
    username: "telegram_username",
    hash: "telegram_hash", 
    sessionID: "existing_session_id", // опционально
    newUser: true // для новых пользователей
  }
});
```

### События аутентификации

#### `session` (сервер → клиент)
Отправляется сервером после успешной аутентификации.

**Данные:**
```javascript
{
  sessionID: "unique_session_id",
  userID: "unique_user_id", 
  username: "telegram_username"
}
```

#### `authentication_error` (сервер → клиент)
Отправляется при ошибке аутентификации.

**Данные:** `"Invalid password"` или `"invalid username"`

---

## 👥 Управление пользователями

### `users` (сервер → клиент)
Отправляет список всех пользователей с их сообщениями.

**Данные:**
```javascript
[
  {
    userID: "user_id",
    username: "username",
    connected: true,
    messages: [
      {
        content: "Текст сообщения",
        from: "sender_user_id",
        to: "recipient_user_id",
        fromSelf: false
      }
    ]
  }
]
```

### `user connected` (сервер → клиент)
Уведомление о подключении пользователя.

**Данные:**
```javascript
{
  userID: "user_id",
  username: "username", 
  connected: true,
  messages: []
}
```

### `user disconnected` (сервер → клиент)
Уведомление об отключении пользователя.

**Данные:** `"user_id"`

---

## 💬 Сообщения

### `private message` (клиент → сервер)
Отправка приватного сообщения пользователю.

**Отправка:**
```javascript
socket.emit("private message", {
  content: "Текст сообщения",
  to: "recipient_user_id"
});
```

### `private message` (сервер → клиент)
Получение приватного сообщения.

**Данные:**
```javascript
{
  content: "Текст сообщения",
  from: "sender_user_id",
  to: "recipient_user_id"
}
```

---

## 📋 Управление задачами

### Получение задач

#### `tasks_limit_offset` (клиент → сервер)
Запрос списка задач с пагинацией.

**Отправка:**
```javascript
socket.emit("tasks_limit_offset", {
  parentTaskID: "parent_task_id", // null для корневых задач
  limit: 10,
  offset: 0
});
```

#### `tasks_limit_offset` (сервер → клиент)
Ответ со списком задач.

**Данные:**
```javascript
{
  tasks: [
    {
      taskId: "unique_task_id",
      title: "Заголовок задачи",
      description: "Описание задачи", 
      status: "pending", // pending, in-progress, completed
      parentTaskID: "parent_task_id",
      userID: "owner_user_id",
      createdAt: "2024-01-01T00:00:00.000Z",
      reports: [
        {
          reportId: "unique_report_id",
          description: "Описание работы",
          timeSpent: 120, // минуты
          cost: 1500, // рубли
          createdAt: "2024-01-01T12:00:00.000Z"
        }
      ]
    }
  ],
  total: 25 // общее количество задач
}
```

### Создание задач

#### `new task` (клиент → сервер)
Создание новой задачи (устаревший метод).

#### `create_task` (клиент → сервер)
Создание новой задачи (рекомендуемый метод).

**Отправка:**
```javascript
socket.emit("create_task", {
  title: "Заголовок задачи",
  description: "Описание задачи",
  status: "pending",
  parentTaskID: "parent_task_id", // null для корневой задачи
  userID: "owner_user_id"
});
```

#### `task_created` (сервер → клиент)
Подтверждение создания задачи.

**Данные:**
```javascript
{
  success: true,
  task: {
    taskId: "new_task_id",
    title: "Заголовок задачи",
    // ... остальные поля задачи
  }
}
```

### Обновление задач

#### `update_task` (клиент → сервер)
Обновление существующей задачи.

**Отправка:**
```javascript
socket.emit("update_task", {
  taskId: "task_id",
  title: "Новый заголовок",
  description: "Новое описание", 
  status: "in-progress"
});
```

#### `task_updated` (сервер → клиент)
Подтверждение обновления задачи.

**Данные:**
```javascript
{
  success: true,
  task: {
    taskId: "task_id",
    // ... обновленные поля
  }
}
```

### Удаление задач

#### `delete_task` (клиент → сервер)
Удаление задачи.

**Отправка:**
```javascript
socket.emit("delete_task", {
  taskId: "task_id"
});
```

#### `task_deleted` (сервер → клиент)
Подтверждение удаления задачи.

**Данные:**
```javascript
{
  success: true,
  taskId: "deleted_task_id"
}
```

---

## 🔄 Подзадачи

### `create_subtask` (клиент → сервер)
Создание подзадачи.

**Отправка:**
```javascript
socket.emit("create_subtask", {
  title: "Заголовок подзадачи",
  description: "Описание подзадачи",
  parentTaskID: "parent_task_id",
  userID: "owner_user_id"
});
```

### `subtask_created` (сервер → клиент)
Подтверждение создания подзадачи.

**Данные:**
```javascript
{
  success: true,
  subtask: {
    taskId: "subtask_id",
    // ... поля подзадачи
  }
}
```

---

## 📊 Отчеты

### Добавление отчетов

#### `add_report` (клиент → сервер)
Добавление отчета к задаче.

**Отправка:**
```javascript
socket.emit("add_report", {
  taskId: "task_id",
  description: "Описание выполненной работы",
  timeSpent: 180, // минуты
  cost: 2000, // рубли
  userID: "reporter_user_id"
});
```

#### `report_added` (сервер → клиент)
Подтверждение добавления отчета.

**Данные:**
```javascript
{
  success: true,
  report: {
    reportId: "new_report_id",
    taskId: "task_id",
    description: "Описание работы",
    timeSpent: 180,
    cost: 2000,
    createdAt: "2024-01-01T15:30:00.000Z"
  }
}
```

### Обновление отчетов

#### `update_report` (клиент → сервер)
Обновление существующего отчета.

**Отправка:**
```javascript
socket.emit("update_report", {
  reportId: "report_id",
  description: "Обновленное описание",
  timeSpent: 240,
  cost: 2500
});
```

#### `report_updated` (сервер → клиент)
Подтверждение обновления отчета.

**Данные:**
```javascript
{
  success: true,
  report: {
    reportId: "report_id",
    // ... обновленные поля
  }
}
```

### Удаление отчетов

#### `delete_report` (клиент → сервер)
Удаление отчета.

**Отправка:**
```javascript
socket.emit("delete_report", {
  reportId: "report_id"
});
```

#### `report_deleted` (сервер → клиент)
Подтверждение удаления отчета.

**Данные:**
```javascript
{
  success: true,
  reportId: "deleted_report_id"
}
```

---

## 🔍 Детали задач

### `get_task_details` (клиент → сервер)
Получение подробной информации о задаче.

**Отправка:**
```javascript
socket.emit("get_task_details", "task_id");
```

### `task_details` (сервер → клиент)
Ответ с деталями задачи.

**Данные:**
```javascript
{
  success: true,
  details: {
    task: {
      taskId: "task_id",
      title: "Заголовок",
      description: "Описание",
      status: "in-progress",
      // ... остальные поля
    },
    subtasks: [
      // массив подзадач
    ],
    reports: [
      // массив отчетов
    ],
    totalTime: 360, // общее время в минутах
    totalCost: 5000 // общая стоимость
  }
}
```

---

## ❌ Обработка ошибок

Все события могут вернуть ошибку в формате:

```javascript
{
  success: false,
  error: "Описание ошибки"
}
```

### Типичные ошибки:

- `"invalid username"` — неверное имя пользователя
- `"Invalid password"` — неверный пароль/хеш
- `"Task not found"` — задача не найдена
- `"Access denied"` — нет прав доступа
- `"Database error"` — ошибка базы данных

---

## 📝 Примеры использования

### Полный цикл работы с задачей

```javascript
// 1. Подключение
const socket = io("https://server.com", {
  auth: { username: "user", hash: "hash123" }
});

// 2. Получение сессии
socket.on("session", (session) => {
  console.log("Подключен:", session);
});

// 3. Создание задачи
socket.emit("create_task", {
  title: "Новая задача",
  description: "Описание задачи",
  status: "pending",
  userID: session.userID
});

// 4. Подтверждение создания
socket.on("task_created", (response) => {
  if (response.success) {
    const taskId = response.task.taskId;
    
    // 5. Добавление отчета
    socket.emit("add_report", {
      taskId: taskId,
      description: "Выполнена работа",
      timeSpent: 60,
      cost: 1000
    });
  }
});

// 6. Получение списка задач
socket.emit("tasks_limit_offset", {
  parentTaskID: null,
  limit: 10,
  offset: 0
});

socket.on("tasks_limit_offset", (data) => {
  console.log("Получено задач:", data.tasks.length);
  console.log("Всего задач:", data.total);
});
```

---

## 🚀 Лучшие практики

1. **Всегда проверяйте `success`** в ответах сервера
2. **Обрабатывайте ошибки** для всех операций
3. **Используйте пагинацию** для больших списков задач
4. **Кешируйте данные** на клиенте для лучшей производительности
5. **Переподключайтесь** при потере соединения
6. **Валидируйте данные** перед отправкой на сервер

