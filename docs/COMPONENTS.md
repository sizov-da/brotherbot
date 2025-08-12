# 🧩 Документация по компонентам фронтенда BrotherBot

Этот документ описывает архитектуру и компоненты React приложения BrotherBot.

## 🏗️ Структура приложения

```
src/
├── Components/           # Основные компоненты
│   ├── AuthPage/        # Аутентификация
│   ├── BotList/         # Список задач
│   ├── Calendar/        # Календарь и графики
│   ├── settings/        # Настройки
│   ├── UserProfile/     # Профиль пользователя
│   └── react-echart/    # Компоненты графиков
├── hooks/               # Пользовательские хуки
├── Logics/             # Бизнес-логика
├── types/              # TypeScript типы
└── dev/                # Инструменты разработки
```

---

## 🎯 Основные компоненты

### 🏠 MainPage.tsx

**Назначение:** Главная страница приложения с навигацией и роутингом.

**Особенности:**
- Адаптивная навигация (боковая панель на десктопе, табы на мобильных)
- Использует VK UI Kit для интерфейса
- Поддерживает роутинг через React Router

**Структура:**
```tsx
interface MainPageProps {
  props: any; // Глобальные пропсы приложения
}
```

**Основные секции:**
- `/Bot-List` - Список задач
- `/BotCalendarPage` - Календарь задач  
- `/profile` - Профиль пользователя
- `/settings` - Настройки
- `/AuthPage` - Аутентификация

**Используемые компоненты VK UI:**
- `SplitLayout` - Адаптивная компоновка
- `Epic` - Контейнер для представлений
- `Tabbar` - Нижняя навигация на мобильных
- `Cell` - Элементы боковой панели

---

### 📋 BotList/BotList.tsx

**Назначение:** Отображение списка задач с пагинацией и управлением.

**Ключевые возможности:**
- Отображение задач в виде карточек
- Пагинация через Ant Design
- Создание, редактирование, удаление задач
- Поддержка иерархии задач (подзадачи)
- Real-time обновления через Socket.io

**Зависимости:**
- `useSocket` хук для взаимодействия с сервером
- Ant Design компоненты (Pagination, Card, Button)
- Breadcrumbs для навигации по иерархии

**Основные функции:**
```tsx
const BotList = ({ props }: BotListProps) => {
  // Получение данных через useSocket
  const {
    tasksList,
    currentPage,
    totalPages,
    handleChange,
    createTask,
    deleteTask,
    updateTask
  } = useSocket(props);
  
  // Рендер списка задач
}
```

---

### 📅 Calendar/BotCalendarPage.tsx

**Назначение:** Календарное представление задач с визуализацией данных.

**Компоненты:**
- `CalendarModule` - Основной календарь
- `EcharGraph` - Графики и диаграммы
- `EcharCalendar` - Календарь на основе ECharts

**Особенности:**
- Интеграция с ECharts для графиков
- Отображение задач по датам
- Различные типы визуализации (календарь, графики)

---

### 🔐 AuthPage/AuthPage.tsx

**Назначение:** Страница аутентификации через Telegram.

**Возможности:**
- Telegram Login Widget
- Обработка данных аутентификации
- Сохранение сессии в localStorage
- Перенаправление после успешного входа

**Интеграция:**
```tsx
import { TelegramAuth } from '@telegram-auth/react';

const AuthPage = ({ props }: AuthPageProps) => {
  const handleTelegramAuth = (user: TelegramUser) => {
    // Обработка данных пользователя
    socket.emit('authenticate', user);
  };
}
```

---

### 👤 UserProfile/UserProfile.tsx

**Назначение:** Отображение и редактирование профиля пользователя.

**Функции:**
- Отображение информации пользователя
- Статистика по задачам
- Настройки профиля
- История активности

---

### ⚙️ settings/SettingPage.tsx

**Назначение:** Страница настроек приложения.

**Включает:**
- Настройки уведомлений
- Настройки темы
- Языковые настройки
- Настройки синхронизации

**Подкомпоненты:**
- `MassagesListIhUser` - Список сообщений пользователя

---

## 🔧 Хуки и логика

### 🌐 hooks/useSocket.ts

**Назначение:** Основной хук для взаимодействия с Socket.io сервером.

**Возвращаемые значения:**
```tsx
interface UseSocketReturn {
  // Пользователи
  users: User[];
  selectedUser: User | null;
  thisUserID: string;
  
  // Сообщения
  selectUserMassages: Message[];
  sendMassage: (content: string) => void;
  
  // Задачи
  tasksList: Task[];
  totalPages: number;
  currentPage: number;
  limit: number;
  offset: number;
  
  // Функции управления задачами
  createTask: (task: TaskData) => void;
  updateTask: (task: TaskData) => void;
  deleteTask: (taskId: string) => void;
  sendNewTask: () => void;
  
  // Отчеты
  reportList: Report[];
  addReportToTask: (report: ReportData) => void;
  updateReport: (report: ReportData) => void;
  deleteReport: (reportId: string) => void;
  
  // Пагинация
  handleChange: (page: number) => void;
  setCurrentPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setOffset: (offset: number) => void;
  
  // Аутентификация
  onUsernameSelection: (username: string, hash: string) => void;
  usernameAlreadySelected: boolean;
  setUsernameAlreadySelected: (selected: boolean) => void;
  
  // UI состояние
  text: string;
  setText: (text: string) => void;
  isAttachmentsShown: boolean;
  setIsAttachmentsShown: (shown: boolean) => void;
}
```

**Основные блоки логики:**

#### 🔐 Блок аутентификации
```tsx
// Управление сессией
const [sessionID, setSessionID] = useState<string | null>(null);
const [userID, setUserID] = useState<string>("");
const [username, setUsername] = useState<string>("");

// Подключение к серверу
const socket = io(SERVER_URL, {
  auth: {
    username: inputLoginData,
    hash: inputPasswordDataData,
    sessionID: sessionID,
    newUser: !usernameAlreadySelected
  }
});
```

#### 👥 Блок пользователей
```tsx
// Обработка списка пользователей
socket.on("users", (socketUsers) => {
  setUsers(socketUsers);
});

// Подключение/отключение пользователей
socket.on("user connected", (socketConnectedUser) => {
  // Обновление статуса пользователя
});

socket.on("user disconnected", (id) => {
  // Обновление статуса отключения
});
```

#### 📋 Блок задач
```tsx
// Получение задач с пагинацией
const getTasksWithPagination = (parentTaskID = null, limit = 10, offset = 0) => {
  socket.emit("tasks_limit_offset", { parentTaskID, limit, offset });
};

// Обработка ответа сервера
socket.on("tasks_limit_offset", ({ tasks, total }) => {
  setTasksList(tasks);
  setTotalPages(Math.ceil(total / limit));
});

// CRUD операции
const createTask = (taskData) => {
  socket.emit("create_task", taskData);
};

const updateTask = (taskData) => {
  socket.emit("update_task", taskData);
};

const deleteTask = (taskId) => {
  socket.emit("delete_task", { taskId });
};
```

---

### 🔌 Logics/socket.js

**Назначение:** Дополнительная логика для работы с Socket.io (устаревший файл).

---

## 📊 Компоненты графиков

### 📈 react-echart/

**Назначение:** Обертки для интеграции ECharts с React.

**Файлы:**
- `core.js` - Основная логика ECharts
- `index.js` - Экспорт компонентов

**Использование:**
```jsx
import { EChartsReact } from './react-echart';

const ChartComponent = ({ data }) => {
  const option = {
    title: { text: 'Статистика задач' },
    xAxis: { type: 'category', data: data.categories },
    yAxis: { type: 'value' },
    series: [{ data: data.values, type: 'bar' }]
  };

  return <EChartsReact option={option} />;
};
```

---

## 🎨 Стилизация и темы

### 📱 Адаптивный дизайн

Приложение использует VK UI Kit для обеспечения адаптивности:

```tsx
const { viewWidth } = useAdaptivityConditionalRender();

// Условный рендеринг для разных размеров экрана
{viewWidth.tabletPlus && (
  <SplitCol className={viewWidth.tabletPlus.className}>
    {/* Контент для планшетов и десктопа */}
  </SplitCol>
)}

{viewWidth.tabletMinus && (
  <Tabbar className={viewWidth.tabletMinus.className}>
    {/* Нижняя навигация для мобильных */}
  </Tabbar>
)}
```

### 🎨 Кастомные стили

```tsx
const activeStoryStyles = {
  backgroundColor: 'var(--vkui--color_background_secondary)',
  borderRadius: 8,
};
```

---

## 🔄 Управление состоянием

### 📊 Локальное состояние

Компоненты используют React hooks для управления состоянием:

```tsx
// Основное состояние приложения
const [activeStory, setActiveStory] = useState(location.pathname);
const [users, setUsers] = useState<User[]>([]);
const [tasksList, setTasksList] = useState<Task[]>([]);
const [currentPage, setCurrentPage] = useState(1);
```

### 🔄 Real-time обновления

Состояние автоматически обновляется через Socket.io события:

```tsx
useEffect(() => {
  socket.on("task_created", (response) => {
    if (response.success) {
      // Обновление списка задач
      getTasksWithPagination();
    }
  });

  socket.on("task_updated", (response) => {
    if (response.success) {
      // Обновление конкретной задачи
      updateTaskInList(response.task);
    }
  });

  return () => {
    socket.off("task_created");
    socket.off("task_updated");
  };
}, []);
```

---

## 📱 PWA функциональность

### 🔧 Service Worker

Приложение поддерживает PWA через Service Workers:

```tsx
// serviceWorkerRegistration.ts
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

export function register(config?: Config) {
  if ('serviceWorker' in navigator) {
    // Регистрация Service Worker
  }
}
```

### 📋 Manifest

```json
{
  "short_name": "BrotherBot",
  "name": "BrotherBot Task Manager",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

---

## 🧪 Инструменты разработки

### 🎨 dev/palette.tsx

React Buddy палитра компонентов для разработки:

```tsx
export const PaletteTree = () => (
  <Category name="App">
    <Component name="MainPage">
      <Variant name="default">
        <MainPage props={{}} />
      </Variant>
    </Component>
  </Category>
);
```

### 🔍 dev/previews.tsx

Превью компонентов для разработки и тестирования.

---

## 📋 TypeScript типы

### 🏷️ types/country-code-lookup/index.d.ts

Дополнительные типы для внешних библиотек:

```typescript
declare module 'country-code-lookup' {
  interface Country {
    country: string;
    iso2: string;
    iso3: string;
    // ... другие поля
  }
  
  export function byIso(iso: string): Country | null;
}
```

---

## 🔧 Лучшие практики

### 1. **Структура компонентов**
```tsx
// Хорошо: четкое разделение логики и представления
const Component = ({ props }) => {
  const logic = useCustomHook(props);
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### 2. **Обработка ошибок**
```tsx
socket.on("task_created", (response) => {
  if (response.success) {
    // Успешное выполнение
  } else {
    console.error("Ошибка создания задачи:", response.error);
    // Показать уведомление пользователю
  }
});
```

### 3. **Очистка подписок**
```tsx
useEffect(() => {
  const handleEvent = (data) => {
    // Обработка события
  };
  
  socket.on("event", handleEvent);
  
  return () => {
    socket.off("event", handleEvent);
  };
}, []);
```

### 4. **Типизация**
```tsx
interface TaskProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskComponent: React.FC<TaskProps> = ({ task, onUpdate, onDelete }) => {
  // Компонент с типизацией
};
```

---

## 🚀 Развертывание

### 📦 Сборка для продакшена

```bash
cd frontend
npm run build
```

### 🌐 Статические файлы

Собранное приложение помещается в папку `build/` и может быть развернуто на любом веб-сервере.

### 🔧 Конфигурация

Настройки для разных окружений:

```tsx
const config = {
  development: {
    socketUrl: 'http://localhost:3000',
    apiUrl: 'http://localhost:3000/api'
  },
  production: {
    socketUrl: 'https://your-domain.com',
    apiUrl: 'https://your-domain.com/api'
  }
};

export default config[process.env.NODE_ENV || 'development'];
```

---

## 🐛 Отладка

### 🔍 Инструменты разработки

Приложение включает Eruda для отладки на мобильных устройствах:

```tsx
// eruda.ts
import eruda from 'eruda';
import erudaCode from 'eruda-code';
import erudaDom from 'eruda-dom';

if (process.env.NODE_ENV === 'development') {
  eruda.init();
  eruda.add(erudaCode);
  eruda.add(erudaDom);
}
```

### 📊 Логирование

```tsx
// Логирование Socket.io событий
socket.onAny((event, ...args) => {
  console.log(`Socket event: ${event}`, args);
});

// Логирование ошибок компонентов
const ErrorBoundary = ({ children }) => {
  // Обработка ошибок React компонентов
};
```

---

Эта документация поможет разработчикам быстро понять архитектуру фронтенда и начать работу с компонентами BrotherBot.
