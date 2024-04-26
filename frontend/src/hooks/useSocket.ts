import React, {useEffect, useState} from 'react';
import socket from "../Logics/socket";


type useSocketPropsType = {
    globalProps: {
        user: {
            login: string;
            uid: string;
        };
    };
} | undefined


const useSocket = (props: useSocketPropsType ) => {


    const [users, setUsers] = useState<any>([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [text, setText] = React.useState('');
    const [usernameAlreadySelected, setUsernameAlreadySelected] = React.useState(false);
    const [sessionID, setSessionID] = React.useState <string | null>(null);
    const [inputLoginData, setInputLoginData] = React.useState <string | null>(null);

    const [selectUserMassages, setSelectUserMassages] = React.useState([])
    const [selectUser_i, setSelectUser_i] = React.useState<number | null>(null)
    const [isAttachmentsShown, setIsAttachmentsShown] = React.useState(false);

    const [thisUserID, setThisUserID] = React.useState(null)

    const [, setTest] = React.useState<any>(true);
    const [tasksList, seTasksList] = React.useState<any>(true);


    const sendMassage = () => {
        if (selectedUser && selectUser_i !== null) {
            const message = {
                content: text,
                from: thisUserID,
                to: selectedUser
            }
            users[selectUser_i].messages.push(message)
            socket.emit("private message", message);
            setText('')
            setTest(selectedUser + "_comment_" + text)
        }
    };
    const sendNewTask = () => {
        // Отправка новой задачи на сервер
        socket.emit('new task', {
            userID: thisUserID,
            title: 'Задача №1',
            description: text,
            status: 'pending',
        } );
        setText('')
        setTest(selectedUser + "_comment_" + text)
    };


    const selectedUser2 = (selectedUserID: any) => {
        // props
        if (props && props.globalProps) {
            props.globalProps.user.login = "Sizov_DA"
            props.globalProps.user.uid = "3333333"
        }
        setSelectedUser(selectedUserID)
        for (let i = 0; i < users.length; i++) {
            if (users[i].userID === selectedUserID) {
                setSelectUserMassages(users[i].messages)
                setSelectUser_i(i)
                break;
            }
        }
    }


    const handleTasks = (tasks: any) => {
        console.log('#10 tasks',tasks); // Здесь вы можете обработать полученные задачи
        seTasksList(tasks);
    };

    const handleNewTask = (tasks: any) => {
        // Обработка новой задачи
        console.log('#10 tasks',tasks);
    };

    const tasksListConnect = () => {
        // Получение всех задач при инициализации страницы
        socket.emit('tasks');
        socket.on('tasks', handleTasks);
        socket.on('new task', handleNewTask);

    }

    const disconnectSocket = () => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("users");
        socket.off("user connected");
        socket.off("user disconnected");
        socket.off("private message");
        socket.off('tasks', handleTasks);
        socket.off('new task', handleNewTask);
        if (users.length) {
            socket.disconnect();
        }
    }

    const onUsernameSelection = (username: any) => {
        socket.auth = {username};
        socket.connect();
        setUsernameAlreadySelected(true);
    }

    const loginData = (e: any) => {
        console.log(e.target.value) //?
        setInputLoginData(e.target.value)
    }


    const creatSocketSession = () => {
        socket.on("session", ({sessionID, userID}) => {
            // attach the session ID to the next reconnection attempts
            socket.auth = {sessionID};
            // store it in the localStorage
            localStorage.setItem("sessionID", sessionID);
            // save the ID of the user
            // socket.userID = userID;
            socket.id = userID;

            if (!thisUserID) {
                setThisUserID(userID)
            }
        });
        socket.on("connect_error", (err) => {
            if (err.message === "invalid username") {
                localStorage.removeItem("sessionID");
                setSessionID(null);
                setUsernameAlreadySelected(false);
                console.error('#8', 'connect_error invalid username')
            }
        });

        if (!sessionID) {
            setSessionID(localStorage.getItem("sessionID"))
        }
        if (sessionID) {
            socket.auth = {sessionID};
            socket.connect();
            setUsernameAlreadySelected(true);
        }
    }
    const createdSocketComponent = () => {
        socket.on("connect", () => {
            // console.log('#1 connect')
            users.forEach((user: any) => {
                if (user.self) {
                    user.connected = true;
                }
            });
        });

        socket.on("disconnect", () => {
            // console.log('#1 disconnect')
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
                let x = users
                for (let i = 0; i < x.length; i++) {
                    const existingUser: any = x[i];
                    if (existingUser.userID === socketConnectedUser.userID) {
                        existingUser.connected = true;
                        break;
                    }
                }
                initReactiveProperties(socketConnectedUser);
                setUsers(x)
                setTest(socketConnectedUser.userID + "_connect")
                // rerender()
            });

            socket.on("user disconnected", (id) => {
                const x = users
                for (let i = 0; i < x.length; i++) {
                    const user: any = x[i];
                    if (user.userID === id) {
                        user.connected = false;
                        break;
                    }
                }
                setUsers(x)
                setTest(id + "_disconnect")
                // setUsernameAlreadySelected(false);

            });

            socket.on("private message", ({content, from, to}) => {
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
                setTest(content + "_message")
            });
        }
    }



    useEffect(() => {
            if (!usernameAlreadySelected) {
                creatSocketSession()
            }
            tasksListConnect()
            createdSocketComponent()
            return (() => {
                disconnectSocket()
            });
        },
        [
            users,
            sessionID,
            usernameAlreadySelected,
        ]);

    return { users,
        selectedUser,
        inputLoginData,
        selectUserMassages,
        thisUserID,
        sendMassage,
        selectedUser2,
        onUsernameSelection,
        loginData,
        text,
        setText,
        usernameAlreadySelected,
        setUsernameAlreadySelected,
        isAttachmentsShown,
        setIsAttachmentsShown,
        sendNewTask,
        tasksList
    };
};

export default useSocket;
