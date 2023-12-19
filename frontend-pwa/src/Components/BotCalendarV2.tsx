import {useState} from "react";
import { format } from 'date-fns';
import {FormItem, FormLayout, FormLayoutGroup, Checkbox, Select, LocaleProvider, Calendar} from "@vkontakte/vkui";





const BotCalendarV2 = () => {
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
                {value ? <FormItem top="Выбранная дата">{format(value, 'yyyy-MM-dd HH:mm:ss')}</FormItem> :<FormItem top="Выбранная дата">Не выбрано</FormItem>}
                <FormItem top="Выбор времени">
                    <Checkbox checked={enableTime} onChange={(e) => setEnableTime(e.target.checked)}>
                        Включено
                    </Checkbox>
                </FormItem>
                <FormItem top="Запрет выбора прошлых дат">
                    <Checkbox checked={disablePast} onChange={(e) => setDisablePast(e.target.checked)}>
                        Включено
                    </Checkbox>
                </FormItem>
                <FormItem top="Запрет выбора будущих дат">
                    <Checkbox checked={disableFuture} onChange={(e) => setDisableFuture(e.target.checked)}>
                        Включено
                    </Checkbox>
                </FormItem>
                <FormItem top="Отключить селекты выбора месяца/года">
                    <Checkbox checked={disablePickers} onChange={(e) => setDisablePickers(e.target.checked)}>
                        Включено
                    </Checkbox>
                </FormItem>
                <FormItem top="Отображать даты с прошлого и следующего месяца">
                    <Checkbox
                        checked={showNeighboringMonth}
                        onChange={(e) => setShowNeighboringMonth(e.target.checked)}
                    >
                        Включено
                    </Checkbox>
                </FormItem>
                <FormItem top="Переключать сегодняшний день в 00:00">
                    <Checkbox
                        checked={listenDayChangesForUpdate}
                        onChange={(e) => setListenDayChangesForUpdate(e.target.checked)}
                    >
                        Включено
                    </Checkbox>
                </FormItem>
                <FormItem top="Локаль">
                    <Select
                        style={{ width: 100 }}
                        value={locale}
                        onChange={(e) => setLocale(e.target.value)}
                        options={[
                            {
                                label: 'ru',
                                value: 'ru',
                            },
                            {
                                label: 'en',
                                value: 'en',
                            },
                            {
                                label: 'ar',
                                value: 'ar',
                            },
                            {
                                label: 'fr',
                                value: 'fr',
                            },
                        ]}
                    />
                </FormItem>
                <FormItem top="Размер">
                    <Select
                        style={{ width: 100 }}
                        value={size}
                        onChange={(e ) => {
                            console.log('#1',e.target.value )
                            // setSize(e.target.value)
                        }}
                        options={[
                            {
                                label: 's',
                                value: 's',
                            },
                            {
                                label: 'm',
                                value: 'm',
                            },
                        ]}
                    />
                </FormItem>
                <FormItem>
                    <LocaleProvider value={locale}>
                        <Calendar
                            value={value}
                            onChange={setValue}
                            enableTime={enableTime}
                            disablePast={disablePast}
                            disableFuture={disableFuture}
                            disablePickers={disablePickers}
                            showNeighboringMonth={showNeighboringMonth}
                            size={size}
                            listenDayChangesForUpdate={listenDayChangesForUpdate}
                        />
                    </LocaleProvider>
                </FormItem>
            </FormLayoutGroup>
        </FormLayout>
    );
};

// <BotCalendarV2 />;
export default BotCalendarV2 ;
