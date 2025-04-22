import React, { useEffect, useState } from 'react';
import socket from "../Logics/socket";
import { v4 as uuidv4 } from 'uuid';

// Типизация для входных данных хука
type useSocketPropsType = {
    globalProps: {
        user: {
            login: string;
            uid: string;
        };
    };
} | undefined;
// Определяем тип задачи
type TaskType = {
    _id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
};
// Константы для сообщений об ошибках
const ERROR_MESSAGES = {
    INVALID_USERNAME: "invalid username",
    INVALID_PASSWORD: "Invalid password"
};

/**
 * Хук `useSocket` предназначен для управления взаимодействием с сервером через WebSocket.
 * Он обеспечивает функциональность для работы с пользователями, задачами, сообщениями и сессиями.
 *
 * Основные возможности:
 * - Управление сессией пользователя (создание, подключение, аутентификация).
 * - Работа с пользователями (получение списка, подключение/отключение, выбор пользователя).
 * - Обмен сообщениями между пользователями.
 * - Управление задачами и отчетами (создание, получение, добавление).
 * - Поддержка пагинации для списка задач.
 *
 * Входные параметры:
 * @param {useSocketPropsType} props - Объект с глобальными свойствами, содержащий данные о текущем пользователе.
 *
 * Возвращаемые значения:
 * - `users` - Список всех пользователей, подключенных через сокет.
 * - `selectedUser` - Текущий выбранный пользователь.
 * - `selectUserMassages` - Сообщения, связанные с выбранным пользователем.
 * - `thisUserID` - ID текущего пользователя.
 * - `sendMassage` - Функция для отправки сообщения выбранному пользователю.
 * - `selectedUser2` - Функция для выбора пользователя.
 * - `onUsernameSelection` - Функция для выбора имени пользователя и создания сессии.
 * - `loginData` - Функция для обработки ввода логина.
 * - `passwordData` - Функция для обработки ввода пароля.
 * - `inputLoginData` - Введенные данные логина.
 * - `inputPasswordDataData` - Введенные данные пароля (хэш).
 * - `text` - Текст сообщения или задачи, вводимый пользователем.
 * - `setText` - Функция для обновления текста сообщения или задачи.
 * - `usernameAlreadySelected` - Флаг, указывающий, выбрано ли имя пользователя.
 * - `setUsernameAlreadySelected` - Функция для обновления флага выбора имени пользователя.
 * - `isAttachmentsShown` - Флаг, указывающий, отображаются ли вложения.
 * - `setIsAttachmentsShown` - Функция для управления отображением вложений.
 * - `sendNewTask` - Функция для отправки новой задачи.
 * - `tasksList` - Список задач, полученных через сокет.
 * - `reportList` - Список отчетов, связанных с задачами.
 * - `totalPages` - Общее количество страниц для пагинации.
 * - `seTasksList` - Функция для обновления списка задач.
 * - `handleChange` - Функция для обработки изменения текущей страницы в пагинации.
 * - `currentPage` - Текущая страница в пагинации.
 * - `limit` - Лимит задач на одной странице.
 * - `offset` - Смещение для пагинации.
 * - `setOffset` - Функция для обновления смещения.
 * - `setLimit` - Функция для обновления лимита задач на странице.
 * - `setCurrentPage` - Функция для обновления текущей страницы.
 * - `createTask` - Функция для создания новой задачи.
 * - `addReportToTask` - Функция для добавления отчета к задаче.
 * - `getTaskDetails` - Функция для получения деталей задачи.
 * - `createSubtask` - Функция для создания подзадачи.
 *
 * Примечания:
 * - Хук использует `socket` для взаимодействия с сервером.
 * - Все данные и события обрабатываются в реальном времени через WebSocket.
 * - Хук автоматически подключается к серверу при монтировании и отключается при размонтировании.
 */
const useSocket = (props: useSocketPropsType) => {

    // ========== SESSION BLOCK ============
    // Состояния для управления сессией
    const [sessionID, setSessionID] = React.useState<string | null>(null);
    const [hash, setHash] = React.useState<string | null>(null);
    const [inputLoginData, setInputLoginData] = React.useState<string | null>(null);
    const [asNewUserId, setAsNewUserId] = React.useState<string | null>(null);

    // ========== USER BLOCK ============
    // Состояния для управления пользователями
    const [users, setUsers] = useState<any>([]);
    const [usernameIsDb, setUsernameIsDb] = useState<any>([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [usernameAlreadySelected, setUsernameAlreadySelected] = React.useState(false);
    const [thisUserID, setThisUserID] = React.useState(null);

    // ========== MESSAGE BLOCK ============
    // Состояния для управления сообщениями
    const [selectUserMassages, setSelectUserMassages] = React.useState([]);
    const [selectUser_i, setSelectUser_i] = React.useState<number | null>(null);
    const [isAttachmentsShown, setIsAttachmentsShown] = React.useState(false);

    // ========== TASK BLOCK ============
    // Состояния для управления задачами
    const [text, setText] = React.useState('');
    const [, setTest] = React.useState<any>(true);
    const [tasksList, seTasksList] = React.useState<any>(true);
    const [reportList, setReportList] = React.useState<any>(true);
    const [limit, setLimit] = useState(10); // Лимит задач на странице
    const [offset, setOffset] = useState(0); // Смещение для пагинации
    const [currentPage, setCurrentPage] = useState<number | undefined>(1);
    const [selectedTaskID, setSelectedTaskID] = useState<string | null>(null); // ID выбранной задачи
    const [breadcrumbPath, setBreadcrumbPath] = useState<string[]>([]);
    const [draggingList, updateDraggingList] = useState(tasksList); // Список задач для перетаскивания






    const [total, setTotal] = useState(0); // Общее количество задач
    const [totalPages, setTotalPages] = useState(0); // Общее количество страниц

    // Функция для отправки сообщения
    const sendMassage = () => {
        if (selectedUser && selectUser_i !== null) {
            const message = {
                content: text,
                from: thisUserID,
                to: selectedUser
            };
            users[selectUser_i].messages.push(message);
            socket.emit("private message", message);
            setText('');
            setTest(selectedUser + "_comment_" + text);
        }
    };

    // Функция для выбора пользователя
    const selectedUser2 = (selectedUserID: any) => {
        // props
        if (props && props.globalProps) {
            props.globalProps.user.login = "Sizov_DA";
            props.globalProps.user.uid = "3333333";
        }
        setSelectedUser(selectedUserID);
        for (let i = 0; i < users.length; i++) {
            if (users[i].userID === selectedUserID) {
                setSelectUserMassages(users[i].messages);
                setSelectUser_i(i);
                break;
            }
        }
    };


    // ========== TASK BLOCK =============

    // Добавление новой задачи в список фронтенда
    const addTask = (newTask: any) => {
        // Добавьте новую задачу в список
        newTask._key = uuidv4(); // Генерация уникального ключа

        seTasksList((prevTasksList: any) => ({
            ...prevTasksList,
            tasks: [...prevTasksList.tasks, newTask], // Добавление задачи в список
            total: prevTasksList.total + 1 // Увеличение общего количества задач
        }));
    };

    // Добавление нового отчета в список фронтенда
    const addReport = (newReport: any) => {

        // Добавьте новый отчет в список
        newReport._key = uuidv4(); // Генерация уникального ключа

        setReportList((prevReportList: any) => ({
            ...prevReportList,
            tasks: [...prevReportList.tasks, newReport], // Добавление задачи в список
            total: prevReportList.total + 1 // Увеличение общего количества задач
        }));
    };

    // Добавление новой задачи
    const createTask = (task: any) => {
        addTask(task);
        socket.emit("create_task", task, (response: any) => {
            if (response.success) {
                console.log("Задача создана:", response.task);
            } else {
                console.error("Ошибка создания задачи:", response.error);
            }
        });
    };

    const createSubtask = (subtask: any) => {
        socket.emit("create_subtask", subtask, (response: any) => {
            if (response.success) {
                console.log("Подзадача создана:", response.subtask);
            } else {
                console.error("Ошибка создания подзадачи:", response.error);
            }
        });
    };


    // Добавление отчета к задаче
    const addReportToTask = (report: any) => {
        addTask(report);
        socket.emit("add_report", report, (response: any) => {
            if (response.success) {
                console.log("Отчет добавлен:", response.report);
            } else {
                console.error("Ошибка добавления отчета:", response.error);
            }
        });
    };

    // Получение деталей задачи
    const getTaskDetails = (taskId: string) => {
        socket.emit("get_task_details", taskId, (response: any) => {
            if (response.success) {
                console.log("Детали задачи:", response.details);
            } else {
                console.error("Ошибка получения деталей задачи:", response.error);
            }
        });
    };


    /**
     *
     * Отправка новой задачи
     *
     * Использует сокет для отправки задачи на сервер и добавляет её в локальный список задач.
     *
     * тут должна реализоваться правильная обработка моего дело и обработка отчета
     * дело - это задача, которая должна быть выполнена
     * отчет - это результат работы который включает в себя время выполнения задачи ресурсы и тд
     * дело - может быть выполнено несколькими пользователями
     * отчет - может быть выполнен только одним пользователем
     * у дела может быть несколько отчетов
     * у дела может быть несколько дел
     * у дела может быть несколько пользователей
     * если нажать на дело то открывается список дел которые создоны для этого дела
     *
     *
     * thisUserID - ID текущего пользователя
     * text - текст задачи
     *
     * title - заголовок задачи (например, "Задача №1" еще не реализовано)
     * status - статус задачи (например, "pending" еще не реализовано)
     *
     * @returns void
     * @description Отправляет новую задачу на сервер и добавляет её в локальный список задач.
     *
     *
     */
    const sendNewTask = () => {
        // Отправка новой задачи на сервер
        // add friends task controller (control to the task as group user)

        // получить количество задач
        const newTask: {
            userID: string | null;
            title: string;
            description: string;
            status: string;
            createdAt: string;
        } = {
           userID: thisUserID, // ID текущего пользователя
           title: 'Задача №1 Основная задача', // Заголовок задачи
           description: text, // Описание задачи из состояния text
           status: 'pending', // Статус задачи

           createdAt: new Date().toISOString(), // Дата создания задачи

       };
       socket.emit('new task', newTask); // Отправка задачи на сервер
        console.log("#20 new task",newTask);
       addTask(newTask); // Добавление задачи в локальный список
       setText(''); // Очистка поля ввода
    };

    // Обработка задач, полученных через сокет
    const processTasksFromASocket = (tasks: any) => {
        console.log('#10 tasks',tasks); // Здесь вы можете обработать полученные задачи
        setTotal(tasks.total)
        seTasksList(tasks);
    };

    // Обработка новой задачи, полученной через сокет
    const processNewTaskFromASocket = (tasks: any) => {
        // Обработка новой задачи
        console.log('#10 tasks',tasks);
    };

    // Подключение задач через сокет
    const tasksListConnect = () => {
        // Получение всех задач при инициализации страницы
        socket.emit('tasks_limit_offset', { parentTaskID: selectedTaskID,  limit: limit, offset: offset });
       // socket.on('tasks', processTasksFromASocket);
        socket.on('tasks_limit_offset', processTasksFromASocket);
        socket.on('new task', processNewTaskFromASocket);
    };

    // Обработка изменения страницы в пагинации
    const handleChange = React.useCallback((page: React.SetStateAction<number | undefined>) => {
        if (page !== undefined) {
            setCurrentPage(page);
            console.log('#10.1', page, limit, offset)
            // Вычислите новое смещение на основе выбранной страницы и лимита
            const newOffset = (Number(page) - 1) * limit;

            setOffset(newOffset);
            // Здесь вызывайте функцию для получения данных с новым лимитом и смещением
            fetchData(limit, newOffset);
        }
    }, []);

    // Получение данных с сервера
    const fetchData = async (limit: number, offset: number) => {
        // Здесь реализуйте логику для получения данных с сервера
        // Используйте параметры limit и offset в вашем запросе
        console.log('#10.1 tasks_limit_offset', { parentTaskID: selectedTaskID, limit: limit, offset: offset })
        socket.emit('tasks_limit_offset', { parentTaskID: selectedTaskID, limit: limit, offset: offset });

    };

    // Вычисление общего количества страниц
    useEffect(() => {
        // Вычислите общее количество страниц на основе общего количества элементов и лимита
        const totalPages = Math.ceil(total / limit);
        console.log('#10.1 useEffect', limit, offset ,totalPages)
        setTotalPages(totalPages);
    }, [total, limit, tasksList]);

    // Автоматический вызов запроса при изменении выбранной папки
    useEffect(() => {
        // if (selectedTaskID !== null) {
            fetchData(limit, offset);
        // }
        console.log('#10.1 useEffect', selectedTaskID)
    }, [selectedTaskID, limit, offset]);



    // Функция для обновления пути
    const updateBreadcrumbPath = (folderId: string) => {
        setBreadcrumbPath((prevPath) => [...prevPath, folderId]);
    };

    // Функция для возврата к предыдущей папке
    const goBackInBreadcrumb = (index: number) => {
        if (index === -1) {
            setBreadcrumbPath([]); // Сбрасываем путь к корню
            setSelectedTaskID(null); // Устанавливаем выбранный taskID в null
        } else {
            // setSelectedTaskID(index)
            setBreadcrumbPath((prevPath) => prevPath.slice(0, index + 1));
            setSelectedTaskID(breadcrumbPath[index] || null);
        }
        console.log("#10.1", index, breadcrumbPath, selectedTaskID, (index === -1 ? "true" : "false"));

    };





    const deleteTask = (taskId: string) => {
        socket.emit("delete_task",  { taskId:taskId, parentTaskID: selectedTaskID});

    };

    const deleteReport = (reportId: string) => {
        socket.emit("delete_report", {reportId:reportId, parentTaskID: selectedTaskID});

    };


    // useEffect(() => {
    //     // Обработчик удаления задачи
    //     socket.on("task_deleted", ({ success, taskId }) => {
    //         if (success) {
    //             seTasksList((prevTasksList: any) => {
    //                 if (prevTasksList && prevTasksList.tasks && Array.isArray(prevTasksList.tasks)) {
    //                     const updatedTasks = prevTasksList.tasks.filter((task: any) => task._key !== taskId);
    //                     return {
    //                         ...prevTasksList,
    //                         tasks: updatedTasks,
    //                         total: prevTasksList.total - 1,
    //                     };
    //                 } else {
    //                     console.error("prevTasksList.tasks is undefined or not an array");
    //                     return prevTasksList; // Возвращаем предыдущее состояние без изменений
    //                 }
    //             });
    //         } else {
    //             console.error("Failed to delete task");
    //         }
    //     });
    //
    //     // Обработчик удаления отчета
    //     socket.on("report_deleted", ({ success, reportId }) => {
    //         if (success) {
    //             setReportList((prevReportList: any) => {
    //                 if (prevReportList && prevReportList.tasks && Array.isArray(prevReportList.tasks)) {
    //                     const updatedReports = prevReportList.tasks.filter((report: any) => report._key !== reportId);
    //                     return {
    //                         ...prevReportList,
    //                         tasks: updatedReports,
    //                         total: prevReportList.total - 1,
    //                     };
    //                 } else {
    //                     console.error("prevReportList.tasks is undefined or not an array");
    //                     return prevReportList; // Возвращаем предыдущее состояние без изменений
    //                 }
    //             });
    //         } else {
    //             console.error("Failed to delete report");
    //         }
    //     });
    // }, [seTasksList, setReportList]);
    //
    //
    // useEffect(() => {
    //     socket.on("task_deleted", ({ success, taskId }) => {
    //         if (success) {
    //             updateDraggingList((prevDraggingList: any) => {
    //                 if (Array.isArray(prevDraggingList)) {
    //                     return prevDraggingList.filter((task: any) => task._key !== taskId);
    //                 } else {
    //                     console.error("prevDraggingList is not an array");
    //                     return prevDraggingList;
    //                 }
    //             });
    //         }
    //     });
    //
    //     socket.on("report_deleted", ({ success, reportId }) => {
    //         if (success) {
    //             updateDraggingList((prevDraggingList: any) => {
    //                 if (Array.isArray(prevDraggingList)) {
    //                     return prevDraggingList.filter((report: any) => report._key !== reportId);
    //                 } else {
    //                     console.error("prevDraggingList is not an array");
    //                     return prevDraggingList;
    //                 }
    //             });
    //         }
    //     });
    // }, []);


    // ========== END TASK BLOCK =============


    // ========== SESSION BLOCK =============
    const onUsernameSelection = (username: any, hash: any, newUser?: any ) => {
        // if (newUser) setAsNewUserId(newUser);
        console.log("###1",{ username, hash, newUser }) //?
        socket.auth = { username, hash, newUser };
        socket.connect();
        setUsernameAlreadySelected(true);
    }
    const loginData = (e: any) => {
        console.log(e.target.value) //?
        if (typeof inputLoginData === "string") {
            localStorage.setItem("inputLoginData", e.target.value);
        }
        setInputLoginData(e.target.value)
    }
    const passwordData = (e: any) => {
        console.log(e.target.value) //?
        if (typeof hash === "string") {
            localStorage.setItem("hash", e.target.value);
        }
        setHash(e.target.value)
    }
    // Создание сессии сокета
    const creatSocketSession = () => {
        socket.on("session", ({sessionID, userID, hash , username, newUser}) => {
            console.log('#9', sessionID, userID , hash ,  inputLoginData )
            // attach the session ID to the next reconnection attempts
            socket.auth = { username, hash, newUser };
            // store it in the localStorage
            localStorage.setItem("sessionID", sessionID);
            // localStorage.setItem("hash", hash);
            // save the ID of the user
            // socket.userID = userID;
            socket.id = userID;

            if (!thisUserID) {
                setThisUserID(userID)
            }
        });

        const handleAuthError = (err: string, setSessionID: Function, setHash: Function, setUsernameAlreadySelected: Function) => {
            console.error('connect_error', err);
            localStorage.removeItem("sessionID");
            localStorage.removeItem("hash");
            setSessionID(null);
            setHash(null);
            setUsernameAlreadySelected(false);
        };

        socket.on("connect_error", (err) => {
            if (err.message === ERROR_MESSAGES.INVALID_USERNAME) {
                handleAuthError(err.message, setSessionID, setHash, setUsernameAlreadySelected);
            }
        });

        socket.on("authentication_error", (err) => {
            if (err === ERROR_MESSAGES.INVALID_PASSWORD) {
                handleAuthError(err, setSessionID, setHash, setUsernameAlreadySelected);
            }
        });

        if (!sessionID) {
            setSessionID(localStorage.getItem("sessionID"));
            setHash(localStorage.getItem("hash"));
            setUsernameIsDb(localStorage.getItem("inputLoginData"));
        }
        if (sessionID) {
            const username = usernameIsDb;
            console.log('###3',{ sessionID, hash, username })
            socket.auth = { sessionID, hash, username };
            socket.connect();
            setUsernameAlreadySelected(true);
        }
    };

    // Создание компонентов сокета
    const createdSocketComponent = () => {
        socket.on("connect", () => {
            users.forEach((user: any) => {
                if (user.self) {
                    user.connected = true;
                }
            });
        });
        // ========== END SESSION BLOCK =============


        // ==========  USER BLOCK ===========
        socket.on("disconnect", () => {
            users.forEach((user: any) => {
                if (user.self) {
                    user.connected = false;
                }
            });
        });

        const initReactiveProperties = (user: any) => {
            user.hasNewMessages = false;
        };

        socket.on("users", (socketUsers) => {
            socketUsers.forEach((user: any) => {
                user.messages.forEach((message: any) => {
                    message.fromSelf = message.from === socket.id;
                });
                for (let i = 0; i < socketUsers.length; i++) {
                    const existingUser = socketUsers[i];
                    if (existingUser.userID === user.userID) {
                        existingUser.connected = user.connected;
                        existingUser.messages = user.messages;
                        return;
                    }
                }
                user.self = user.userID === socket.id;
                initReactiveProperties(user);
                socketUsers.push(user);
            });
            // put the current user first, and sort by username
            socketUsers.sort((a: any, b: any) => {
                if (a.self) return -1;
                if (b.self) return 1;
                if (a.username < b.username) return -1;
                return a.username > b.username ? 1 : 0;
            });
            setUsers(socketUsers);
        });

        if (users.length) {
            socket.on("user connected", (socketConnectedUser: any) => {
                let x = users;
                for (let i = 0; i < x.length; i++) {
                    const existingUser: any = x[i];
                    if (existingUser.userID === socketConnectedUser.userID) {
                        existingUser.connected = true;
                        break;
                    }
                }
                initReactiveProperties(socketConnectedUser);
                setUsers(x);
                setTest(socketConnectedUser.userID + "_connect");
            });

            socket.on("user disconnected", (id) => {
                const x = users;
                for (let i = 0; i < x.length; i++) {
                    const user: any = x[i];
                    if (user.userID === id) {
                        user.connected = false;
                        break;
                    }
                }
                setUsers(x);
                setTest(id + "_disconnect");
            });

            // ========== END USER BLOCK =============

            // ========== MESSAGE BLOCK =============

            socket.on("private message", ({ content, from, to }) => {
                for (let i = 0; i < users.length; i++) {
                    const user: any = users[i];
                    const fromSelf = socket.id === from;
                    if (user.userID === (fromSelf ? to : from)) {
                        console.log('#9', user)
                        user.messages.push({
                            content,
                            from,
                            fromSelf,
                            to,
                        });
                        if (user !== selectedUser) {
                            user.hasNewMessages = true;
                        }
                        break;
                    }
                }
                setTest(content + "_message");
            });
            // ========== END MASSAGE BLOCK =============

            // Обработчик удаления задачи
            socket.on("task_deleted", ({ success, taskId }) => {
                if (success) {
                    seTasksList((prevTasks: TaskType[]) => prevTasks.filter((task: TaskType) => task._id !== taskId));
                } else {
                    console.error("Failed to delete task");
                }
            });

            // Обработчик удаления отчета
            socket.on("report_deleted", ({ success, reportId }) => {
                if (success) {
                    console.log(`Report ${reportId} deleted successfully`);
                } else {
                    console.error("Failed to delete report");
                }
            });





        }
    };

    // Отключение сокета
    const disconnectSocket = () => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("users");
        socket.off("user connected");
        socket.off("user disconnected");
        socket.off("private message");
        socket.off('tasks', processTasksFromASocket);
        socket.off('new task', processNewTaskFromASocket);
        if (users.length) {
            socket.disconnect();
        }
    };

    // Инициализация сокета
    useEffect(() => {
        if (!usernameAlreadySelected) {
            creatSocketSession();
        }
        tasksListConnect();
        createdSocketComponent();
        return (() => {
            disconnectSocket();
        });
    }, [
        users,
        sessionID,
        usernameAlreadySelected

    ]);

    // Возвращаемые значения хука
    return {
        selectedTaskID, // ID выбранной задачи
        setSelectedTaskID, // Функция для установки ID выбранной задачи
        users, // Список всех пользователей, подключенных через сокет
        selectedUser, // Текущий выбранный пользователь
        selectUserMassages, // Сообщения, связанные с выбранным пользователем
        thisUserID, // ID текущего пользователя
        sendMassage, // Функция для отправки сообщения выбранному пользователю
        selectedUser2, // Функция для выбора пользователя
        onUsernameSelection, // Функция для выбора имени пользователя и создания сессии
        loginData, // Функция для обработки ввода логина
        passwordData, // Функция для обработки ввода пароля
        inputLoginData, // Введенные данные логина
        inputPasswordDataData: hash, // Введенные данные пароля (хэш)
        text, // Текст сообщения или задачи, вводимый пользователем
        setText, // Функция для обновления текста сообщения или задачи
        usernameAlreadySelected, // Флаг, указывающий, выбрано ли имя пользователя
        setUsernameAlreadySelected, // Функция для обновления флага выбора имени пользователя
        isAttachmentsShown, // Флаг, указывающий, отображаются ли вложения
        setIsAttachmentsShown, // Функция для управления отображением вложений
        sendNewTask, // Функция для отправки новой задачи
        tasksList, // Список задач, полученных через сокет
        reportList, // Список отчетов, связанных с задачами
        totalPages, // Общее количество страниц для пагинации
        seTasksList, // Функция для обновления списка задач
        handleChange, // Функция для обработки изменения текущей страницы в пагинации
        currentPage, // Текущая страница в пагинации
        limit, // Лимит задач на одной странице
        offset, // Смещение для пагинации
        setOffset, // Функция для обновления смещения
        setLimit, // Функция для обновления лимита задач на странице
        setCurrentPage, // Функция для обновления текущей страницы
        createTask, // Функция для создания новой задачи
        addReportToTask, // Функция Для добавления отчета к задаче
        getTaskDetails, // Функция для получения деталей задачи
        createSubtask, // Функция для создания подзадачи
        updateBreadcrumbPath, // Функция для обновления пути хлебной крошки
        goBackInBreadcrumb, // Функция для возврата к предыдущей папке
        breadcrumbPath, // Путь хлебной крошки
        deleteTask, // Функция для удаления задачи
        deleteReport, // Функция для удаления отчета
        draggingList,
        updateDraggingList
    };
};

export default useSocket;
