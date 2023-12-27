import React, {useState} from "react";
import { format } from 'date-fns';
import {
    FormItem,
    FormLayout,
    FormLayoutGroup,
    Checkbox,
    Select,
    LocaleProvider,
    Calendar,
    Placeholder
} from "@vkontakte/vkui";
import CalendarModule from "./CalendarModule/CalendarModule";





const BotCalendar = () => {
    const [value, setValue] = useState< Date | undefined >(() => new Date());
    const [enableTime, setEnableTime] = useState(false);
    const [disablePast, setDisablePast] = useState(false);
    const [disableFuture, setDisableFuture] = useState(false);
    const [disablePickers, setDisablePickers] = useState(false);
    const [showNeighboringMonth, setShowNeighboringMonth] = useState(false);
    const [locale, setLocale] = useState('ru');
    // const [size, setSize] = useState< 'm' | 's' >('m');
    const size = ('m');
    const [listenDayChangesForUpdate, setListenDayChangesForUpdate] = useState(false);


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
                        </Placeholder>
                    </LocaleProvider>
                </FormItem>
            </FormLayoutGroup>
        </FormLayout>
    );
};

// <BotCalendarV2 />;
export default BotCalendar ;
