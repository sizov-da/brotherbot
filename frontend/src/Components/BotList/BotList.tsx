import React, {useEffect, useState} from 'react';
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
    Icon24Add, Icon28FolderOutline , Icon24FolderOutline,
    Icon28ClockOutline, Icon28DocumentOutline, Icon24DocumentOutline, Icon20FolderFill
} from "@vkontakte/icons";
import useSocket from "../../hooks/useSocket";

const BotList = ({ props, attachmentsCount }: any ) => {
    const {
        users,
        sendNewTask,
        thisUserID,
        tasksList,
        text,
        setText
    } = useSocket( props );

    const [selectAction, setSelectAction] = useState<any>("addNewReport");

    const [draggingList, updateDraggingList] = React.useState(tasksList);
    const [currentPage, setCurrentPage] = useState<number | undefined>(1);
    const [siblingCount,] = useState(0);
    const [boundaryCount,] = useState(1);
    const [totalPages,] = useState(123);
    const [disabled,] = useState(false);

    const handleChange = React.useCallback((page: React.SetStateAction<number | undefined>) => {
        setCurrentPage(page);
    }, []);


    const [buttonClicked, setButtonClicked] = useState(false);

    const platform = usePlatform();

    const addListBusiness = (
        <Tooltip placement="top" text="Добавить дело">
            <Button id="tooltip-1" mode="link" onClick={ ()=>{setSelectAction("addListBusiness");}} >
                <AdaptiveIconRenderer
                    IconCompact={platform === 'ios' ? Icon28FolderOutline : Icon24FolderOutline}
                    IconRegular={Icon28FolderOutline}/>
            </Button>
        </Tooltip>
    );
    const addNewReport = (
        <Tooltip placement="top" text="Добавить отчет">
            <Button id="tooltip-1" mode="link" onClick={()=>{setSelectAction("addNewReport");}}>
                <AdaptiveIconRenderer
                    IconCompact={platform === 'ios' ? Icon28DocumentOutline : Icon24DocumentOutline}
                    IconRegular={Icon28DocumentOutline}/>
            </Button>
        </Tooltip>
    );

    const handleButtonClick = () => {
        // sendNewTask({
        //     userID: thisUserID,
        //     title: 'Task title ' + thisUserID,
        //     description: 'Task description',
        //     status: 'pending',
        // });
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
        if (Array.isArray(draggingList)) {
            const _list = [...draggingList];
            _list.splice(from, 1);
            _list.splice(to, 0, draggingList[from]);
            updateDraggingList(_list);
        }
    };

    useEffect(() => {
        console.log("#1", users)
    }, [users])

    console.log("#1", thisUserID)
    console.log("#1", users)


    return (<>
            <PanelHeader before={true?<Icon20FolderFill/>:<PanelHeaderBack/>}>Список дел</PanelHeader>
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
            <Group style={{height: '20px', opacity: 0}}>
            </Group>
            <FixedLayout vertical="bottom" filled>
                <div>
                    <Separator wide/>
                    <WriteBar
                        before={
                            <>
                                {text.length === 0 && (
                                    <WriteBarIcon>{addListBusiness}</WriteBarIcon>
                                )}
                                {text.length === 0 && (
                                    <WriteBarIcon>
                                        {addNewReport}
                                    </WriteBarIcon>
                                )}
                                {text.length > 0 &&
                                    <>
                                        {(selectAction === "addListBusiness") &&
                                            <WriteBarIcon>{addListBusiness}</WriteBarIcon>}
                                        {(selectAction === "addNewReport") &&
                                            <WriteBarIcon>{addNewReport}</WriteBarIcon>}
                                    </>
                                }
                            </>
                        }
                        after={
                            <>
                                {text.length === 0 && (
                                    <WriteBarIcon mode="send" disabled={true} />
                                )}
                                {text.length > 0 &&
                                    <WriteBarIcon mode="send" onClick={() => sendNewTask()}/>}
                            </>
                        }
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (text.length > 0 && e.key === 'Enter' && !e.ctrlKey) {
                                if (text === '\n') {
                                    e.preventDefault();
                                    setText('')
                                }
                                else
                                {
                                    e.preventDefault();
                                    sendNewTask();
                                }
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
