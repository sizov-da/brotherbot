import React, {useState} from 'react';
import {
    Cell,
    List,
    Avatar,
    Pagination, Placeholder
} from "@vkontakte/vkui";
import {
    Icon28ClockOutline
} from "@vkontakte/icons";

const BotList: React.FC = () => {

    const [draggingList, updateDraggingList] = React.useState([
        'Проект, ',
        'Hello',
        'To',
        'My',
        'Little',
        'Friend',
    ]);


    const onDragFinish  = ({from, to }:{ from:any; to:any } ) => {
        const _list = [...draggingList];
        _list.splice(from, 1);
        _list.splice(to, 0, draggingList[from]);
        updateDraggingList(_list);
    };




    const [currentPage, setCurrentPage] = useState<number | undefined>(1);
    const [siblingCount, ] = useState(0);
    const [boundaryCount, ] = useState(1);
    const [totalPages, ] = useState(123);
    const [disabled, ] = useState(false);

    const handleChange = React.useCallback((page: React.SetStateAction<number | undefined>) => {
        setCurrentPage(page);
    }, []);




    return ( <>
                <List>
                    {draggingList.map((item) => (
                        <Cell key={item}
                              before={<Avatar fallbackIcon={<Icon28ClockOutline />} />}
                              draggable
                              onDragFinish={onDragFinish}
                              subtitle="Описание проекта Описание проекта Описание проекта Описание проекта Описание проекта Описание проекта Описание проекта Описание проекта Описание проекта Описание проекта Описание проекта Описание проекта"
                        >
                            {item}
                        </Cell>
                    ))}
                </List>

            <Placeholder><Pagination
                             currentPage={currentPage}
                             siblingCount={siblingCount}
                             boundaryCount={boundaryCount}
                             totalPages={totalPages}
                             disabled={disabled}
                             onChange={handleChange}
            /></Placeholder>


            </>
    );

};

export default BotList ;
