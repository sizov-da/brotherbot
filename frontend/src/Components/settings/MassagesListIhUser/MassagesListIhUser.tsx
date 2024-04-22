import {Avatar, Group, Header, MiniInfoCell, Pagination, Spacing} from "@vkontakte/vkui";
import {Icon20CommentOutline, Icon20UserCircleFillBlue} from "@vkontakte/icons";
import React, {useEffect} from "react";
import BotCalendarPage from "../../Calendar/BotCalendarPage";

const MassagesListIhUser = ({users, selectUserMassages, thisUserID}: any) => {
    const [bottomPadding] = React.useState(0);
    const [limit, setLimit] = React.useState(5);
    const allPage = Math.ceil(selectUserMassages.length / limit - 1)
    const [currentPage, setCurrentPage] = React.useState(allPage);


    useEffect(() => {
        setCurrentPage(allPage)

    }, [thisUserID, selectUserMassages.length, allPage])


    const userWriteMessage = (message: { from: any; }) => {
        let thisUser
        if (message) {
            for (let i = 0; i < users.length; i++) {

                console.log(users.length, message)
                if (users[i].userID === message.from) {
                    thisUser = (users[i])
                }
            }
        }
        return thisUser
    }

    const renderOffsetMessagesAndFilter = () => {
        let renderMassage = []
        if (selectUserMassages.length) {
            let test = (currentPage * limit + limit) > selectUserMassages.length ? selectUserMassages.length : (currentPage * limit + limit)

            for (let i = currentPage * limit; i < test; i++) {
                let massage = selectUserMassages[i]
                if (massage) {
                    renderMassage.push(<div key={i}>
                        <MiniInfoCell
                            mode="more"
                            before={<Avatar
                                size={24}
                                src={'/frontend/build/images/avatar.jpeg'}
                            >
                                {userWriteMessage(massage).connected && userWriteMessage(massage).userID === thisUserID &&
                                    <Avatar.Badge background={"stroke"}>
                                        <Icon20UserCircleFillBlue width={12} height={12}/>
                                    </Avatar.Badge>}
                                {userWriteMessage(massage).connected && userWriteMessage(massage).userID !== thisUserID &&
                                    <Avatar.BadgeWithPreset preset={"online"}/>
                                }
                            </Avatar>}
                        >
                            {String(userWriteMessage(massage).username)} {userWriteMessage(massage).connected && userWriteMessage(massage).userID === thisUserID && '(Это я)'}
                        </MiniInfoCell>
                        <MiniInfoCell before={<Icon20CommentOutline/>} textWrap="short">
                            {massage.content}
                        </MiniInfoCell>
                        <Spacing/>
                    </div>)
                }
            }

            return (<>{renderMassage.map((item) => (
                <>
                    {item}
                </>
            ))}</>)
        } else {
            return (<div>
                <Header>Нет сообщений</Header>
            </div>)
        }


    }

    return (<>
        <Group header={<Header mode="secondary">Сообщения</Header>}>
            {allPage > 0 ? <Pagination
                currentPage={currentPage}
                siblingCount={1}
                boundaryCount={1}
                totalPages={allPage}
                onChange={(numberPage) => {
                    setCurrentPage(numberPage)
                }}
            /> : <> </>}
            <div style={{height: bottomPadding}}/>
            {renderOffsetMessagesAndFilter()}
        </Group>
    </>)
}
export default MassagesListIhUser;
