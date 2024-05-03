import React, {useEffect} from 'react';
import {
    Avatar, Button,
    Gradient, Group, Header,
    Title
} from "@vkontakte/vkui";
import {LoginButton} from '@telegram-auth/react';
import useSocket from "../../hooks/useSocket";


const AuthPage = ({props}: any) => {

    const {
        users,
        thisUserID,
    } = useSocket(props);
    const [thisUser, setThisUser] = React.useState({username: ''});
    const [photoUrl, setPhotoUrl] = React.useState<string | null>('');
    let botUsername;
    useEffect(() => {
        console.log("#1", users);
        users.map((user: any) => {
            if (user.userID === thisUserID) {
                console.log("#2", user);
                setThisUser(user);
            }
        })


    }, [users, botUsername])


    function deleteCookie(name: string) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    const handleLogout = () => {
        // Удаляем данные аутентификации из localStorage
        localStorage.removeItem('vkAuthData');
        deleteCookie('stel_ssid');
        deleteCookie('stel_token');
        // Вызываем функцию разлогинивания, переданную через props
        window.location.href = '/AuthPage';
    }
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const firstName = urlParams.get('first_name');
        const lastName = urlParams.get('last_name');
        const username = urlParams.get('username');
        // const photoUrl = urlParams.get('photo_url');
        const authDate = urlParams.get('auth_date');
        const hash = urlParams.get('hash');
        setPhotoUrl(urlParams.get('photo_url'));
        console.log("##1", id, firstName, lastName, username, photoUrl, authDate, hash);
        // if (!id || !firstName || !lastName || !username || !photoUrl || !authDate || !hash) {
        //     console.log('Данные аутентификации не найдены')
        //     localStorage.removeItem('authData');
        // } else {
            const data = {
                id: id,
                first_name: firstName,
                last_name: lastName,
                username: username,
                photo_url: photoUrl,
                auth_date: authDate,
                hash: hash
            };
            console.log('Данные аутентификации найдены', data);
            localStorage.setItem('authData', JSON.stringify(data));
        // }
    }, []);


    // https://d344-192-109-241-26.ngrok-free.app/AuthPage?
    // id=172913990
    // &first_name=Sizov
    // &last_name=Dmitryi
    // &username=SizovDA
    // &photo_url=https%3A%2F%2Ft.me%2Fi%2Fuserpic%2F320%2Fs8h-Ye9lGibNmIKST8b7OWtkDKq7tGBOcqIGNIxvYDU.jpg
    // &auth_date=1714410797
    // &hash=d167782cbc391053580652928a80c6992334cdb4beaea023357164181e851848


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
                {photoUrl && < Avatar size={96}
                                      src={photoUrl}/>}
                <Title style={{marginBottom: 8, marginTop: 20}} level="2" weight="2">
                    {thisUser.username}
                </Title>
            </Gradient>

            <div id="telegramButton">
                <LoginButton
                    botUsername={'brother_u_bot'}
                    authCallbackUrl="https://99bc-91-204-150-45.ngrok-free.app/AuthPage"
                    onAuthCallback={data => {
                        console.log('##2', data);
                        localStorage.setItem('authData', JSON.stringify(data));
                    }}
                    buttonSize="large" // "large" | "medium" | "small"
                    cornerRadius={5} // 0 - 20
                    showAvatar={true} // true | false
                    lang="en"
                />
            </div>
            <Button mode="outline" size="l" onClick={handleLogout}>
                Выйти
            </Button>

        </>
    );

};

export default AuthPage;
