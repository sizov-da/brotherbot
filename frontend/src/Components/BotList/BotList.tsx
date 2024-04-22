import React, {useEffect, useState} from 'react';
import {
    Cell,
    List,
    Button,
    Avatar,
    Pagination,
    Placeholder,
    Header,
    Group
} from "@vkontakte/vkui";
import {
    Icon24Add,
    Icon28ClockOutline
} from "@vkontakte/icons";
import socket from "../../Logics/socket";
import useSocket from "../../hooks/useSocket";



const BotList = ( {props}: any ) => {

    const [draggingList, updateDraggingList] = React.useState([
        'Проект, ',
        'Hello',
        'To',
        'My',
    ]);
    const [currentPage, setCurrentPage] = useState<number | undefined>(1);
    const [siblingCount,] = useState(0);
    const [boundaryCount,] = useState(1);
    const [totalPages,] = useState(123);
    const [disabled,] = useState(false);

    const handleChange = React.useCallback((page: React.SetStateAction<number | undefined>) => {
        setCurrentPage(page);
    }, []);

    // const [tasks, setTasks] = React.useState<any>([]);
    // const [sessionID, setSessionID] = React.useState <string | null>(null);
    const { users, sendNewTask, selectedUser, selectUserMassages, thisUserID, sendMassage, selectedUser2 ,tasksList } = useSocket( props );

    const [buttonClicked, setButtonClicked] = useState(false);

    const handleButtonClick = () => {
        sendNewTask({
            userID: thisUserID,
            title: 'Task title ' + thisUserID,
            description: 'Task description',
            status: 'pending',
        });
        setButtonClicked(true);
    };

    useEffect(() => {
        if (buttonClicked) {
            // Здесь вызывайте функцию обновления страницы
            // Например, вы можете вызвать функцию, которая получает новый список задач
            // Затем сбросьте состояние buttonClicked обратно в false
            setButtonClicked(false);
        }
    }, [buttonClicked, tasksList]);

    const onDragFinish = ({from, to}: { from: any; to: any }) => {
        const _list = [...draggingList];
        _list.splice(from, 1);
        _list.splice(to, 0, draggingList[from]);
        updateDraggingList(_list);
    };

    useEffect(() => {
        console.log("#1", users)
    }, [users])

    console.log("#1", thisUserID)
    console.log("#1", users)


    return (<>
        <Group
            header={
                <Header mode="secondary" indicator="25"  aside={
                    <Button size="s"
                            appearance="accent"
                            onClick={handleButtonClick}
                            before={<Icon24Add/>}/>
                }>
                    Новые события
                </Header>
            }
        >
            <List>
                {Array.isArray(tasksList) && tasksList.map((task : any) => (
                    <Cell key={task._key}
                          before={<Avatar fallbackIcon={<Icon28ClockOutline/>}/>}
                          draggable
                          onDragFinish={onDragFinish}
                          subtitle={task.description}
                    >
                        {task.title}
                    </Cell>
                ))}
            </List>
            <Placeholder>
                <Pagination
                    currentPage={currentPage}
                    siblingCount={siblingCount}
                    boundaryCount={boundaryCount}
                    totalPages={totalPages}
                    disabled={disabled}
                    onChange={handleChange}
                />
            </Placeholder>
        </Group>
        </>
    );

};

export default BotList;
