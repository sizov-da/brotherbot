import React from 'react';
// import './App.css';
import {
    Route,
    BrowserRouter, Routes
} from 'react-router-dom';
import MainPage from './Components/MainPage';
import BotList from "./Components/BotList";
import BotCalendar1 from "./Components/BotCalendar-1";
// import BotCalendarV2 from "./Components/BotCalendarV2";
import '@vkontakte/vkui/dist/vkui.css';
import {ConfigProvider, AdaptivityProvider, AppRoot} from "@vkontakte/vkui";
import BotCalendar from "./Components/BotCalendar";

function App() {
    return (
        <ConfigProvider
            appearance="light"
        >
            <AdaptivityProvider>
                <AppRoot mode={"full"}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<MainPage/>}>
                                <Route index element={<div>No page is selected.</div>}/>
                                <Route path="Bot-List" element={<BotList/>}/>
                                <Route path="two" element={<BotCalendar1/>}/>
                                <Route path="BotCalendar" element={<BotCalendar/>}/>
                                <Route path="profile" element={<MainPage/>}/>
                                <Route path="frontend/build" element={<MainPage/>}/>
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    );
}

export default App;
