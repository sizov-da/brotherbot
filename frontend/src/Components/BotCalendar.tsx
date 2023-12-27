import React, {useState} from "react";
import {
    FormItem,
    FormLayout,
    FormLayoutGroup,
    LocaleProvider,
    Placeholder
} from "@vkontakte/vkui";
import CalendarModule from "./CalendarModule/CalendarModule";





const BotCalendar = () => {

    const [locale, ] = useState('ru');

    // CalendarModule()
    return (
        <FormLayout>
            <FormLayoutGroup mode="vertical">

                <FormItem>
                    <LocaleProvider value={locale}>
                        <Placeholder>

                        {/*<Calendar*/}
                        {/*    value={value}*/}
                        {/*    onChange={setValue}*/}
                        {/*    enableTime={enableTime}*/}
                        {/*    disablePast={disablePast}*/}
                        {/*    disableFuture={disableFuture}*/}
                        {/*    disablePickers={disablePickers}*/}
                        {/*    showNeighboringMonth={showNeighboringMonth}*/}
                        {/*    size={size}*/}
                        {/*    listenDayChangesForUpdate={listenDayChangesForUpdate}*/}
                        {/*/>*/}
                                <CalendarModule/>
                            {/*<div id={'main'}></div>*/}
                        </Placeholder>
                    </LocaleProvider>
                </FormItem>
            </FormLayoutGroup>
        </FormLayout>
    );
};

// <BotCalendarV2 />;
export default BotCalendar ;
