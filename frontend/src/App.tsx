import React, {useState} from 'react';
import {
    Route,
    BrowserRouter, Routes
} from 'react-router-dom';
import MainPage from './Components/MainPage';
import BotList from "./Components/BotList/BotList";
import BotCalendar1 from "./Components/BotCalendar-1";
import '@vkontakte/vkui/dist/vkui.css';
import {ConfigProvider, AdaptivityProvider, AppRoot} from "@vkontakte/vkui";
import BotCalendarPage from "./Components/Calendar/BotCalendarPage";
import AuthPage from "./Components/AuthPage/AuthPage";

function App() {

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

    return (
        <ConfigProvider
            appearance="light"
        >
            <AdaptivityProvider>
                <AppRoot mode={"full"}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<MainPage globalProps={props} setGlobalProps={setGlobalProps}/>}>
                                <Route index element={<div>No page is selected.</div>}/>
                                <Route path="Bot-List" element={<BotList/>}/>
                                <Route path="AuthPage" element={<AuthPage/>}/>
                                <Route path="two" element={<BotCalendar1/>}/>
                                <Route path="BotCalendarPage" element={<BotCalendarPage/>}/>
                                <Route path="profile" element={<MainPage globalProps={props} setGlobalProps={setGlobalProps}/>}/>
                                <Route path="settings" element={<MainPage globalProps={props} setGlobalProps={setGlobalProps}/>}/>
                                <Route path="frontend/build" element={<MainPage globalProps={props} setGlobalProps={setGlobalProps}/>}/>
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    );
}

export default App;
