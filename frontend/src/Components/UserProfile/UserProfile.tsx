import React, {useEffect} from 'react';
import {
    Avatar,
    Gradient, Group, Header,
    Title
} from "@vkontakte/vkui";
import useSocket from "../../hooks/useSocket";


const UserProfile = ({props}:any) => {

    const {
        users,
        sendNewTask,
        thisUserID,
        tasksList
    } = useSocket( props );
    const [thisUser, setThisUser] = React.useState({username: ''});

    useEffect(() => {
        console.log("#1", users);
        users.map((user: any) => {
            if (user.userID === thisUserID) {
                console.log("#2", user );
                setThisUser(user);
            }
        })
    }, [users])

    return (<>
            <Gradient
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: 32,
                }}
            >
                <Avatar size={96} src={'https://mykaleidoscope.ru/x/uploads/posts/2022-09/1663346799_8-mykaleidoscope-ru-p-lev-v-gneve-krasivo-8.jpg'} />
                <Title style={{ marginBottom: 8, marginTop: 20 }} level="2" weight="2">
                    { thisUser.username }
                </Title>
            </Gradient>
            <Group
                header={
                    <Header mode="secondary" indicator="25">
                        Друзья
                    </Header>
                }
            >
                1) мои достижения<br></br>
                2) проваленные сроки<br></br>
                3) время по проектам (полочкам)<br></br>

            </Group>
        </>
    );

};

export default UserProfile;
