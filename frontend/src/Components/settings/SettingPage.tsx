import {Avatar, Input, Button, FormItem, Group, Header, HorizontalCell, HorizontalScroll, Separator, Cell} from "@vkontakte/vkui";
import React, {useEffect} from "react";
import socket from "../../Logics/socket";
import {Icon28UserOutline} from "@vkontakte/icons";


function getRandomUsers(number: number) {
    return [
        {id: 1,
            first_name: "TEST",
            photo_200: "https://mykaleidoscope.ru/x/uploads/posts/2022-09/1663346799_8-mykaleidoscope-ru-p-lev-v-gneve-krasivo-8.jpg" },
            {id: 2,
            first_name: "TEST",
            photo_200: "https://mykaleidoscope.ru/x/uploads/posts/2022-09/1663346799_8-mykaleidoscope-ru-p-lev-v-gneve-krasivo-8.jpg" },
            {id: 3,
            first_name: "TEST",
            photo_200: "https://mykaleidoscope.ru/x/uploads/posts/2022-09/1663346799_8-mykaleidoscope-ru-p-lev-v-gneve-krasivo-8.jpg" },
            {id: 4,
            first_name: "TEST",
            photo_200: "https://mykaleidoscope.ru/x/uploads/posts/2022-09/1663346799_8-mykaleidoscope-ru-p-lev-v-gneve-krasivo-8.jpg" },
        {id: 5,
            first_name: "TEST",
            photo_200: "https://mykaleidoscope.ru/x/uploads/posts/2022-09/1663346799_8-mykaleidoscope-ru-p-lev-v-gneve-krasivo-8.jpg" },
        {id: 6,
            first_name: "TEST",
            photo_200: "https://mykaleidoscope.ru/x/uploads/posts/2022-09/1663346799_8-mykaleidoscope-ru-p-lev-v-gneve-krasivo-8.jpg" },
        {id: 7,
            first_name: "TEST",
            photo_200: "https://mykaleidoscope.ru/x/uploads/posts/2022-09/1663346799_8-mykaleidoscope-ru-p-lev-v-gneve-krasivo-8.jpg" },
        {id: 8,
            first_name: "TEST",
            photo_200: "https://mykaleidoscope.ru/x/uploads/posts/2022-09/1663346799_8-mykaleidoscope-ru-p-lev-v-gneve-krasivo-8.jpg" }
    ];
}

const SettingPage = () => {
    const [usernameAlreadySelected, setUsernameAlreadySelected] = React.useState(false);
    const [sessionID, setSessionID] = React.useState < string | null >(null);
    const [inputLoginData, setInputLoginData] = React.useState < string | null >(null);
    const [recentFriends] = React.useState(getRandomUsers(20));
    useEffect(
        ()=>creatSocketSession(),
        );



  function  onUsernameSelection(username: any) {
      setUsernameAlreadySelected(true ) ;
        socket.auth = { username };
        socket.connect();
    }

    const loginData = (e: any) => {
      console.log(e.target.value )
        setInputLoginData(e.target.value)
    }

   const creatSocketSession = () => {
        // const sessionID = localStorage.getItem("sessionID");
       setSessionID( localStorage.getItem("sessionID") )

        if (sessionID) {

            setUsernameAlreadySelected(true);
            socket.auth = { sessionID };
            socket.connect();
        }

        socket.on("session", ({ sessionID, userID }) => {
            // attach the session ID to the next reconnection attempts
            socket.auth = { sessionID };
            // store it in the localStorage
            localStorage.setItem("sessionID", sessionID);
            // save the ID of the user
            // socket.userID = userID;
            socket.id = userID;
        });

        socket.on("connect_error", (err) => {
            if (err.message === "invalid username") {
                setUsernameAlreadySelected(false);
            }
        });
    }
   const destroyed = () => {
        socket.off("connect_error");
    }


    return (
        <div>
            {!usernameAlreadySelected && <div>
                <FormItem top="Вход">
                    <Input placeholder="Логин" onInput={loginData} />
                </FormItem>
                <FormItem>
                    <Input placeholder="Пароль" />
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
            {usernameAlreadySelected &&  <div>
                <div>
                    <Group>
                        <Cell
                            expandable="auto"
                            before={<Icon28UserOutline />}
                            // onClick={() => setActivePanel('panel2')}
                        >
                            ваши друзья в проекте
                        </Cell>
                    </Group>
                </div>
                <Separator />
                <div>
                         <Group header={<Header mode="secondary">друзья</Header>}>
                            <HorizontalScroll
                                showArrows
                                getScrollToLeft={(i) => i - 120}
                                getScrollToRight={(i) => i + 120}
                            >
                                <div style={{ display: 'flex' }}>
                                    {recentFriends.map((item: { id: React.Key | null | undefined;
                                                                first_name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined;
                                                                photo_200: string | undefined; }) => {
                                        return (
                                            <HorizontalCell onClick={() => {}} key={item.id} header={item.first_name}>
                                                <Avatar size={56} src={item.photo_200} />
                                            </HorizontalCell>
                                        );
                                    })}
                                </div>
                            </HorizontalScroll>
                        </Group>

                </div>
                <Separator />
                <div>
                    рабочие места
                </div>
                <Separator />
                <div>Сообщения</div>
            </div>}
        </div>
    );
}
export default SettingPage;
