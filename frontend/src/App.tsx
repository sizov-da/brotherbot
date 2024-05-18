import React, {useEffect, useState} from 'react';
import {
    Route,
    BrowserRouter, Routes, useLocation
} from 'react-router-dom';
import MainPage from './Components/MainPage';
import BotList from "./Components/BotList/BotList";
import BotCalendar1 from "./Components/BotCalendar-1";
import '@vkontakte/vkui/dist/vkui.css';
import {ConfigProvider, AdaptivityProvider, AppRoot} from "@vkontakte/vkui";
import BotCalendarPage from "./Components/Calendar/BotCalendarPage";
import AuthPage from "./Components/AuthPage/AuthPage";
function AppWrapper() {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}
function App({ route }: any) {

    const [props, setProps] = useState<any> (
        {
            user: {
                login: 'sizov',
                uid: '1111111',
                targets: [],
                tasks: [],
                botList: [],
                massage: [],
                friends: [],
                workspaces: []
            }
        } );
    const setGlobalProps = (newProps: any) =>{
        setProps(newProps)
    }



    const location = useLocation();
    const [key, setKey] = useState(location.pathname);

    useEffect(() => {
        setKey(location.pathname);
    }, [location.pathname]);

    return (
        <ConfigProvider
            appearance="light"
        >
            <AdaptivityProvider>
                <AppRoot mode={"full"}>
                        <Routes key={key}>
                            <Route path="/" element={<MainPage globalProps={props} setGlobalProps={setGlobalProps}/>}>
                                <Route index element={<div>No page is selected.</div>}/>
                                <Route path="/Bot-List" element={<BotList/>}/>
                                <Route path="/AuthPage" element={<AuthPage/>}/>
                                <Route path="/Registration" element={<AuthPage/>}/>
                                <Route path="/two" element={<BotCalendar1/>}/>
                                <Route path="/BotCalendarPage" element={<BotCalendarPage/>}/>
                                <Route path="/profile" element={<MainPage globalProps={props} setGlobalProps={setGlobalProps}/>}/>
                                <Route path="/settings" element={<MainPage globalProps={props} setGlobalProps={setGlobalProps}/>}/>
                                <Route path="/frontend/build" element={<MainPage globalProps={props} setGlobalProps={setGlobalProps}/>}/>
                            </Route>
                        </Routes>
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    );
}

export default AppWrapper;
