import React from 'react';
// import './App.css';
import {
  Route,
  BrowserRouter, Routes
} from 'react-router-dom';
import MainPage from './Components/MainPage';
import BotList from "./Components/BotList";
import BotCalendar from "./Components/BotCalendar";
import BotCalendarV2 from "./Components/BotCalendarV2";
import '@vkontakte/vkui/dist/vkui.css';
import {ConfigProvider, AdaptivityProvider, AppRoot} from "@vkontakte/vkui";
function App() {
  return (
      <ConfigProvider
          appearance="light"
      >
          <AdaptivityProvider>
              <AppRoot mode={"full"}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} >
            <Route index element={<div>No page is selected.</div> } />
            <Route path="list" element={<BotList/>} />
            <Route path="two" element={<BotCalendar />} />
            <Route path="BotCalendarV2" element={<BotCalendarV2 />} />
            <Route path="frontend-pwa/build" element={<BotList />} />
          </Route>
        </Routes>
      </BrowserRouter>
              </AppRoot>
          </AdaptivityProvider>
      </ConfigProvider>
  );
}

export default App;
