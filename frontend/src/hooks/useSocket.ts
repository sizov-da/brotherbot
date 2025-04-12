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

// Константы для сообщений об ошибках
const ERROR_MESSAGES = {
    INVALID_USERNAME: "invalid username",
    INVALID_PASSWORD: "Invalid password"
};

// Основной хук useSocket
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
    const [limit, setLimit] = useState(10); // Лимит задач на странице
    const [offset, setOffset] = useState(0); // Смещение для пагинации
    const [currentPage, setCurrentPage] = useState<number | undefined>(1);

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

    // Добавление новой задачи
    const addTask = (newTask: any) => {
        // Добавьте новую задачу в список
        newTask._key = uuidv4(); // Генерация уникального ключа

        seTasksList((prevTasksList: any) => ({
            ...prevTasksList,
            tasks: [...prevTasksList.tasks, newTask], // Добавление задачи в список
            total: prevTasksList.total + 1 // Увеличение общего количества задач
        }));
    };

    // Отправка новой задачи
    const sendNewTask = () => {
        // Отправка новой задачи на сервер
        // add friends task controller (control to the task as group user)

        // получить количество задач

        const newTask = {
            userID: thisUserID,
            title: 'Задача №1',
            description: text,
            status: 'pending',
        };
        socket.emit('new task', newTask); // Отправка задачи на сервер
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
        socket.emit('tasks_limit_offset', { limit: limit, offset: offset });
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
        // Здесь реализуйте логику для получения данных с серв��ра
        // Используйте параметры limit и offset в вашем запросе
        console.log('#10.1', limit, offset)
        socket.emit('tasks_limit_offset', { limit: limit, offset: offset });

    };

    // Вычисление общего количества страниц
    useEffect(() => {
        // Вычислите общее количество страниц на основе общего количества элементов и лимита
        const totalPages = Math.ceil(total / limit);
        console.log('#10.1 useEffect', limit, offset ,totalPages)
        setTotalPages(totalPages);
    }, [total, limit, tasksList]);
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
        usernameAlreadySelected,
    ]);

    // Возвращаемые значения хука
    return {
        users,
        selectedUser,
        selectUserMassages,
        thisUserID,
        sendMassage,
        selectedUser2,
        onUsernameSelection,
        loginData,
        passwordData,
        inputLoginData,
        inputPasswordDataData: hash,
        text,
        setText,
        usernameAlreadySelected,
        setUsernameAlreadySelected,
        isAttachmentsShown,
        setIsAttachmentsShown,
        sendNewTask,
        tasksList,
        totalPages,
        seTasksList,
        handleChange,
        currentPage,
        limit,
        offset,
        setOffset,
        setLimit,
        setCurrentPage
    };
};

export default useSocket;
