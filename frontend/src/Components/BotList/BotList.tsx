import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Breadcrumbs from "./Breadcrumbs";
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
    PanelHeader

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
        reportList,
        seTasksList,
        selectedTaskID,
        setSelectedTaskID,
        text,
        setText,
        handleChange,
        currentPage,
        totalPages,
        createTask,
        addReportToTask,
        updateBreadcrumbPath,
        goBackInBreadcrumb,
        breadcrumbPath,
        deleteTask, // Функция для удаления задачи
        deleteReport, // Функция для удаления отчета
        updateTask,
        updateReport,
    } = useSocket(props);


    // Локальные состояния компонента
    const [selectAction, setSelectAction] = useState<string>("addNewReport"); // Выбранное действие
    const [thisUserData, setThisUserData] = useState<any>(null); // Данные текущего пользователя
    const [draggingList, updateDraggingList] = useState(tasksList); // Список задач для перетаскивания
    const [buttonClicked, setButtonClicked] = useState(false); // Состояние кнопки

    const platform = usePlatform(); // Определение платформы (iOS/Android)

    console.log('#2 BotList', tasksList);
    console.log('#200 draggingList', tasksList);
    // updateDraggingList(tasksList);
    useEffect(() => {

        if (Array.isArray(tasksList.tasks)) {

            updateDraggingList(tasksList.tasks);

        } else {
            console.error("tasksList не является массивом:", tasksList);
        }
        console.log('#200 tasksList', tasksList, draggingList );
    }, [tasksList, draggingList]);

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
    const userID = thisUserID ?? "unknown"; // Используем "unknown" как значение по умолчанию


    // Обработчик для отображения подзадач
    const handleTaskClick = async (taskID: string) => {
        setSelectedTaskID(taskID);
        updateBreadcrumbPath(taskID);
    };

    // Обработчик для назначения taskID
    const handleAssignTaskID = (taskID: string) => {
        setSelectedTaskID(taskID);
    };

    // Функция для создания нового дела
    const createNewTask = (text: string, userID: string, parentTaskID: string | null ) => ({
        _key: uuidv4(),
        userID,
        title: text,
        parentTaskID: parentTaskID || "base",
        image: "task", // Пример изображения
        description: "Новое дело",
        status: "pending",
        sorting: tasksList.tasks.length + 1,
        createdAt: new Date().toISOString(),
    });

    // Функция для создания нового отчета
    const createNewReport = (text: string, userID: string, parentTaskID: string | null ) => ({
        _key: uuidv4(),
        parentTaskID: parentTaskID || "unknown",
        userID,
        image: "report",
        description: "Новый отчет",
        title: text,
        timeSpent: 2, // Примерное время
        sorting: tasksList.tasks.length + 1,
        resourcesUsed: "Ресурсы", // Пример ресурсов
        createdAt: new Date().toISOString(),
    });

    console.log('#1 BotList', { buttonClicked, tasksList, thisUserData });
    // Удаление элемента из списка
    const removeFromList = ( index: number, list: any[] ) => {
        console.log("#200 удаляю", list, index);

        if (!Array.isArray(list)) {
            console.error("Переданный список не является массивом:", list);
            return;
        }

        const itemToRemove = list[index]; // Получаем элемент из текущего списка
        if (!itemToRemove) {
            console.error("Элемент для удаления не найден:", index);
            return;
        }

        list.splice(index, 1);
        seTasksList({
                        tasks: list,
                        total: tasksList.total - 1
                    });
        if (itemToRemove.image === "task") {
            console.log("#7 DELETE task", itemToRemove._key);
            deleteTask(itemToRemove._key); // Удаляем задачу
        } else if (itemToRemove.image === "report") {
            // Удаляем отчет из задачи
            console.log("#7 DELETE report", itemToRemove._key);
            deleteReport(itemToRemove._key); // Удаляем отчет
        }

        // Не обновляем локальный список сразу, ждем ответа от сервера
    };

    // Перемещение элемента в списке
    const reorderList = (
        { from, to }: { from: number; to: number },
        list: any[]
    ) => {

        console.log("#200 перемещаю", list, from, to);
//         updateTask,
//         updateReport,

        console.log("#200 перезаписываю", list[from]," на ", to +1);
        console.log("#200 заменяя на ", list[to]," на ", from +1);


        list[to].sorting = from +1
        list[from].sorting = to +1


        // Отправляем изменения на сервер
        if (list[to].image === "task") {
            updateTask(list[to]);
        } else if (list[to].image === "report") {
            updateReport(list[to]);
        }

        if (list[from].image === "task") {
            updateTask(list[from]);
        } else if (list[from].image === "report") {
            updateReport(list[from]);
        }


        const updatedList = [...list];
        const [movedItem] = updatedList.splice(from, 1); // Удаляем элемент с позиции `from`
        updatedList.splice(to, 0, movedItem); // Вставляем элемент на позицию `to`

        console.log("#200 Переместил", list, from, to);

        seTasksList({
            tasks: updatedList,
            total: tasksList.total
        }); // Обновляем состояние
    };



    useEffect(() => {
        if (tasksList && tasksList.tasks) {
            updateDraggingList(tasksList.tasks);
        }
    }, [tasksList]);


    // const removeFromList = (idx, list, updateListFn) => {
    //     const _list = [...list];
    //     _list.splice(idx, 1);
    //     updateListFn(_list);
    // };
    //
    // const reorderList = ({ from, to }, list, updateListFn) => {
    //     const _list = [...list];
    //     _list.splice(from, 1);
    //     _list.splice(to, 0, list[from]);
    //     updateListFn(_list);
    // };


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

                <Breadcrumbs breadcrumbPath={breadcrumbPath} goBackInBreadcrumb={goBackInBreadcrumb} />

                {/* Список задач */}
                <List>
                    {Array.isArray(tasksList.tasks) && tasksList.tasks.map((task: any, idx: number) => (
                        <Cell
                            key={task._key}
                            before={
                                <Avatar
                                   fallbackIcon={
                                      task.image === "task" ? <Icon28FolderOutline /> :
                                          task.image === "report" ? <Icon28DocumentOutline /> :
                                              <Icon28ClockOutline />
                                    }
                                    onClick={() => handleAssignTaskID(task._key)} // Назначение taskID
                                />
                            }
                            onClick={() => handleTaskClick(task._key)} // Отображение подзадач
                            subtitle={task.description}
                            onRemove={() => removeFromList(idx, draggingList)} // Используем idx
                            onDragFinish={({ from, to }) => reorderList({ from, to }, draggingList)}
                            mode="removable"
                            draggable

                        >
                            {task.title}

                        </Cell>
                    ))}
                </List>

                {/*/!* Список подзадач *!/*/}
                {/*{selectedTaskID && (*/}
                {/*    <Group header={<Header mode="secondary">Подзадачи</Header>}>*/}
                {/*        <List>*/}
                {/*            {subTasks.map((subtask: any) => (*/}
                {/*                <Cell key={subtask._key} subtitle={subtask.description}>*/}
                {/*                    {subtask.title}*/}
                {/*                </Cell>*/}
                {/*            ))}*/}
                {/*        </List>*/}
                {/*    </Group>*/}
                {/*)}*/}

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
                                {text.length > 0 && selectAction === "addNewReport" && renderAddListBusinessButton()}
                                {text.length > 0 && selectAction === "addListBusiness" && renderAddNewReportButton()}
                            </>
                        }

                        after={
                            <>
                                {text.length === 0 && (
                                    <>
                                        {selectAction === "addListBusiness" && <WriteBarIcon mode="send" disabled />}
                                        {selectAction === "addNewReport" && <WriteBarIcon mode="send" disabled />}
                                    </>
                                )}
                                {text.length > 0 && (
                                    <>
                                        {selectAction === "addListBusiness" && (
                                            <WriteBarIcon mode="send" onClick={() => {
                                                const userID = thisUserID ?? "unknown";
                                                const newTask = createNewTask(text, userID, selectedTaskID);
                                                createTask(newTask);
                                                setText("");
                                            }} />
                                        )}
                                        {selectAction === "addNewReport" && (
                                            <WriteBarIcon mode="send" onClick={() => {
                                                const userID = thisUserID ?? "unknown";
                                                const newReport = createNewReport(text, userID, selectedTaskID);
                                                addReportToTask(newReport);
                                                setText("");
                                            }} />
                                        )}
                                    </>
                                )}
                            </>
                        }
                        onKeyDown={(e) => {
                            if (text.length > 0 && e.key === 'Enter' && !e.ctrlKey) {
                                e.preventDefault();
                                const userID = thisUserID ?? "unknown";
                                if (selectAction === "addListBusiness") {
                                    const newTask = createNewTask(text, userID, selectedTaskID);
                                    createTask(newTask);
                                } else if (selectAction === "addNewReport") {
                                    const newReport = createNewReport(text, userID, selectedTaskID);
                                    addReportToTask(newReport);
                                }
                                setText("");
                            } else if (e.key === 'Enter' && e.ctrlKey) {
                                setText(text + "\n");
                            }
                        }}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
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