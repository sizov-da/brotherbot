import React, {useState} from "react";
import {
    FormItem,
    FormLayoutGroup,
    LocaleProvider
} from "@vkontakte/vkui";
import CalendarModule from "./CalendarModule/CalendarModule";

const BotCalendarPage = () => {

    const [locale, ] = useState('ru');

    return (
            <FormLayoutGroup mode="vertical">
                <FormItem>
                    <LocaleProvider value={locale}>
                        <CalendarModule/>
                    </LocaleProvider>
                </FormItem>
            </FormLayoutGroup>
    );
};
export default BotCalendarPage ;
