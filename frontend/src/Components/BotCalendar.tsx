import React, {useState} from "react";
import {
    FormItem,
    FormLayout,
    FormLayoutGroup,
    LocaleProvider
} from "@vkontakte/vkui";
import CalendarModule from "./Calendar/CalendarModule";





const BotCalendar = () => {

    const [locale, ] = useState('ru');

    return (
        <FormLayout>
            <FormLayoutGroup mode="vertical">
                <FormItem>
                    <LocaleProvider value={locale}>
                        <CalendarModule/>
                    </LocaleProvider>
                </FormItem>
            </FormLayoutGroup>
        </FormLayout>
    );
};

export default BotCalendar ;
