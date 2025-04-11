import React, { useEffect, useState } from 'react';
import {
    Cell,
    List,
    Button,
    Avatar,
    Pagination,
    Placeholder,
    Header,
    Group,
    FixedLayout,
    Separator,
    WriteBar,
    WriteBarIcon,
    AdaptiveIconRenderer,
    usePlatform,
    Tooltip,
    PanelHeader,
    PanelHeaderBack
} from "@vkontakte/vkui";
import {
    Icon24Add, Icon28FolderOutline, Icon24FolderOutline,
    Icon28ClockOutline, Icon28DocumentOutline, Icon24DocumentOutline, Icon20FolderFill
} from "@vkontakte/icons";
import useSocket from "../../hooks/useSocket";

const BotList = ({ props, attachmentsCount }: any) => {
    // Подключение хуков и данных из useSocket
    const {
        users,
        sendNewTask,
        thisUserID,
        tasksList,
        seTasksList,
        text,
        setText,
        handleChange,
        currentPage,
        totalPages
    } = useSocket(props);

    // Локальные состояния компонента
    const [selectAction, setSelectAction] = useState<string>("addNewReport"); // Выбранное действие
    const [thisUserData, setThisUserData] = useState<any>(null); // Данные текущего пользователя
    const [draggingList, updateDraggingList] = useState(tasksList); // Список задач для перетаскивания
    const [buttonClicked, setButtonClicked] = useState(false); // Состояние кнопки
    const platform = usePlatform(); // Определение платформы (iOS/Android)

    console.log('#2 BotList', tasksList);

    // Обновление данных текущего пользователя при изменении списка пользователей или ID
    useEffect(() => {
        const user = users.find((user: any) => user.userID === thisUserID);
        setThisUserData(user);
    }, [users, thisUserID]);

    // Сброс состояния кнопки после обновления списка задач
    useEffect(() => {
        if (buttonClicked) {
            // Обновление списка задач
            setButtonClicked(false);
        }
    }, [buttonClicked, tasksList]);

    // Обработчик нажатия на кнопку
    const handleButtonClick = () => {
        setButtonClicked(true);
    };

    // Обработчик завершения перетаскивания задач
    const onDragFinish = ({ from, to }: { from: number; to: number }) => {
        if (Array.isArray(draggingList)) {
            const _list = [...draggingList];
            _list.splice(from, 1);
            _list.splice(to, 0, draggingList[from]);
            updateDraggingList(_list);
        }
    };

    // Кнопка для добавления нового дела
    const renderAddListBusinessButton = () => (
        <Tooltip placement="top" text="Добавить дело">
            <Button mode="link" onClick={() => setSelectAction("addListBusiness")}>
                <AdaptiveIconRenderer
                    IconCompact={platform === 'ios' ? Icon28FolderOutline : Icon24FolderOutline}
                    IconRegular={Icon28FolderOutline}
                />
            </Button>
        </Tooltip>
    );

    // Кнопка для добавления нового отчета
    const renderAddNewReportButton = () => (
        <Tooltip placement="top" text="Добавить отчет">
            <Button mode="link" onClick={() => setSelectAction("addNewReport")}>
                <AdaptiveIconRenderer
                    IconCompact={platform === 'ios' ? Icon28DocumentOutline : Icon24DocumentOutline}
                    IconRegular={Icon28DocumentOutline}
                />
            </Button>
        </Tooltip>
    );

    console.log('#1 BotList', { buttonClicked, tasksList, thisUserData });

    return (
        <>
            {/* Заголовок панели */}
            <PanelHeader
                before={<Icon20FolderFill />}
                after={
                    <>
                        <div>{thisUserData?.username}</div>
                        <Button mode="outline" size="s">Выйти</Button>
                    </>
                }
            >
                Список дел
            </PanelHeader>

            {/* Группа с задачами */}
            <Group
                header={
                    <Header mode="secondary" indicator={tasksList.total} aside={
                        <Button size="s" appearance="accent" onClick={handleButtonClick} before={<Icon24Add />} />
                    }>
                        Новые события
                    </Header>
                }
            >
                {/* Список задач */}
                <List>
                    {Array.isArray(tasksList.tasks) && tasksList.tasks.map((task: any) => (
                        <Cell key={task._key}
                              before={<Avatar fallbackIcon={<Icon28ClockOutline />} />}
                              draggable
                              onDragFinish={onDragFinish}
                              subtitle={task.description}
                        >
                            {task.title}
                        </Cell>
                    ))}
                </List>
                {/* Пагинация */}
                <Placeholder>
                    <Pagination
                        currentPage={currentPage}
                        siblingCount={0}
                        boundaryCount={1}
                        totalPages={totalPages}
                        disabled={false}
                        onChange={handleChange}
                    />
                </Placeholder>
            </Group>

            {/* Отступ для нижнего фиксированного меню */}
            <Group style={{ height: '20px', opacity: 0 }}></Group>

            {/* Нижнее фиксированное меню */}
            <FixedLayout vertical="bottom" filled>
                <div>
                    <Separator wide />
                    <WriteBar
                        before={
                            <>
                                {text.length === 0 && renderAddListBusinessButton()}
                                {text.length === 0 && renderAddNewReportButton()}
                                {text.length > 0 && selectAction === "addListBusiness" && renderAddListBusinessButton()}
                                {text.length > 0 && selectAction === "addNewReport" && renderAddNewReportButton()}
                            </>
                        }
                        after={
                            <>
                                {text.length === 0 && <WriteBarIcon mode="send" disabled />}
                                {text.length > 0 && <WriteBarIcon mode="send" onClick={sendNewTask} />}
                            </>
                        }
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (text.length > 0 && e.key === 'Enter' && !e.ctrlKey) {
                                e.preventDefault();
                                sendNewTask();

                            } else if (e.key === 'Enter' && e.ctrlKey) {
                                setText(text + "\n");
                            }
                        }}
                        placeholder={
                            selectAction === "addListBusiness" ? "Добавление дела" :
                                selectAction === "addNewReport" ? "Добавление отчета" : ""
                        }
                    />
                </div>
            </FixedLayout>
        </>
    );
};

export default BotList;