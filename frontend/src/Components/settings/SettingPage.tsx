import React, {useEffect} from "react";
import {
    Avatar,
    Input,
    Button,
    FormItem,
    Group,
    Header,
    HorizontalCell,
    HorizontalScroll,
    Separator,
    Cell,
    FixedLayout,
    WriteBar,
    WriteBarIcon,
    Div,
    AdaptiveIconRenderer,
    usePlatform, Counter
} from "@vkontakte/vkui";
import socket from "../../Logics/socket";
import {
    Icon28UserOutline,
    Icon24VoiceOutline,
    Icon28SmileOutline,
    Icon28VoiceOutline,
    Icon24SmileOutline,
    Icon20UserCircleFillBlue
} from "@vkontakte/icons";
import MassagesListIhUser from "./MassagesListIhUser/MassagesListIhUser";


const SettingPage = ({props}: any) => {

    const [isAttachmentsShown, setIsAttachmentsShown] = React.useState(false);
    const [text, setText] = React.useState('');


    const [usernameAlreadySelected, setUsernameAlreadySelected] = React.useState(false);
    const [sessionID, setSessionID] = React.useState <string | null>(null);
    const [inputLoginData, setInputLoginData] = React.useState <string | null>(null);
    const [selectedUser, setSelectedUser] = React.useState<string | undefined>(undefined);
    const [users, setUsers] = React.useState<any>([]);


    const [selectUserMassages, setSelectUserMassages] = React.useState([])
    const [selectUser_i, setSelectUser_i] = React.useState<number | null>(null)

    const [thisUserID, setThisUserID] = React.useState(null)


    const [test, setTest] = React.useState<any>(true);

    const platform = usePlatform();


    const SmileOutlineIcon = (
        <AdaptiveIconRenderer
            IconCompact={platform === 'ios' ? Icon28SmileOutline : Icon24SmileOutline}
            IconRegular={Icon28SmileOutline}
        />
    );

    const VoiceOutlineIcon = (
        <AdaptiveIconRenderer
            IconCompact={platform === 'ios' ? Icon28VoiceOutline : Icon24VoiceOutline}
            IconRegular={Icon28VoiceOutline}
        />
    );


    const sendMassage = () => {
        if (selectedUser && selectUser_i !== null) {
            const message   = {
                content: text,
                from: thisUserID,
                to: selectedUser
            }
            users[selectUser_i].messages.push(message)
            socket.emit("private message", message );
            setText('')
            setTest(selectedUser + "_comment_" + text)
        }
    };


    console.log('#1 props', props)

    const attachmentsCount = 5;

    const selectedUser2 = (selectedUserID: string | undefined) => {
        // props

        props.globalProps.user.login = "Sizov_DA"
        props.globalProps.user.uid = "3333333"
        // props.setGlobalProps(props.globalProps)
        console.log('#1 props', props)
        console.log('#1 props', users)
        setSelectedUser(selectedUserID)
        for (let i = 0; i < users.length; i++) {
            if (users[i].userID === selectedUserID) {
                setSelectUserMassages(users[i].messages)
                setSelectUser_i(i)
                break;
            }
        }
    }


    const disconnectSocket = () => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("users");
        socket.off("user connected");
        socket.off("user disconnected");
        socket.off("private message");
        if (users.length) {
            socket.disconnect();
        }
        console.log("#1", "отключился от сокета")
    }

    function onUsernameSelection(username: any) {
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
            console.log("#1 session ", sessionID, userID)
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
            console.log('#8 connect_error', err)
            if (err.message === "invalid username") {

                setUsernameAlreadySelected(false);

                console.error('#8', 'connect_error invalid username' )
            }
        });

        if (!sessionID) {
            setSessionID(localStorage.getItem("sessionID"))
            console.log("#1 sessionID", sessionID)
        }
        if (sessionID) {
            socket.auth = {sessionID};
            socket.connect();
            setUsernameAlreadySelected(true);
        }
    }
    const createdSocketComponent = () => {
        console.log('-#2', 'createdSocketComponent')
        console.log('-#2 users', users)

        socket.on("connect", () => {
            console.log('#1 connect')
            users.forEach((user: any) => {
                if (user.self) {
                    user.connected = true;
                    console.log('--#4.3 user', user.self)
                }
            });
        });

        socket.on("disconnect", () => {
            console.log('#1 disconnect')
            users.forEach((user: any) => {
                if (user.self) {
                    user.connected = false;
                }
            });
            console.log('#8', 'disconnect' )
        });

        const initReactiveProperties = (user: any) => {
            user.hasNewMessages = false;
        };

        socket.on("users", (socketUsers) => {
            console.log('#1 socket users')
            console.log('--#4.1', socketUsers)
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


            console.log('--#4.2', socketUsers)
            setUsers(socketUsers);
        });

        if (users.length) {
            socket.on("user connected", (socketConnectedUser: any) => {
                console.log('#1 socket user connected')
                console.log('#1 socket user connected id = ', socketConnectedUser.userID)
                console.log('#1 socket user connected users = ', users.length)
                let x = users

                for (let i = 0; i < x.length; i++) {

                    const existingUser: any = x[i];
                    console.log('#1 socket user connected === ' + existingUser.userID + ' === ' + socketConnectedUser.userID)

                    if (existingUser.userID === socketConnectedUser.userID) {
                        console.log('#2 socketConnectedUser', socketConnectedUser)
                        existingUser.connected = true;
                        break;
                    }
                }
                initReactiveProperties(socketConnectedUser);
                // #5
                console.log('#2 socketConnectedUser', socketConnectedUser)

                console.log('#2 socketConnectedUser -  x', x)

                console.log('#2 socketConnectedUser -  x', x)

                setUsers(x)
                setTest(socketConnectedUser.userID + "_connect")
                // rerender()
            });

            socket.on("user disconnected", (id) => {
                console.log('#1 socket user disconnected id = ', id)
                console.log('#1 socket user disconnected id = ', users.length)

                const x = users
                for (let i = 0; i < x.length; i++) {
                    const user: any = x[i];
                    console.log('#1 socket user disconnected user.userID = ', user.userID)
                    if (user.userID === id) {
                        console.log('#1 socket user disconnected user.userID = ', user.userID)
                        user.connected = false;
                        break;
                    }
                    console.log('#1 socket user disconnected user.userID = ', user)
                }
                console.log('#1 socket user disconnected id = ', x)

                setUsers(x)
                setTest(id + "_disconnect")
                // setUsernameAlreadySelected(false);

            });

            socket.on("private message", ({content, from, to}) => {
                console.log('#1 socket private message')
                for (let i = 0; i < users.length; i++) {
                    const user: any = users[i];
                    const fromSelf = socket.id === from;
                    if (user.userID === (fromSelf ? to : from)) {
                        console.log('#9', user )
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
                console.log('#9', " massage " + content)

                setTest(content + "_message")

            });
        }
    }



    useEffect(() => {
            console.log("#1", "подключаюсь к сокету")
            console.log("#1.1 sessionID", sessionID)
            if (!usernameAlreadySelected) {
                creatSocketSession()
            }
            createdSocketComponent()
            return (() => {
                disconnectSocket()
            });
        },
        [
            users,
            sessionID,
            usernameAlreadySelected,
            // creatSocketSession,
            // createdSocketComponent,
            // disconnectSocket
        ]);







    return (
        <div>
            {!usernameAlreadySelected && <div>
                <FormItem top="Вход">
                    <Input placeholder="Логин" onInput={loginData}/>
                </FormItem>
                <FormItem>
                    <Input placeholder="Пароль"/>
                </FormItem>
                <Button
                    size="l"
                    mode="primary"
                    stretched
                    onClick={() => onUsernameSelection(inputLoginData)}
                >
                    Попробовать
                </Button>
            </div>}
            {usernameAlreadySelected && <div>
                <div>
                    <Group>
                        <Cell
                            expandable="auto"
                            before={<Icon28UserOutline/>}
                            onClick={() => selectedUser2(props.globalProps.user.login)}
                        >
                            <p>{props.globalProps.user.login} - {platform}</p>
                        </Cell>
                    </Group>
                </div>
                <Separator/>
                <div>
                    <Group header={<Header mode="secondary">друзья</Header>}>
                        <HorizontalScroll
                            showArrows
                            getScrollToLeft={(i) => i - 120}
                            getScrollToRight={(i) => i + 120}
                        >
                            <div style={{display: 'flex'}}>
                                {users.map((item: {
                                    userID: React.Key | null | undefined;
                                    username: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined;
                                    connected: boolean | undefined;
                                }) => {
                                    return (
                                        <HorizontalCell onClick={() => {
                                            selectedUser2(String(item.userID))
                                        }}
                                                        key={item.userID}
                                                        header={item.username}
                                                        activated={item.userID === selectedUser}
                                                        subtitle={(item.userID === thisUserID) ? 'Заметки' : ''}


                                        >
                                            <Avatar size={56}
                                                    src={'https://mykaleidoscope.ru/x/uploads/posts/2022-09/1663346799_8-mykaleidoscope-ru-p-lev-v-gneve-krasivo-8.jpg'}

                                            >
                                                <div style={{   right: '14px',
                                                                bottom: '-30px',
                                                                position: 'relative'}}>
                                                <Avatar.Badge background={'stroke'} >
                                                    <Counter size="s" mode="primary">
                                                        2
                                                    </Counter>
                                                </Avatar.Badge>
                                                </div>
                                                    {item.connected && item.userID === thisUserID &&
                                                    <Avatar.Badge background={"stroke"}>
                                                        <Icon20UserCircleFillBlue width={16} height={16}/>
                                                    </Avatar.Badge>}
                                                {item.connected && item.userID !== thisUserID &&
                                                    <Avatar.BadgeWithPreset preset={"online"}/>}
                                            </Avatar>
                                        </HorizontalCell>
                                    );
                                })}
                            </div>
                        </HorizontalScroll>
                    </Group>
                </div>
                <Separator/>

                <MassagesListIhUser
                    users={users}
                    selectUserMassages={selectUserMassages}
                    thisUserID={thisUserID}
                    />

                <Group style={{height: '20px'}}>
                </Group>
                <FixedLayout
                    vertical="bottom"
                    // vertical="top"
                    filled
                >
                    <div>
                        <Separator wide/>

                        {isAttachmentsShown && (
                            <div>
                                <Div>Интерфейс прикрепления</Div>
                                <Separator wide/>
                            </div>
                        )}

                        <WriteBar
                            before={
                                <WriteBarIcon
                                    mode="attach"
                                    onClick={() => setIsAttachmentsShown(!isAttachmentsShown)}
                                    count={attachmentsCount}
                                />
                            }
                            inlineAfter={
                                text.length > 0 && (
                                    <WriteBarIcon>{SmileOutlineIcon}</WriteBarIcon>
                                )
                            }
                            after={
                                <>
                                    {text.length === 0 && (
                                        <WriteBarIcon>{SmileOutlineIcon}</WriteBarIcon>
                                    )}
                                    {text.length === 0 && (
                                        <WriteBarIcon>
                                            {VoiceOutlineIcon}
                                        </WriteBarIcon>
                                    )}
                                    {text.length > 0 &&
                                        <WriteBarIcon mode="send" onClick={() => sendMassage()}/>}
                                </>
                            }
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => {
                                if (text.length > 0 && e.key === 'Enter' && !e.ctrlKey) {
                                    if (text === '\n') {
                                        e.preventDefault();
                                        setText('')
                                    }
                                    else
                                    {
                                        e.preventDefault();
                                        sendMassage();
                                    }
                                } else if (e.key === 'Enter' && e.ctrlKey) {
                                    setText(text + "\n");
                                }
                            }}
                            placeholder="Сообщение"
                        />
                    </div>
                </FixedLayout>
            </div>}
        </div>
    );
}
export default SettingPage;
